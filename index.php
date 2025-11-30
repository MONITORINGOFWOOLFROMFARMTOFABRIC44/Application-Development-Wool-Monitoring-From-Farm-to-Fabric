<!DOCTYPE html>
<html>
<head>
    <title>Wool Monitoring Database</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .nav { margin: 20px 0; }
        .nav a { margin-right: 15px; padding: 10px; background: #007cba; color: white; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #005a87; }
    </style>
</head>
<body>
    <h1>Wool Monitoring Database</h1>
    
    <div class="nav">
        <a href="?table=users">Users</a>
        <a href="?table=farms">Farms</a>
        <a href="?table=animals">Animals</a>
        <a href="?table=wool_quality">Wool Quality</a>
        <a href="?table=supply_chain">Supply Chain</a>
        <a href="?table=certificates">Certificates</a>
        <a href="?table=market_prices">Market Prices</a>
    </div>

    <?php
    require_once 'config.php';
    
    $table = $_GET['table'] ?? 'users';
    $allowed_tables = ['users', 'farms', 'animals', 'wool_quality', 'supply_chain', 'certificates', 'market_prices'];
    
    if (!in_array($table, $allowed_tables)) {
        $table = 'users';
    }
    
    try {
        $stmt = $pdo->query("SELECT * FROM $table ORDER BY id DESC LIMIT 50");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($data) {
            echo "<h2>" . ucfirst(str_replace('_', ' ', $table)) . " Table</h2>";
            echo "<table>";
            echo "<tr>";
            foreach (array_keys($data[0]) as $column) {
                echo "<th>" . ucfirst(str_replace('_', ' ', $column)) . "</th>";
            }
            echo "</tr>";
            
            foreach ($data as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>" . htmlspecialchars($value ?? '') . "</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No data found in $table table.</p>";
        }
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    ?>
</body>
</html>