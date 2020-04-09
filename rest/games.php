<?php
  include '~php.php';

  class Games {
    private $json;

    public function __construct() {
      $this->json = new JSON();
    }

    public function load() {
      // TODO:
      $this->json->success(array(
        array("id" => 1, "title" => "Saved Game 1"),
        array("id" => 2, "title" => "Saved Game 2"),
        array("id" => 3, "title" => "Saved Game 3")
      ));

      $this->json->print();
    }
  }

  (new Games())->{ get('action') }();
?>
