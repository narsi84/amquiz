Meteor.startup(function () {
  if (Questions.find().count() === 0) {
    var questions = [
      {'name': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.'},
      {'name': 'All dubstep all the time',
        'description': 'Get it on!'},
      {'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'}
    ];
    for (var i = 0; i < questions.length; i++)
      Questions.insert({name: questions[i].name, description: questions[i].description});
  }
});