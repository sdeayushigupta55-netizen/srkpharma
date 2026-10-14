<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = dirname(__DIR__) . '/config.php';
$samplePath = dirname(__DIR__) . '/config.sample.php';

if (!file_exists($configPath)) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Server not configured. Copy api/config.sample.php to api/config.php on Hostinger.',
    ]);
    exit;
}

$config = require $configPath;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function cors_headers(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = $config['allowed_origins'] ?? [];

    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function normalize_mobile(string $mobile): ?string
{
    $digits = preg_replace('/\D+/', '', $mobile) ?? '';

    if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
        $digits = substr($digits, 2);
    }

    if (strlen($digits) !== 10 || !preg_match('/^[6-9]\d{9}$/', $digits)) {
        return null;
    }

    return $digits;
}

function generate_otp(): string
{
    return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

function otp_storage_dir(): string
{
    $dir = dirname(__DIR__) . '/storage';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function log_otp(string $mobile, string $otp): void
{
    $line = sprintf("[%s] mobile=%s otp=%s\n", date('c'), $mobile, $otp);
    file_put_contents(otp_storage_dir() . '/otp.log', $line, FILE_APPEND | LOCK_EX);
}

function send_sms(array $config, string $mobile, string $otp): bool
{
    $provider = $config['sms']['provider'] ?? 'log';
    $message = sprintf(
        'Your %s verification code is %s. Valid for 5 minutes.',
        $config['site_name'] ?? 'SRK PHARMA',
        $otp
    );

    if ($provider === 'log') {
        log_otp($mobile, $otp);
        return true;
    }

    if ($provider === 'msg91') {
        $authKey = $config['sms']['msg91']['auth_key'] ?? '';
        $senderId = $config['sms']['msg91']['sender_id'] ?? 'SRKPHM';
        $templateId = $config['sms']['msg91']['template_id'] ?? '';

        if ($authKey === '') {
            return false;
        }

        $payload = [
            'template_id' => $templateId,
            'short_url' => '0',
            'recipients' => [[
                'mobiles' => '91' . $mobile,
                'otp' => $otp,
            ]],
        ];

        $ch = curl_init('https://control.msg91.com/api/v5/flow/');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'authkey: ' . $authKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 15,
        ]);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $code >= 200 && $code < 300 && $response !== false;
    }

    if ($provider === 'fast2sms') {
        $apiKey = $config['sms']['fast2sms']['api_key'] ?? '';
        if ($apiKey === '') {
            return false;
        }

        $payload = http_build_query([
            'route' => 'otp',
            'variables_values' => $otp,
            'numbers' => $mobile,
        ]);

        $ch = curl_init('https://www.fast2sms.com/dev/bulkV2');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'authorization: ' . $apiKey,
                'Content-Type: application/x-www-form-urlencoded',
            ],
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_TIMEOUT => 15,
        ]);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $code >= 200 && $code < 300 && $response !== false;
    }

    return false;
}

function store_otp(string $mobile, string $otp, int $expirySeconds): void
{
    $_SESSION['contact_otp'] = [
        'mobile' => $mobile,
        'otp' => $otp,
        'expires_at' => time() + $expirySeconds,
        'attempts' => 0,
    ];
}

function verify_otp(string $mobile, string $otp, int $maxAttempts = 5): bool
{
    $record = $_SESSION['contact_otp'] ?? null;
    if (!is_array($record)) {
        return false;
    }

    if (($record['expires_at'] ?? 0) < time()) {
        unset($_SESSION['contact_otp']);
        return false;
    }

    if (($record['mobile'] ?? '') !== $mobile) {
        return false;
    }

    $_SESSION['contact_otp']['attempts'] = (int) ($record['attempts'] ?? 0) + 1;
    if ($_SESSION['contact_otp']['attempts'] > $maxAttempts) {
        unset($_SESSION['contact_otp']);
        return false;
    }

    if (!hash_equals((string) ($record['otp'] ?? ''), $otp)) {
        return false;
    }

    unset($_SESSION['contact_otp']);
    $_SESSION['contact_verified_mobile'] = $mobile;
    $_SESSION['contact_verified_until'] = time() + 900;

    return true;
}

function is_mobile_verified(string $mobile): bool
{
    return (
        isset($_SESSION['contact_verified_mobile'], $_SESSION['contact_verified_until'])
        && $_SESSION['contact_verified_mobile'] === $mobile
        && $_SESSION['contact_verified_until'] >= time()
    );
}

function sanitize(string $value, int $maxLength = 500): string
{
    $value = trim(strip_tags($value));
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}
