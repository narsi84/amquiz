(function(angular){
	'use strict';

	angular.module('amquiz')
		.controller('MainController', ['$rootScope', '$scope', '$meteor', function($rootScope, $scope, $meteor){
			$rootScope.CATEGORIES = CATEGORIES;

			$scope.selectedCategory = '';
			$scope.selectedQuestion = null;

			$scope.logout = function(){				
				$meteor.logout(function(error){
					if (error)
						console.log(error);
				})
			}

			$scope.selectCategory = function(cat){
				$scope.selectedCategory = cat;
			}

			$rootScope.$watch('currentUser', function(newval, oldval){
				if (oldval == newval || newval == null)
					return;
				console.log(newval);
				$scope.cuser = newval.emails[0].address;
			})
		}])

		.controller('PlayCtrl', ['$scope', '$meteor', '$stateParams', function($scope, $meteor, $stateParams){
			$scope.questions = $meteor.collection(Questions);

			$scope.available = false;
			$scope.question = null;
			$scope.selectedCategory = $stateParams.category;

			function shuffle (input) {
			  var array = [];
			  angular.copy(input, array);
			  var i = 0, j = 0, temp = null

			  for (i = array.length - 1; i > 0; i -= 1) {
			    j = Math.floor(Math.random() * (i + 1))
			    temp = array[i]
			    array[i] = array[j]
			    array[j] = temp
			  }
			  return array;
			}

			$scope.getQuestion = function(){
				$meteor.call('getNewQuestion', $scope.selectedCategory)
					.then(function(data){
						$scope.question = data;		
						$scope.available = true;				
						// Reorder the options
						if ($scope.question.type === Q_TYPE_MATCH)
							$scope.question.options = [shuffle($scope.question.options[0]), shuffle($scope.question.options[1])];
						else
							$scope.question.options = shuffle($scope.question.options);
					},
					function(err){
						console.log(err);
					});					
			}

			$scope.submit = function(){
				$meteor.call('checkAnswer', $scope.question)
					.then(function(result){
						console.log('Success: ' + result.isCorrect);
						$scope.question = result.question;
						if ($scope.question.type == Q_TYPE_DEFAULT) {
							angular.forEach($scope.question.options, function(option, i){
								if (option.id == $scope.question.answer)
									option.selected = true;
							});
						}
						if ($scope.question.type == Q_TYPE_MULTI) {
							angular.forEach($scope.question.options, function(option, i){
								if ($scope.question.answer.indexOf(option.id) > -1)
									option.selected = true;
							});
						}
					}, 
					function(err){
						console.log(err);
					});					
			}
		}])

		.controller('ContributeCtrl', ['$rootScope', '$scope', '$meteor', '$stateParams', function($rootScope, $scope, $meteor, $stateParams){
			$scope.questions = $meteor.collection(Questions);
			$scope.selectedCategory = $stateParams.category;

			$scope.getNewQuestion = function(type){
				if (type == Q_TYPE_DEFAULT)
					$scope.question = new Question();
				if (type == Q_TYPE_MULTI)
					$scope.question = new MultiChoiceQuestion();
				if (type == Q_TYPE_MATCH)
					$scope.question = new MatchQuestion();

				$scope.question.category = $stateParams.category;
				$scope.available = true;
			}

			$scope.submit = function(){
				$scope.question.submittedBy = $rootScope.currentUser.emails[0].address;
				$scope.question.submittedOn = new Date();
				
				var savable = flatten($scope.question);
				console.log(savable);
				
				$scope.questions.save(savable).then(function(numberOfDocs){
		          console.log('save success doc affected ', numberOfDocs);
		        }, function(error){
		          console.log('save error', error);
		        });
				$scope.question = new Question();
			}

			function flatten(obj) {
			    var result = Object.create(obj);
			    for(var key in result) {
			        result[key] = result[key];
			    }
			    return result;
			}

			$scope.getNewQuestion(Q_TYPE_DEFAULT);
		}])
})(angular);