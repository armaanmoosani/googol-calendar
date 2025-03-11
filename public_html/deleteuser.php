
<?php
    session_start();
    function failure(){
        session_destroy();
        header("Location: failure.html");
        exit;
    }
    if(!isset($_SESSION['user'])) {
        session_destroy();
        header("Location: failure.html");
        exit;
    }
    $user = htmlentities($_SESSION['user']);
    $userDirectory=sprintf("/srv/module2fileserver/%s", $user);
    $files = scandir($userDirectory);
    $files = array_diff($files, array('.', '..')); //array_diff and scandir from php manual
    if(count($files) != 0){
        foreach ($files as $file) {
            $filePath = sprintf("/srv/module2fileserver/%s/%s", $user, $file);
            if(!unlink($filePath)){
                failure();
            }
        }
    }
    if(is_dir($userDirectory)){
        if(!rmdir($userDirectory)){ //rmdir from php manual
            failure();
        }
    }
    else{
        failure();
    }
    $user_file = "/srv/module2fileserver/users.txt";
    $readFile = file_get_contents($user_file);
    if(!$readFile){
        failure();
    }
    if (!preg_match('/^[\w_\.\-]+$/', $user)) {
        failure();
    }
    $updatedUsers = str_replace($user,"",$readFile);
    if(!file_put_contents($user_file,$updatedUsers)){
        failure();
    } 
    else{
        header("Location: success.html");
        session_destroy();
        exit;
    }
?>