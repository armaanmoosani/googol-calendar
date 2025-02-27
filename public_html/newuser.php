
<?php
    session_start();
    if(!isset($_SESSION['newuser'])) {
        session_destroy();
        header("Location: filesystem.php");
        exit;
    }
    $newuser = htmlentities($_SESSION['newuser']);
    $filename = "/srv/module2fileserver/users.txt";
    $newpath=sprintf("/srv/module2fileserver/%s", $newuser);
    //some of code block below from php.net
    if(is_writable($filename)){
        if (!$fp = fopen($filename, 'a')) {
            session_destroy();
            header("Location: failure.html");
            exit;
        }
        $userFile = fopen($filename, "r");
        while(!feof($userFile)){ //checks if the inputted user is already in the file of valid users.
            $compare_user = trim(fgets($userFile));
            if($compare_user === $newuser){
                $_SESSION['message'] = "User already taken";
                header("Location: filesystem.php");
                exit;
            }
        }
        fclose($userFile);
        fwrite($fp, "\n"); //fwrite, is_writable, and mkdir from php manual
        if (fwrite($fp, $newuser) === FALSE) { //writing the new user into the valid users file.
            session_destroy();
            header("Location: failure.html");
            exit;
        }
        fclose($fp);
        if(!mkdir($newpath,0775)){
            session_destroy();
            header("Location: failure.html");
            exit;
        }
        session_destroy();
        $_SESSION['success'] = "User created successfully!";
        header("Location: filesystem.php");
        exit;
    }
    else{
        if (fwrite($fp, $newuser) === FALSE) {
            session_destroy();
            header("Location: failure.html");
            exit;
        }
    }
?>