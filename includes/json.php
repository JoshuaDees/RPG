<?php
  class JSON {
    private $data = array("success" => true);

    public function success($model) {
      $this->data["model"] = $model;

      return $this;
    }

    public function error($error) {
      $this->data["success"] = false;
      $this->data["error"] = $error;

      return $this;
    }

    public function print() {
      header("Content-type: application/json");

      echo json_encode($this->data);
    }
  }
?>
