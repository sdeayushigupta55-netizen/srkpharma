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

// ---------------------------------------------------------
// Start session
// ---------------------------------------------------------

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
// ---------------------------------------------------------
// Get form data
// ---------------------------------------------------------

$name = sanitize(
    (string) ($body['name'] ?? ''),
    120
);

$email = sanitize(
    (string) ($body['email'] ?? ''),
    160
);

$mobile = normalize_mobile(
    (string) ($body['mobile'] ?? '')
);

$subject = sanitize(
    (string) ($body['subject'] ?? 'General Inquiry'),
    120
);

$message = sanitize(
    (string) ($body['message'] ?? ''),
    4000
);

$otp = preg_replace(
    '/\D+/',
    '',
    (string) ($body['otp'] ?? '')
) ?? '';

// ---------------------------------------------------------
// Basic validation
// ---------------------------------------------------------

if ($name === '' || $message === '') {
    json_response(422, [
        'success' => false,
        'message' => 'Name and message are required.',
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(422, [
        'success' => false,
        'message' => 'Enter a valid email address.',
    ]);
}

if ($mobile === null) {
    json_response(422, [
        'success' => false,
        'message' => 'Enter a valid 10-digit mobile number.',
    ]);
}

if (strlen($otp) !== 6) {
    json_response(422, [
        'success' => false,
        'message' => 'Enter the 6-digit OTP sent to your email.',
    ]);
}

// ---------------------------------------------------------
// Verify EMAIL OTP
// ---------------------------------------------------------

$storedOtpHash = $_SESSION['contact_otp'] ?? '';
$storedOtpEmail = strtolower(
    (string) ($_SESSION['contact_otp_email'] ?? '')
);
$otpExpiresAt = (int) (
    $_SESSION['contact_otp_expires_at'] ?? 0
);
$currentEmail = strtolower($email);

// Check whether OTP exists.
if ($storedOtpHash === '') {
    json_response(401, [
        'success' => false,
        'message' => 'No OTP found. Please request a new OTP.',
    ]);
}

// Check that OTP belongs to the submitted email.
if ($storedOtpEmail === '' || $storedOtpEmail !== $currentEmail) {
    json_response(401, [
        'success' => false,
        'message' => 'The OTP does not belong to this email address. Please request a new OTP.',
    ]);
}

// Check expiry.
if ($otpExpiresAt <= time()) {

    unset(
        $_SESSION['contact_otp'],
        $_SESSION['contact_otp_email'],
        $_SESSION['contact_otp_expires_at'],
        $_SESSION['contact_otp_sent_at']
    );

    json_response(401, [
        'success' => false,
        'message' => 'OTP has expired. Please request a new OTP.',
    ]);
}

// Verify OTP.
if (!password_verify($otp, $storedOtpHash)) {
    json_response(401, [
        'success' => false,
        'message' => 'Invalid OTP. Please check the code and try again.',
    ]);
}

// ---------------------------------------------------------
// OTP is valid
// ---------------------------------------------------------

$to = $config['contact_email'] ?? 'info@srkpharma.in';

$from = $config['from_email'] ?? 'noreply@srkpharma.in';

$site = $config['site_name'] ?? 'SRK PHARMA';

// ---------------------------------------------------------
// Prepare contact email
// ---------------------------------------------------------

$mailSubject = '[' . $site . '] ' . $subject;

$mailBody = implode("\n", [
    'New contact form submission',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Mobile: +91-' . $mobile,
    'Subject: ' . $subject,
    '',
    'Message:',
    $message,
    '',
    'Submitted: ' . date('c'),
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
]);

// ---------------------------------------------------------
// Email headers
// ---------------------------------------------------------

$sent = send_email_smtp(
    $config,
    $to,
    $mailSubject,
    $mailBody
);

if (!$sent) {
    json_response(500, [
        'success' => false,
        'message' => 'Message could not be sent. Check Hostinger mail settings.',
    ]);
}

// ---------------------------------------------------------
// Remove OTP after successful submission
// ---------------------------------------------------------

unset(
    $_SESSION['contact_otp'],
    $_SESSION['contact_otp_email'],
    $_SESSION['contact_otp_expires_at'],
    $_SESSION['contact_otp_sent_at']
);

// ---------------------------------------------------------
// Success
// ---------------------------------------------------------

json_response(200, [
    'success' => true,
    'message' => 'Thank you. Your message has been sent successfully.',
]);