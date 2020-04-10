<?php
  include '../includes/php.php';

  class Users {
    public function login() {
      global $conn;

      $user = post("user");
      $pass = base64_encode(post("pass"));

      $response = new MySQL("SELECT * FROM Users WHERE UserName = '$user' AND UserPassword = '$pass'");

      $json = $response->toObject(array(
        "id" => "UserId",
        "name" => "UserName"
      ));

      (new JSON())->success($json)->print();
    }

    public function logout() {
      (new JSON())->print();
    }

    public function register() {
      global $conn;

      $email = post("email");
      $user = post("user");
      $pass = base64_encode(post("pass"));

      $response = new MySQL("INSERT INTO Users (UserEmail, UserName, UserPassword) VALUES ('$email', '$user', '$pass')");

      $json = array(
        "id" => MySQL::getLastIndex(),
        "name" => "$user"
      );

      (new JSON())->success($json)->print();
    }
  }

  (new Users())->{ get("action") }();
?>
