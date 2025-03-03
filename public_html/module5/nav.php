<?php
session_start();
if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}
if (isset($_POST['token'])) {
    if (!hash_equals($_SESSION['token'], $_POST['token'])) {
        die("Request forgery detected");
    }
}
?>
<button id="menu-button" class="menu-button">&#x2630;</button>
<h1>Googolplex Calendar</h1>
<div id="curtain" class="curtain">
    <a href="#" class="closebtn">&times;</a>
    <div id="login-section" class="login">
        <form id="login-form">
            <input type="hidden" id="token" name="token" value="">
            <input type="hidden" id="recaptcha-token" name="recaptcha-token" value="">
            <label>Username</label> <br>
            <input type="text" id="username" placeholder="Username" required>
            <br><br>
            <label>Password</label> <br>
            <input type="password" id="password" placeholder="Password" required>
            <br><br>
            <button id="login">Login</button>
            <p id="message"></p>
        </form>
    </div>
    <div id="signup-section" class="signup">
        <form id="signup-form">
            <input type="hidden" id="token" name="token" value="">
            <input type="hidden" id="recaptcha-token" name="recaptcha-token" value="">
            <label>Username</label><br>
            <input type="text" id="newuser" name="newuser" placeholder="Username" required><br><br>
            <label>Password</label><br>
            <input type="password" id="newpassword" name="newpassword" placeholder="Password" required><br><br>
            <label>Confirm Password</label><br>
            <input type="password" id="confirmpassword" name="confirmpassword" placeholder="Confirm Password"
                required><br><br>
            <button type="submit" id="signup-btn">Sign Up</button>
        </form>
        <p id="message"></p>
    </div>
</div>
<?php
if (isset($_POST["signup"])) {
    header("Location: index.php");
    exit;
}
if (isset($_POST["logout"])) {
    session_destroy();
    header("Location: " . htmlentities($_SERVER['PHP_SELF']));
    exit;
} ?>