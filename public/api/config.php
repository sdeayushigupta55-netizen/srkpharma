<?php

declare(strict_types=1);

return [

    'site_name' => 'SRK PHARMA',

    // Hostinger email account
    'smtp_username' => 'info@srkpharma.in',
    'smtp_password' => 'Srkpharma@123',

    'from_email' => 'info@srkpharma.in',
    'contact_email' => 'info@srkpharma.in',

    // OTP validity: 5 minutes
    'otp_expiry_seconds' => 300,

    // Request another OTP after 60 seconds
    'rate_limit_seconds' => 60,

    // Hostinger SMTP
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 587,
    'smtp_encryption' => 'tls',

    'allowed_origins' => [
        'https://srkpharma.in',
        'https://www.srkpharma.in',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
    ],

    'email' => [
        'log_otp' => true,
    ],
];