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

    private function convert($row, $associations) {
      $item = array();

      foreach ($associations as $key => $value) {
        $item[$key] = $row[$value];
      }

      return $item;
    }

    public function toArray($associations) {
      $response = array();

      while ($row = mysqli_fetch_array($this->tbl)) {
        array_push($response, $this->convert($row, $associations));
      }

      return $response;
    }

    public function toObject($associations) {
      $response = null;

      if ($row = mysqli_fetch_array($this->tbl)) {
        $response = $this->convert($row, $associations);
      }

      return $response;
    }

    public static function getLastIndex() {
      return mysqli_insert_id(MySQL::$conn);
    }
  }
?>
