<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST["title"];
    $description = $_POST["description"];
    $date = $_POST["due_date"];
    $taskId = $_POST["id"];

    try {
        require_once "dbh.php";

        $query = "UPDATE tasks SET title = ?, description = ?, due_date = ? WHERE id = ?";
        $stmnt = $connection->prepare($query);

        if (!$stmnt) {
            die("Prepare failed: " . $connection->error);
        }

        $stmnt->bind_param("sssi", $title, $description, $date, $taskId); 
        $stmnt->execute();

        $response = [
            'id' => $taskId,
            'title' => $title,
            'description' => $description,
            'date' => $date
        ];

        $stmnt->close();
        $connection->close();
        
        echo json_encode($response);

    } catch (mysqli_sql_exception $e) {
        die("Connection Failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
}