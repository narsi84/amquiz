(function(){
	'use strict';

	angular.module('amquiz')
		.directive('question', ['$rootScope', '$meteor', '$modal', function($rootScope, $meteor, $modal){
			return {
				'restrict': 'E',
				'templateUrl': 'client/app.directive.ng.html',
				'scope': {
					question: '=',
					category: '='					
				},
				link: function($scope, $elem, $attrs){
					$scope.questions = $meteor.collection(Questions);

					$scope.newQuestion = angular.isDefined($attrs.newQuestion) ? true : false;

					$scope.selectedMatchOption = null;

					$scope.selectContent = function(content, position){
						$scope.content = content;
						if ($scope.newQuestion) {
							var modalinstance = $modal.open({
								templateUrl: 'client/content.ng.html',
								controller: 'ModalController',
								resolve: {
									content: function(){
										return $scope.content;
									}
								}
							});

							modalinstance.result.then(function(content){
								$scope.content = content;
							});
						}
						else {
							switch($scope.question.type) {
								case Q_TYPE_DEFAULT: 
									angular.forEach($scope.question.options, function(option, i){
										option.selected = false;
									})
									content.selected = true;
									$scope.question.answer = content.id;
									break;

								case Q_TYPE_MULTI:
									content.selected = !content.selected;
									if (content.selected){
										if (!$scope.question.answer)
											$scope.question.answer = [];
										var index = $scope.question.answer.indexOf(content.id);
										if (index == -1)
											$scope.question.answer.push(content.id);
										else {
											$scope.question.answer.splice(index, 1);
										}
									}
									break;

								case Q_TYPE_MATCH:
									if (!$scope.selectedMatchOption) {
										$scope.selectedMatchOption = content;
									}
									else {
										// We already have an option selected, so we should swap the two
										var positionIndex = position == 'left' ? 0 : 1;
										var toindex = $scope.question.options[positionIndex].indexOf(content);
										var fromindex = $scope.question.options[positionIndex].indexOf($scope.selectedMatchOption);
										$scope.question.options[positionIndex][fromindex] = content;
										$scope.question.options[positionIndex][toindex] = $scope.selectedMatchOption;
										$scope.selectedMatchOption	= null;
									}
									break;
							}
						}
					}

					$scope.selectOption = function(id){
						switch ($scope.question.type) {
							case Q_TYPE_DEFAULT: 							
								$scope.question.answer = id;
								break;
							case Q_TYPE_MULTI:
								var index = $scope.question.answer.indexOf(id);
								if (index == -1)
									$scope.question.answer.push(id);
								else
									$scope.question.answer.splice(index, 1);
								break;
						}
					}
				}
			}
		}])

		.controller('ModalController', function ($scope, $modalInstance, content) {
		  	$scope.content = content;

		  	$scope.ok = function () {
		    	$modalInstance.close($scope.content);
		  	};

		  	$scope.cancel = function () {
		    	$modalInstance.dismiss('cancel');
		  	};
		})
})(angular);