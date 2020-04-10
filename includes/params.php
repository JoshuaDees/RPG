<?php
  $_POST = json_decode(file_get_contents("php://input"), true);

  function post($name, $default = NULL) {
    if (isset($_POST[$name]) && $_POST[$name] !== NULL) {
      return $_POST[$name];
    }

    return $default;
  }

  function get($name, $default = NULL) {
    if (isset($_GET[$name]) && $_GET[$name] !== NULL) {
      return $_GET[$name];
    }

    return $default;
  }
?>
