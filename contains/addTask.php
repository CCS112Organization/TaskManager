<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST["add-taskField"];

    try {
        require_once "dbh.php";

        $query = "INSERT INTO tasks (title) VALUES (?);";
        $stmnt = $connection->prepare($query);

        if (!$stmnt) {
            die("Prepare failed: " . $connection->error);
        }

        $stmnt->bind_param("s", $title);
        $stmnt->execute();

        $taskId = $connection->insert_id;

        $stmnt->close();
        $connection->close();

        echo $taskId;

    } catch (mysqli_sql_exception $e) {
        die("Connection Failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
}