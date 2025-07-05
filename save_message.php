<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nick = strip_tags($_POST['nick']);
    $message = strip_tags($_POST['message']);
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];



    $blocked = ['kvvz', 'kvvzie', 'nigger', 'nigga', 'faggot'];
    if (in_array(strtolower($nick), $blocked)) {
        http_response_code(403);
        echo 'forbidden name.';
        exit;
    }

    $timestamp = time();
    file_put_contents("global.chat", "[$timestamp] <$nick>: $message\n", FILE_APPEND);
    file_put_contents("chat.log", "[$timestamp] <$nick>: $message |$ip| |$userAgent|\n", FILE_APPEND);
}
?>
