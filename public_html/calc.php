<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <h1>Calculator</h1>
    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="GET">
        <label>Enter first number:</label>
            <input type="number" name = "num1" step = "any">
        <br><br>
        <label>Enter second number:</label>
            <input type="number" name = "num2" step = "any">
        <br><br>
        <label>Operation?</label><br>
        <input type = "radio" name="operation" value="Add"> + <br>
        <input type = "radio" name="operation" value="Subtract"> - <br>
        <input type = "radio" name="operation" value="Multiply"> x <br>
        <input type = "radio" name="operation" value="Divide"> / <br>
        <br>
        <button type = "submit">Calculate</button>
    </form>
    <?php
        function add($x,$y){
            return $x + $y;
        }
        function subtract($x, $y){
            return $x - $y;
        }
        function multiply($x, $y){
            return $x * $y;
        }
        function divide($x,$y){
            if($y == 0){
                return "Cannot divide by zero.";
            }
            else{
                return $x/$y;
            }
        }
        $num1 = $_GET['num1'];
        $num2 = $_GET['num2'];
        $operation = $_GET['operation'];
        $answer = "";
        if($operation == "Add"){
            $answer = add($num1, $num2);
        }
        elseif($operation == "Subtract"){
            $answer = subtract($num1, $num2);
        }
        elseif($operation == "Multiply"){
            $answer = multiply($num1, $num2);
        }
        elseif($operation == "Divide"){
            $answer = divide($num1,$num2);
        }
        echo "<h2>Answer is: ", htmlentities($answer), "</h2>";
    ?>
</body>
</html>