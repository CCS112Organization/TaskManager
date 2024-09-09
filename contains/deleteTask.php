<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $taskId = $_POST["id"];

    try {
        require_once "dbh.php";
    
        $query = "DELETE FROM tasks WHERE id = ?;";
        $stmnt = $connection->prepare($query);
        
        if (!$stmnt) {
            die("Prepare failed: " . $connection->error);
        }
    
        $stmnt->bind_param("i", $taskId);
        $stmnt->execute();
    
        $stmnt->close();
        $connection->close();
    
        header("Location: ../index.php");
        die();
    
    } catch (mysqli_sql_exception $e) {
        die("Connection Failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
}

