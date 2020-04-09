<?php
  // Do not allow for caching
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  // Fix the way AngularJS sends in POST data
  $_POST = json_decode(file_get_contents("php://input"), true);

  /**
   * Method to grab a $_POST parameter
   *
   * @method post
   * @param {String} $name The name of the parameter
   * @param {Variable} [$default=NULL] The default value
   * @return {Variable} The value
   */
  function post($name, $default = NULL) {
    // If the parameter exists, return its value
    if (isset($_POST[$name]) && $_POST[$name] !== NULL) {
      return $_POST[$name];
    }

    // Return the default value
    return $default;
  }

  /**
   * Method to grab a $_GET parameter
   *
   * @method get
   * @param {String} $name The name of the parameter
   * @param {Variable} [$default=NULL] The default value
   * @return {Variable} The value
   */
  function get($name, $default = NULL) {
    // If the parameter exists, return its value
    if (isset($_GET[$name]) && $_GET[$name] !== NULL) {
      return $_GET[$name];
    }

    // Return the default value
    return $default;
  }

  /**
   * Method to echo JSON to the page
   *
   * @method json
   * @param {Object} $json The JSON object
   */
  function json($json) {
    // Set the content-type
    header("Content-type: application/json");

    // Echo the JSON
    echo json_encode($json);
  }
?>