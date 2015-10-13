var imagestore = new FS.Store.S3("imagestore");

Images = new FS.Collection("images", {
  stores: [imagestore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})