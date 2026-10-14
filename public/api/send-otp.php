<?php

declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/mail.php';

cors_headers($config);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, [
        'success' => false,
        'message' => 'Method not allowed.',
    ]);
}

$body = read_json_body();
$email = strtolower(trim((string) ($body['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(422, [
        'success' => false,
        'message' => 'Enter a valid email address.',
    ]);
}

$lastSent = (int) ($_SESSION['contact_otp_sent_at'] ?? 0);
$rateLimit = (int) ($config['rate_limit_seconds'] ?? 60);

if ($lastSent > 0 && (time() - $lastSent) < $rateLimit) {
    $wait = $rateLimit - (time() - $lastSent);

    json_response(429, [
        'success' => false,
        'message' => 'Please wait ' . $wait . ' seconds before requesting another OTP.',
        'retry_after' => $wait,
    ]);
}

$otp = generate_otp();
$expiry = (int) ($config['otp_expiry_seconds'] ?? 300);

$_SESSION['contact_otp'] = password_hash($otp, PASSWORD_DEFAULT);
$_SESSION['contact_otp_email'] = $email;
$_SESSION['contact_otp_expires_at'] = time() + $expiry;
$_SESSION['contact_otp_sent_at'] = time();
session_write_close();

if (!send_otp_email($config, $email, $otp)) {
    unset(
        $_SESSION['contact_otp'],
        $_SESSION['contact_otp_email'],
        $_SESSION['contact_otp_expires_at'],
        $_SESSION['contact_otp_sent_at']
    );

    json_response(500, [
        'success' => false,
        'message' => 'Unable to send OTP email. Check SMTP settings in api/config.php.',
    ]);
}

json_response(200, [
    'success' => true,
    'message' => 'OTP sent to ' . $email . '. Please check your inbox and spam folder.',
    'expires_in' => $expiry,
]);
