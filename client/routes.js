angular.module("amquiz").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error == 'AUTH_ERROR') {
      $location.go("/");
    }
  });
}]);

angular.module("amquiz").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {
 
    $locationProvider.html5Mode(true);
 
    $stateProvider
      .state('play', {
        url: '/play/:category',
        templateUrl: 'client/play.ng.html',
        controller: 'PlayCtrl'        
      })
      .state('contribute', {
        url: '/contribute/:category',
        templateUrl: 'client/contribute.ng.html',
        controller: 'ContributeCtrl'
      })
      .state('index', {
        url: '/',
        templateUrl: 'client/index.ng.html',
        controller: 'MainController'
      });

 
    $urlRouterProvider.otherwise("client/index.html");
  }]);