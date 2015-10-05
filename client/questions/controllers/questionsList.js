angular.module("amquiz").controller("QuestionsListCtrl", ['$scope', '$meteor',
  function($scope, $meteor){
 
    $scope.questions = $meteor.collection(Questions);
 
    $scope.remove = function(question){
      $scope.questions.remove(question);
    };
 
    $scope.removeAll = function(){
      $scope.questions.remove();
    };
  }]);