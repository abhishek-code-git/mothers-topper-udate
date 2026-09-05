<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    render_response('Method not allowed', 'Please submit the form from the website.');
    exit;
}

if (!empty($_POST['website'] ?? '')) {
    http_response_code(400);
    render_response('Unable to submit', 'Please try again from the website form.');
    exit;
}

$leadType = clean($_POST['lead_type'] ?? 'contact');
$allowedTypes = ['student', 'franchise', 'contact'];
if (!in_array($leadType, $allowedTypes, true)) {
    $leadType = 'contact';
}

$required = [
    'student' => ['parent_name', 'student_name', 'class', 'city', 'phone'],
    'franchise' => ['full_name', 'phone', 'city', 'state'],
    'contact' => ['full_name', 'phone', 'message'],
];

$missing = [];
foreach ($required[$leadType] as $field) {
    if (clean($_POST[$field] ?? '') === '') {
        $missing[] = labelize($field);
    }
}

$email = clean($_POST['email'] ?? '');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $missing[] = 'valid Email';
}

if ($missing) {
    http_response_code(422);
    render_response('Please complete the form', 'Missing or invalid: ' . htmlspecialchars(implode(', ', $missing), ENT_QUOTES, 'UTF-8') . '.');
    exit;
}

$labelsByType = [
    'student' => [
        'parent_name', 'student_name', 'class', 'subjects', 'city', 'learning_mode',
        'phone', 'email', 'preferred_centre', 'message'
    ],
    'franchise' => [
        'full_name', 'phone', 'email', 'city', 'state', 'occupation',
        'commercial_space', 'investment_range', 'education_experience', 'message'
    ],
    'contact' => ['full_name', 'phone', 'email', 'city', 'message'],
];

$subjectMap = [
    'student' => 'New Student Enquiry - Mother\'s Topper',
    'franchise' => 'New Franchise Enquiry - Mother\'s Topper',
    'contact' => 'New Website Enquiry - Mother\'s Topper',
];

$rows = '';
foreach ($labelsByType[$leadType] as $field) {
    $value = clean($_POST[$field] ?? '');
    if ($value === '') {
        continue;
    }
    $rows .= '<tr><th style="text-align:left;padding:10px;border:1px solid #dbe5f2;background:#f7f9fc;">'
        . htmlspecialchars(labelize($field), ENT_QUOTES, 'UTF-8')
        . '</th><td style="padding:10px;border:1px solid #dbe5f2;">'
        . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'))
        . '</td></tr>';
}

$message = '<!doctype html><html><body>'
    . '<h2 style="font-family:Arial,sans-serif;color:#1557b0;">' . htmlspecialchars($subjectMap[$leadType], ENT_QUOTES, 'UTF-8') . '</h2>'
    . '<table style="border-collapse:collapse;width:100%;max-width:720px;font-family:Arial,sans-serif;font-size:14px;">'
    . $rows
    . '</table>'
    . '</body></html>';

$to = 'connectmotherstopper@gmail.com';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Mother\'s Topper Website <connectmotherstopper@gmail.com>',
];

if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = mail($to, $subjectMap[$leadType], $message, implode("\r\n", $headers));

if ($sent) {
    render_response('Thank you', 'Your enquiry has been submitted. The Mother\'s Topper team will review it and contact you.');
    exit;
}

http_response_code(500);
render_response('Submission received, mail failed', 'The server could not send email right now. Please call +91-9650155434 or email connectmotherstopper@gmail.com.');

function clean(string $value): string
{
    $value = str_replace(["\r", "\0"], '', $value);
    return trim($value);
}

function labelize(string $field): string
{
    return ucwords(str_replace('_', ' ', $field));
}

function render_response(string $title, string $message): void
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle} | Mother's Topper</title>
  <link rel="icon" href="img/logo.png">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main class="page-hero" style="min-height:100vh;display:grid;place-items:center;">
    <div class="container" style="display:block;max-width:760px;text-align:center;">
      <img src="img/logo.png" alt="Mother's Topper logo" width="407" height="136" style="width:240px;margin:0 auto 28px;">
      <p class="eyebrow">Mother's Topper</p>
      <h1>{$safeTitle}</h1>
      <p class="hero-lede" style="margin-left:auto;margin-right:auto;">{$safeMessage}</p>
      <div class="hero-actions" style="justify-content:center;">
        <a class="btn btn-primary" href="index.html">Back to Home</a>
        <a class="btn btn-outline" href="contact.html">Contact Us</a>
      </div>
    </div>
  </main>
</body>
</html>
HTML;
}
