<?php
  include '~php.php';

  class Users {
    private $json = array('success' => false);

    public function login() {
      $user = post('user');
      $pass = post('pass');

      if ($user == 'anubis' && $pass == 'munky1483') {
        $this->json['success'] = true;
        $this->json['userId'] = 1;
      } else {
        $this->json['message'] = 'Username and/or password did not match.';
      }

      return $this->json;
    }

    public function logout() {
      // TODO: Users.logout
    }

    public function register() {
      // TODO: Users.register
    }
  }

  json((new Users())->{ get('action') }());
?>
