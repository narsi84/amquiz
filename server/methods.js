Meteor.methods({
	getNewQuestion: function(category){
		console.log('Category: ' + category);
		var count = Questions.find({'category': category, 'status': 'SUBMITTED'}).count();
		console.log('Count: ' + count);
		if (count == 0)
			throw new Meteor.Error('No questions in this category');

		var skip = Math.round(Math.random()*count);
		if (skip == count) skip = count - 1;
		console.log(skip);
		var question = Questions.findOne({'category': category, 'status': 'SUBMITTED'}, {skip: skip});
		// var question = Questions.findOne({'category': category, 'status': 'SUBMITTED', type: Q_TYPE_MULTI});

		// Dont send answers to client
		delete question['answer'];
		return question;
	},
	checkAnswer: function(question){
		var originalQuestion = Questions.findOne({_id: question._id});
		var originalAnswer = originalQuestion.answer;
		var correctResult = true;
		switch(question.type){
			case Q_TYPE_DEFAULT:
				if (originalQuestion.answer != question.answer){
					correctResult = false;				
				}
				break;
			case Q_TYPE_MULTI:	
				if (_.intersection(originalQuestion.answer, question.answer).length != originalQuestion.answer.length ){
					correctResult = false;				
				}
				break;
			case Q_TYPE_MATCH:
				_.each(question.options[0], function(elem, index, list){
					_.each(originalQuestion.options[0], function(o_elem, o_index, o_list){
						if (elem.id == o_elem.id){
							if (question.options[1][index].id != originalQuestion.options[1][o_index].id) {
								correctResult = false;								
							}
						}
					})
				})
				break;
		}
		if (correctResult) {
			var val = (DIFFICULTY.indexOf(question.difficulty) + 1)*10;
			Meteor.users.update(Meteor.user(), {$inc: {score: val, answered: 1, correct: 1}});
		}
		else {
			Meteor.users.update(Meteor.user(), {$inc: {answered: 1}});
		}
		return {isCorrect: correctResult, question: originalQuestion};
	}
})