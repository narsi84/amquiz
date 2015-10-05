Questions = new Mongo.Collection("Questions");

Q_TYPE_DEFAULT = 'DEFAULT';
Q_TYPE_MULTI = 'MULTI_CHOICE';
Q_TYPE_MATCH = 'MATCH';

DIFFICULTY = ['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
CATEGORIES = ['C1', 'C2', 'C2', 'C3', 'C4'];

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Content = function (text){
	this.id = makeid();
	this.text = text ? text : '';
	this.mediaURL = null;	
}

Question = function (){
	this.category = CATEGORIES[0];
	this.type = Q_TYPE_DEFAULT;	
	this.difficulty = DIFFICULTY[0];
	this.question = new Content('Question');	
	this.options = [new Content('Option 1'), new Content('Option 2'), new Content('Option 3'), new Content('Option 4')];
	this.answer = null;
	this.submittedBy = null;
	this.submittedOn = new Date();
	this.status = 'SUBMITTED';
}

MultiChoiceQuestion = function (){
	this.type = Q_TYPE_MULTI;
	this.answer = [];	
}
MultiChoiceQuestion.prototype = new Question();

// Answer for match type questions is just the same order of initial options
MatchQuestion = function (){
	this.type = Q_TYPE_MATCH;
	this.options = [[new Content('Left 1'), new Content('Left 2'), new Content('Left 3'), new Content('Left 4')], [new Content('Right 1'), new Content('Right 2'), new Content('Right 3'), new Content('Right 4')]];
}
MatchQuestion.prototype = new Question();