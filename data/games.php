<?php
  include '~php.php';

  class Games {
    private $json;

    public function __construct() {
      $this->json = new JSON();
    }

    public function load() {
      global $conn;

      $userId = post("userId");

      $sql = "SELECT * FROM Games WHERE UserId = '$userId'";
      $tbl = mysqli_query($conn, $sql);

      $this->json->success(mysqli_to_json_array($tbl, array(
        "id" => "GameId",
        "title" => "GameTitle"
      )));

      $this->json->print();
    }
  }

  (new Games())->{ get('action') }();
?>
