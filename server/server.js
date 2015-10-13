Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'score': 1, 'emails': 1, 'answered': 1, 'correct': 1}});
  } else {
    this.ready();
  }
});

Meteor.publish('Questions', function(){
  if (this.userId) {
    return Questions.find();
  } else {
    this.ready();
  }	
})

var imagestore = new FS.Store.S3("imagestore", {
  accessKeyId: "AKIAJJ6XB5WV32K76QVA", 
  secretAccessKey: "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", 
  bucket: "amquiz"
  // transformWrite: function(fileObj, readStream, writeStream) {
  //   gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
  // }
})


Images = new FS.Collection("images", {
  stores: [imagestore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})

Images.allow({
	insert: function () {
		// add custom authentication code here
		return true;
	},
	remove: function (userId) {
		return (userId ? true : false);
	},
	download: function () {
		return true;
	},
	update: function (userId) {
		return (userId ? true : false);
	}
})