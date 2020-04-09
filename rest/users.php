<?php
  include '~php.php';

  class Users {
    private $json = array('success' => false);

    public function login() {
      $user = post('user');
      $pass = post('pass');

      // TODO:
      if ($user == 'anubis' && $pass == 'munky1483') {
        $this->json['success'] = true;
        $this->json['userId'] = 1;
      } else {
        $this->json['message'] = 'Username and/or password did not match.';
      }

      return $this->json;
    }

    public function logout() {
      // TODO:
      $this->json['success'] = true;

      return $this->json;
    }

    public function register() {
      $user = post('user');
      $pass = post('pass');
      $email = post('email');

      // TODO:
      $this->json['success'] = true;
      $this->json['userId'] = 1;

      return $this->json;
    }
  }

  json((new Users())->{ get('action') }());
?>
