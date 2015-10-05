angular.module("amquiz").controller("QuestionDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {
    $scope.question = $meteor.object(Questions, $stateParams.questionId);
  }]);