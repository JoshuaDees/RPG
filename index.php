<?php include "./includes/cache.php"; ?>
<html class="viewport" ng-app="rpg">
  <head>
    <title>My First RPG</title>
    <link href="./assets/fontawesome/css/all.min.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <link href="./fonts/Dalelands/Dalelands.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <link href="./assets/jquery/plugins/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <link href="./dist/rpg.css?bust=<?php echo $bust; ?>" rel="stylesheet" />
    <script src="./assets/lodash/lodash.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/jquery/jquery.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/jquery/plugins/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-filter.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-resource.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-sanitize.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/angular-ui-router.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./assets/angular/scrollbars.min.js?bust=<?php echo $bust; ?>"></script>
    <script src="./dist/rpg.js?bust=<?php echo $bust; ?>"></script>
    <style>
      .fa {
        font-size: 10px;
      }

      .small .fa {
        font-size: 65%;
        margin-right: 2px;
        position: relative;
        top: -.5px;
      }

      .container {
        --background-blend-mode: luminosity;
        background-image: url('./media/images/theme/wallpaper.jpg');
        position: relative;
      }

      .mCSB_container_wrapper {
        margin-right: 15px;
      }

      .mCSB_container_wrapper > .mCSB_container {
        padding-right: 8px;
      }

      .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
        background-color: #9b967f;
      }

      .mCSB_inside > .mCSB_container {
        margin-right: 16px;
      }
    </style>
  </head>
  <body class="viewport" ng-controller="RPGController">
    <div class="container">
      <h1>My First RPG</h1>
      <div ui-view></div>
    </div>
  </body>
</html>
