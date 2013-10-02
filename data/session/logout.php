<?php
    session_start();
    $_SESSION=array();
    session_destroy();
    session_start();
    $_SESSION['status'] = 'loggedout';
?>