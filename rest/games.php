<?php
  include '~php.php';

  class Games {
    private $json = array('success' => false);

    public function load() {
      // TODO:
      $this->json['success'] = true;

      $this->json['games'] = array(
        array("id" => 1, "title" => "Saved Game 1"),
        array("id" => 2, "title" => "Saved Game 2"),
        array("id" => 3, "title" => "Saved Game 3")
      );

      return $this->json;
    }
  }

  json((new Games())->{ get('action') }());
?>
