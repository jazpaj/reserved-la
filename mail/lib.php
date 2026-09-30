<?php
/**
 * Reserved LA — minimal helpers: template rendering + SMTP sending (via PHPMailer).
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';

/* ---------- Template rendering --------------------------------------- */
/* Supports {{variable}} and {{#each list}} ... {{/each}}. Values HTML-escaped. */

function rl_esc($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }

function rl_replace_vars($tpl, array $ctx, array $globals = []) {
    return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($m) use ($ctx, $globals) {
        $k = $m[1];
        if (array_key_exists($k, $ctx))         $v = $ctx[$k];
        elseif (array_key_exists($k, $globals)) $v = $globals[$k];
        else return '';
        return strpos($k, 'raw_') === 0 ? (string)$v : rl_esc($v);
    }, $tpl);
}

function rl_render($tpl, array $data) {
    $tpl = preg_replace_callback('/\{\{\s*#each\s+([a-zA-Z0-9_]+)\s*\}\}(.*?)\{\{\s*\/each\s*\}\}/s',
        function ($m) use ($data) {
            $rows = (isset($data[$m[1]]) && is_array($data[$m[1]])) ? $data[$m[1]] : [];
            $out = '';
            foreach ($rows as $row) if (is_array($row)) $out .= rl_replace_vars($m[2], $row, $data);
            return $out;
        }, $tpl);
    return rl_replace_vars($tpl, $data, $data);
}

function rl_render_file($name, array $data) {
    $path = __DIR__ . '/templates/' . basename($name);
    if (!is_file($path)) throw new RuntimeException("Template not found: $name");
    return rl_render(file_get_contents($path), $data);
}

/* ---------- SMTP send (Microsoft 365 / Outlook) --------------------- */

function rl_send_smtp(array $opts) {
    $cfg = rl_config();
    if (empty($cfg['SMTP_PASS']) || strpos((string)$cfg['SMTP_PASS'], 'YOUR_') === 0) {
        return ['ok' => false, 'status' => 500, 'id' => null, 'error' => 'SMTP password not set in config.php'];
    }
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $cfg['SMTP_HOST'];
        $mail->Port       = (int)$cfg['SMTP_PORT'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $cfg['SMTP_USER'];
        $mail->Password   = $cfg['SMTP_PASS'];
        $mail->SMTPSecure = ($cfg['SMTP_SECURE'] === 'ssl')
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        if (!empty($cfg['SMTP_DEBUG'])) { $mail->SMTPDebug = SMTP::DEBUG_SERVER; $mail->Debugoutput = 'error_log'; }
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Timeout = 20;

        $mail->setFrom($cfg['FROM_EMAIL'], $cfg['FROM_NAME'] ?? 'Reserved LA');
        if (!empty($cfg['REPLY_TO'])) $mail->addReplyTo($cfg['REPLY_TO']);
        $to = is_array($opts['to']) ? $opts['to'] : [$opts['to']];
        foreach ($to as $addr) $mail->addAddress($addr);

        $mail->isHTML(true);
        $mail->Subject = $opts['subject'] ?? '';
        $mail->Body    = $opts['html'] ?? '';
        $mail->AltBody = trim(preg_replace('/\s+/', ' ', strip_tags($opts['html'] ?? '')));

        $mail->send();
        return ['ok' => true, 'status' => 200, 'id' => $mail->getLastMessageID() ?: null, 'error' => null];
    } catch (PHPMailerException $e) {
        return ['ok' => false, 'status' => 502, 'id' => null, 'error' => $mail->ErrorInfo ?: $e->getMessage()];
    } catch (\Throwable $e) {
        return ['ok' => false, 'status' => 500, 'id' => null, 'error' => $e->getMessage()];
    }
}

/* ---------- Order confirmation (shared by both endpoints) ------------ */

function rl_send_order_confirmation(array $data) {
    if (empty($data['customer_email']) || !filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'status' => 422, 'id' => null, 'error' => 'A valid customer_email is required.'];
    }
    if (empty($data['item_count']) && !empty($data['items']) && is_array($data['items'])) {
        $data['item_count'] = count($data['items']);
    }
    $subject = 'Your Reserved LA order ' . ($data['order_number'] ?? '') . ' is confirmed';
    try {
        $html = rl_render_file('order-confirmation.html', $data);
    } catch (Throwable $e) {
        return ['ok' => false, 'status' => 500, 'id' => null, 'error' => 'Template error: ' . $e->getMessage()];
    }
    $res = rl_send_smtp(['to' => $data['customer_email'], 'subject' => $subject, 'html' => $html]);
    $res['subject'] = $subject;
    return $res;
}

/* ---------- Sample data (for the test send) ------------------------- */

function rl_sample_order() {
    $items = [
        ['name'=>'Washed Hooded Chore Jacket','color'=>'Washed Black','size'=>'L','quantity'=>1,'line_total'=>'$148.00',
         'image_url'=>'https://reservedla.com/assets/products/rl-jk-0142-front.jpg'],
        ['name'=>'Baggy Multi-Pocket Cargo Jeans','color'=>'Mid Indigo','size'=>'32','quantity'=>1,'line_total'=>'$118.00',
         'image_url'=>'https://reservedla.com/assets/products/rl-dn-0088-front.jpg'],
    ];
    return [
        'customer_first_name'=>'Alex','customer_email'=>'alex@example.com',
        'order_number'=>'RL-100482','order_date'=>date('M j, Y'),
        'payment_method'=>'Visa ending 4242','estimated_delivery'=>date('M j, Y', strtotime('+7 days')),
        'item_count'=>count($items),'items'=>$items,
        'subtotal'=>'$266.00','shipping'=>'Free','tax'=>'$24.19','total'=>'$290.19',
        'shipping_name'=>'Alex Rivera','shipping_address_line1'=>'742 Sunset Blvd',
        'shipping_city'=>'Los Angeles','shipping_state'=>'CA','shipping_zip'=>'90026',
        'shipping_method'=>'Standard US','order_url'=>'https://reservedla.com/track-order.html',
    ];
}
