<?php
header('Content-Type: application/json; charset=utf-8');
$subject = $_GET['subject'] ?? 'quote';
$index = isset($_GET['index']) ? intval($_GET['index']) : 0;
if ($subject === 'english') {
    $json_file = 'english_2000.json';
} else {
    $json_file = $subject . '.json';
}
if (!file_exists($json_file)) {
    echo json_encode(['error' => '題庫不存在']);
    exit;
}
$json_data = file_get_contents($json_file);
$questions = json_decode($json_data, true);
// 若第一次請求，產生亂數順序並存 session
session_start();
if (!isset($_SESSION['qorder_' . $subject]) || (isset($_GET['reset']) && $_GET['reset'] == '1')) {
    $order = range(0, count($questions) - 1);
    shuffle($order);
    $_SESSION['qorder_' . $subject] = $order;
}
$order = $_SESSION['qorder_' . $subject];
if ($index < 0 || $index >= count($order)) {
    echo json_encode(['error' => '題號錯誤']);
    exit;
}
$q = $questions[$order[$index]];
// 顯示題號為 1-based 連號
$q['display_number'] = $index + 1;
echo json_encode([
    'question' => $q,
    'total' => count($questions)
]);
