<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $taskId = $_POST["id"];

    try {
        require_once "dbh.php";
    
        $query = "SELECT * FROM tasks WHERE id = ?;";
        $stmnt = $connection->prepare($query);
        
        if (!$stmnt) {
            die("Prepare failed: " . $connection->error);
        }
    
        
        $stmnt->bind_param("i", $taskId);
        $stmnt->execute();

        $result = $stmnt->get_result();
        $row = $result->fetch_assoc();

        $stmnt->close();
        $connection->close();
        
        echo json_encode($row);

    } catch (mysqli_sql_exception $e) {
        die("Connection Failed: " . $e->getMessage());
    }
}
else {
    header("Location: ../index.php");
}