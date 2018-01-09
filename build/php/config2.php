<?php
$salt = "hK";
$for_crypt = $config['user'] . $config['password'];
$token = crypt($for_crypt, $salt);