<?php
  include "~php.php";

  class Users {
    private $json;

    public function __construct() {
      $this->json = new JSON();
    }

    public function login() {
      global $conn;

      $user = post("user");
      $pass = base64_encode(post("pass"));

      $sql = "SELECT * FROM Users WHERE UserName = '$user' AND UserPassword = '$pass'";
      $tbl = mysqli_query($conn, $sql);

      if($row = mysqli_fetch_array($tbl)) {
        $this->json->success(array(
          "id" => $row["UserId"],
          "name" => $row["UserName"]
        ));
      } else {
        $this->json->error("Username and/or password did not match. ($sql)");
      }

      $this->json->print();
    }

    public function logout() {
      $this->json->print();
    }

    public function register() {
      global $conn;

      $email = post("email");
      $user = post("user");
      $pass = base64_encode(post("pass"));

      $sql = "INSERT INTO Users (UserEmail, UserName, UserPassword) VALUES ('$email', '$user', '$pass')";

      if(mysqli_query($conn, $sql)) {
        $this->json->success(array(
          "userId" => mysqli_insert_id($conn)
        ));
      } else {
        $this->json->error(mysqli_error($conn));
      }

      $this->json->print();
    }
  }

  (new Users())->{ get("action") }();
?>
