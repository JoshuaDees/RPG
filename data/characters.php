<?php
  include '../includes/php.php';

  class Characters {
    public function classes() {
      $raceId = post("raceId");

      $response = new MySQL("SELECT *, (SELECT RaceClasses.RaceId FROM RaceClasses WHERE RaceClasses.RaceId = $raceId AND RaceClasses.ClassId = Classes.ClassId) AS ClassEnabled FROM Classes");

      $json = $response->toArray(array(
        "id" => "ClassId",
        "name" => "ClassName",
        "description" => "ClassDescription",
        "enabled" => "ClassEnabled"
      ));

      (new JSON())->success($json)->print();
    }

    public function genders() {
      $response = new MySQL("SELECT * FROM Genders");

      $json = $response->toArray(array(
        "id" => "GenderId",
        "name" => "GenderName"
      ));

      (new JSON())->success($json)->print();
    }

    public function races() {
      $response = new MySQL("SELECT * FROM Races");

      $json = $response->toArray(array(
        "id" => "RaceId",
        "name" => "RaceName",
        "description" => "RaceDescription"
      ));

      (new JSON())->success($json)->print();
    }
  }

  (new Characters())->{ get('action') }();
?>
