<?php
  class MySQL {
    private static $conn;

    private $tbl;

    public function __construct($sql) {
      if (MySQL::$conn === null) {
        MySQL::$conn = mysqli_connect(DB_CONFIG["host"], DB_CONFIG["user"], DB_CONFIG["pass"]);

        mysqli_select_db(MySQL::$conn, DB_CONFIG["db"]);
      }

      $this->tbl = mysqli_query(MySQL::$conn, $sql);
    }

    public function toJSONArray() {
      $json = array();

      while ($row = mysqli_fetch_assoc($this->tbl)) {
        array_push($json, $row);
      }

      return (new JSON())->success($json);
    }

    public function toJSONObject() {
      $json = mysqli_fetch_assoc($this->tbl);

      if (isset($json["Success"]) && $json["Success"] == "true") {
        return (new JSON())->success($json);
      } elseif (isset($json["Success"]) && $json["Success"] == "false" && isset($json["ErrorMessage"])) {
        return (new JSON())->error($json["ErrorMessage"]);
      } else {
        return (new JSON())->error("There was an unknown database error.");
      }
    }
  }
?>
