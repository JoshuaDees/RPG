<?php include "./includes/cache.php"; ?>
<html ng-app="rpg">
  <head>
    <title>My First RPG</title>
    <link href="./assets/fontawesome/css/all.min.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <link href="./dist/rpg.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <script src="./assets/lodash/lodash.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/jquery/jquery.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-resource.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-ui-router.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./dist/rpg.js?bust=<?php echo $bust; ?>"></script>
    <style>
      .container {
        background-color: #222;
      }
    </style>
  </head>
  <body ng-controller="RPGController">
    <div class="container" ui-view></div>
  </body>
</html>
