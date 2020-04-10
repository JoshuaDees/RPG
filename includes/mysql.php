<?php
  $conn = mysqli_connect(DB_CONFIG["host"], DB_CONFIG["user"], DB_CONFIG["pass"]);

  mysqli_select_db($conn, DB_CONFIG["db"]);

  function mysqli_to_json_array($tbl, $associations) {
    $json = array();

    while ($row = mysqli_fetch_array($tbl)) {
      $item = array();

      foreach ($associations as $key => $value) {
        $item[$key] = $row[$value];
      }

      array_push($json, $item);
    }

    return $json;
  }
?>
