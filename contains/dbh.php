<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "taskmanager";

try {
    $connection = new mysqli($host, $username, $password, $database);
} catch (mysqli_sql_exception $e) {
    echo "Connection Failed: " . $e->getMessage();
}