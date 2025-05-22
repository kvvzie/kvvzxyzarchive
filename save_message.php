<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nick = strip_tags($_POST['nick']);
    $message = strip_tags($_POST['message']);

    $blocked = ['kvvz', 'kvvzie',];
    if (in_array(strtolower($nick), $blocked)) {
        http_response_code(403);
        echo 'forbidden name.';
        exit;
    }

    $timestamp = time();
    file_put_contents("global.chat", "[$timestamp] <$nick>: $message\n", FILE_APPEND);
}
?>
