<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32)); 
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Account</title>
    <link rel="stylesheet" type="text/css" href="login.css">
    <link rel="icon" type="image/png" href="/~armaanmoosani/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/~armaanmoosani/favicon/favicon.svg" />
    <link rel="shortcut icon" href="/~armaanmoosani/favicon/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/~armaanmoosani/favicon/apple-touch-icon.png" />
    <link rel="manifest" href="/~armaanmoosani/favicon/site.webmanifest" />
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
<body>
    <form action= "index.php" method="GET">
        <button name='back' type='submit' class='back'>Back to Login</button>
    </form>
    <h1>Sign Up</h1>
    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
        <label>Username</label> <br>
        <input type="text" name="newuser" required>
        <br><br>
        <label>Password</label> <br>
        <input type="password" name="newpassword" required>
        <br><br>
        <label>Confirm Password</label> <br>
        <input type="password" name="confirmpassword" required>
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <br><br>
        <!-- code line below from https://developers.google.com/recaptcha/docs/display -->
        <div class="captcha-container">
            <div class="g-recaptcha" data-sitekey="6LfB-coqAAAAADiLI_G0u-D4BVV-HEwLiLC3JmhU"></div>
        </div>
        <br><br>
        <button name="newsignup" type="submit">Sign Up</button><br><br>
    </form>
    <?php
    require "database.php";
    if(isset($_POST['token'])){
        if(!hash_equals($_SESSION['token'], $_POST['token'])){
            die("Request forgery detected");
        }
    }
    if(isset($_POST['newsignup'])){
        //recapthca verify on backend: https://www.geeksforgeeks.org/google-recaptcha-integration-in-php/
        $secret_key = "6LfB-coqAAAAAFGyUcNUV7MhprF6qJ33mWwtUdne"; 
        $recaptcha_response = $_POST['g-recaptcha-response'];
        $url = 'https://www.google.com/recaptcha/api/siteverify?secret='
        . $secret_key . '&response=' . $recaptcha_response;
        $response = file_get_contents($url);
        $response = json_decode($response);
        if (!$response->success) {
            die ("reCAPTCHA verification failed. Please try again.");
        }
        $newuser = htmlentities($_POST['newuser']);
        $newpassword = trim($_POST['newpassword']);
        $confirmpassword = trim($_POST['confirmpassword']);
        if($newpassword !== $confirmpassword){
            echo "<p class='p1'>Passwords do not match</p>";
        }
        else if(strlen($newpassword)<=10){
            echo "<p class='p1'>Password needs to be at least 10 characters</p>";
        }
        else if(!preg_match("/[A-Z]/", $newpassword) || !preg_match("/[0-9]/", $newpassword)){
            echo "<p class='p1'>Password must include an uppercase letter and a number</p>";
        }
        else{
            $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
            $stmt->bind_param('s', $newuser);
            $stmt->execute();
            $stmt->bind_result($cnt);
            $stmt->fetch();
            $stmt->close();
            if($cnt>0){
                echo "<p class='p1'>User already exists</p>";
                header("Location: index.html");
            }
            else{
                //from wiki
                $hashed_password = password_hash($newpassword, PASSWORD_DEFAULT);
                $stmt = $mysqli->prepare("INSERT INTO users (username, hashed_password) VALUES (?, ?)");
                if(!$stmt){
                    header("Location: failure.html");
                    exit;
                }
                $stmt->bind_param('ss', $newuser, $hashed_password);
                $stmt->execute();
                $stmt->close();
                header("Location: index.php");
                exit;
            }
        }
    }
?>
</body>
</html>