<?php
  include '../includes/php.php';

  class Users {
    public function login() {
      $user = post("user");
      $pass = base64_encode(post("pass"));

      (new MySQL("CALL UsersLogin('$user', '$pass')"))->toJSONObject()->print();
    }

    public function logout() {
      (new JSON())->print();
    }

    public function register() {
      $user = post("user");
      $email = post("email");
      $pass = base64_encode(post("pass"));

      (new MySQL("CALL UsersRegister('$user', '$email', '$pass')"))->toJSONObject()->print();
    }
  }

  (new Users())->{ get("action") }();
?>
