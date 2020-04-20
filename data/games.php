<?php
  include '../includes/php.php';

  class Games {
    public function load() {
      $userId = post("userId");

      (new MySQL("CALL GamesList('$userId')"))->toJSONArray()->print();
    }
  }

  (new Games())->{ get('action') }();
?>
