<?php

declare(strict_types=1);

function log_email_otp(string $email, string $otp, string $status = 'sent'): void
{
    $line = sprintf(
        "%s | %s | EMAIL=%s | OTP=%s\n",
        date('Y-m-d H:i:s'),
        strtoupper($status),
        $email,
        $otp
    );

    file_put_contents(
        dirname(__DIR__) . '/otp-debug.log',
        $line,
        FILE_APPEND | LOCK_EX
    );
}

function smtp_read($socket): string
{
    $data = '';

    while (!feof($socket)) {
        $line = fgets($socket, 515);
        if ($line === false) {
            break;
        }

        $data .= $line;

        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    return $data;
}

function smtp_expect(string $response, array $codes): bool
{
    $code = (int) substr(trim($response), 0, 3);
    return in_array($code, $codes, true);
}

function smtp_write($socket, string $command): void
{
    fwrite($socket, $command . "\r\n");
}

function send_email_smtp(array $config, string $to, string $subject, string $body): bool
{
    $host = (string) ($config['smtp_host'] ?? 'smtp.gmail.com');
    $port = (int) ($config['smtp_port'] ?? 587);
    $encryption = strtolower((string) ($config['smtp_encryption'] ?? 'tls'));
    $username = trim((string) ($config['gmail_username'] ?? $config['smtp_username'] ?? ''));
    $password = trim((string) ($config['gmail_app_password'] ?? $config['smtp_password'] ?? ''));
    $from = trim((string) ($config['from_email'] ?? $username));
    $siteName = (string) ($config['site_name'] ?? 'SRK PHARMA');

    if ($username === '' || $password === '' || $from === '') {
        error_log('SMTP missing credentials in config.php');
        return false;
    }

    $transport = $encryption === 'ssl'
        ? "ssl://{$host}:{$port}"
        : "tcp://{$host}:{$port}";

    $socket = @stream_socket_client($transport, $errno, $errstr, 30);

    if (!$socket) {
        error_log("SMTP connect failed ({$transport}): {$errstr} ({$errno})");
        return false;
    }

    stream_set_timeout($socket, 30);

    if (!smtp_expect(smtp_read($socket), [220])) {
        fclose($socket);
        return false;
    }

    smtp_write($socket, 'EHLO srkpharma.in');

    if (!smtp_expect(smtp_read($socket), [250])) {
        fclose($socket);
        return false;
    }

    if ($encryption === 'tls') {
        smtp_write($socket, 'STARTTLS');

        if (!smtp_expect(smtp_read($socket), [220])) {
            fclose($socket);
            return false;
        }

        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            error_log('SMTP STARTTLS failed');
            fclose($socket);
            return false;
        }

        smtp_write($socket, 'EHLO srkpharma.in');

        if (!smtp_expect(smtp_read($socket), [250])) {
            fclose($socket);
            return false;
        }
    }

    smtp_write($socket, 'AUTH LOGIN');

    if (!smtp_expect(smtp_read($socket), [334])) {
        fclose($socket);
        return false;
    }

    smtp_write($socket, base64_encode($username));

    if (!smtp_expect(smtp_read($socket), [334])) {
        fclose($socket);
        return false;
    }

    smtp_write($socket, base64_encode($password));
    $authResponse = smtp_read($socket);

    if (!smtp_expect($authResponse, [235])) {
        error_log('SMTP authentication failed: ' . trim($authResponse));
        fclose($socket);
        return false;
    }

    smtp_write($socket, "MAIL FROM:<{$from}>");
    if (!smtp_expect(smtp_read($socket), [250])) {
        fclose($socket);
        return false;
    }

    smtp_write($socket, "RCPT TO:<{$to}>");
    if (!smtp_expect(smtp_read($socket), [250, 251])) {
        fclose($socket);
        return false;
    }

    smtp_write($socket, 'DATA');
    if (!smtp_expect(smtp_read($socket), [354])) {
        fclose($socket);
        return false;
    }

    $messageId = '<otp-' . bin2hex(random_bytes(8)) . '@srkpharma.in>';
    $date = date('r');
    $normalizedBody = str_replace(["\r\n", "\r"], "\n", $body);
    $normalizedBody = str_replace("\n", "\r\n", $normalizedBody);

    $payload = implode("\r\n", [
        "Date: {$date}",
        "From: {$siteName} <{$from}>",
        "To: {$to}",
        "Subject: {$subject}",
        "Message-ID: {$messageId}",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        $normalizedBody,
    ]);

    fwrite($socket, $payload . "\r\n.\r\n");
    $dataResponse = smtp_read($socket);

    // if (!smtp_expect($dataResponse, [250])) {
    //     error_log('SMTP DATA failed: ' . trim($dataResponse));
    //     fclose($socket);
    //     return false;
    // }
    file_put_contents(
    dirname(__DIR__) . '/smtp-debug.log',
    date('Y-m-d H:i:s') .
    " | TO={$to} | RESPONSE=" . trim($dataResponse) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

if (!smtp_expect($dataResponse, [250])) {
    error_log('SMTP DATA failed: ' . trim($dataResponse));
    fclose($socket);
    return false;
}

    smtp_write($socket, 'QUIT');
    fclose($socket);

    return true;
}

function send_otp_email(array $config, string $email, string $otp): bool
{
    $siteName = (string) ($config['site_name'] ?? 'SRK PHARMA');
    $expiryMinutes = max(1, (int) (($config['otp_expiry_seconds'] ?? 300) / 60));

    $subject = "{$siteName} - Your verification code";
    $body = implode("\n", [
        'Hello,',
        '',
        "Your verification code for {$siteName} is: {$otp}",
        '',
        "This code is valid for {$expiryMinutes} minutes.",
        'If you did not request this code, you can safely ignore this email.',
        '',
        'Regards,',
        $siteName,
    ]);

    $sent = send_email_smtp($config, $email, $subject, $body);
    $shouldLog = ($config['email']['log_otp'] ?? true) === true;

    if ($shouldLog) {
        log_email_otp($email, $otp, $sent ? 'sent' : 'failed');
    }

    return $sent;
}
