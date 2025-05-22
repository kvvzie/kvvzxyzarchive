<?php
$messages = file("global.chat");
foreach ($messages as $message) {
    preg_match('/\[(\d+)\] <([^>]+)>: (.*)/', $message, $matches);

    if (count($matches) === 4) {
        $timestamp = $matches[1];  
        $nick = htmlspecialchars($matches[2]);      
        $msg = htmlspecialchars($matches[3]);    

        $time_ago = time() - $timestamp;
        $time_display = '';

        if ($time_ago < 60) {
            $time_display = $time_ago . ' sec. ago';
        } elseif ($time_ago < 3600) {
            $time_display = floor($time_ago / 60) . ' min. ago';
        } elseif ($time_ago < 86400) {
            $time_display = floor($time_ago / 3600) . ' hours ago';
        } else {
            $time_display = floor($time_ago / 86400) . ' days ago';
        }

        echo "<div>[$time_display] &lt;$nick&gt;: $msg</div>";
    }
}
?>
