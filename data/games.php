<?php
  include '../includes/php.php';

  class Games {
    public function load() {
      $userId = post("userId");

      $response = new MySQL("SELECT * FROM Games WHERE UserId = '$userId'");

      $json = $response->toArray(array(
        "id" => "GameId",
        "title" => "GameTitle"
      ));

      (new JSON())->success($json)->print();
    }
  }

  (new Games())->{ get('action') }();
?>
