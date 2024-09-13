<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $taskId = $_POST['id'];
    $status = $_POST['completed'];

    try {
        require_once "dbh.php";

        $query = "UPDATE tasks SET completed = ? WHERE id = ?";
        $stmt = $connection->prepare($query);

        if (!$stmt) {
            echo json_encode(['success' => false, 'error' => $connection->error]);
            exit();
        }

        $stmt->bind_param("ii", $status, $taskId);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'id' => $taskId,
                'completed' => $status,
                'debug' => 'Database update was successful'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }

        $stmt->close();
        $connection->close();
        
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    header("Location: ../index.php");
}
?>
