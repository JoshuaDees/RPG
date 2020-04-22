<?php
  include '../includes/php.php';

  sleep(2);

  class Characters {
    public function abilities() {
      $raceId = post("raceId");
      $classId = post("classId");

      (new MySQL("CALL CharactersAbilitiesList($raceId, $classId)"))->toJSONArray()->print();
    }

    public function classes() {
      $raceId = post("raceId");

      (new MySQL("CALL CharactersClassesList($raceId)"))->toJSONArray()->print();
    }

    public function genders() {
      (new MySQL("CALL CharactersGendersList()"))->toJSONArray()->print();
    }

    public function races() {
      (new MySQL("CALL CharactersRacesList()"))->toJSONArray()->print();
    }

    public function skills() {
      $raceId = post("raceId");
      $classId = post("classId");

      (new MySQL("CALL CharactersSkillsList($raceId, $classId)"))->toJSONArray()->print();
    }

    public function specialities() {
      $raceId = post("raceId");
      $classId = post("classId");

      (new MySQL("CALL CharactersSpecialitiesList($raceId, $classId)"))->toJSONArray()->print();
    }

    public function spells() {
      $raceId = post("raceId");
      $classId = post("classId");
      $specialityId = post("specialityId");

      (new MySQL("CALL CharactersSpellsList($raceId, $classId, $specialityId)"))->toJSONArray()->print();
    }
  }

  (new Characters())->{ get('action') }();
?>
