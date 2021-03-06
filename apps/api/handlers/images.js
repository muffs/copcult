var url = require('url');
var Promise = require('bluebird');
var materialistic = require('materialistic');

var Image = require('../models/image');
var ImageUser = require('../models/image_user');
var Item = require('../models/item');
var ImageItem = require('../models/image_item');

module.exports = {

  get: function(req, res) {
    new Image().fetchAll().then(function(collection) {
      res.json({
        data: collection.toJSON()
      });
    }).catch(function() {
      console.error('An error occurred while fetching all images.');
    });
  },

  getOne: function(req, res) {
    var imageId = req.param('imageId');

    new Image({
      id: escape(imageId)
    }).fetch({
      withRelated: ['users', 'items', 'items.brand', 'comments']
    }).then(function(image) {
      return res.json({ data: image.toJSON() });
    }).catch(function(err) {
      console.error(err);
      res.send(500, 'Unable to find image.');
    });
  },

  addItem: function(req, res) {
    var url = req.param('url');
    var imageId = req.param('imageId');

    return Promise.all([
      new Image({ id: imageId }).fetch(),
      materialistic(url).finally(function() {
        return Promise.resolve({ url: url });
      })
    ]).spread(function(image, itemAttrs) {
      return new Item(itemAttrs).findOrCreate().then(function(item) {
        return new ImageItem({
          itemId: item.id,
          imageId: image.id
        }).save();
      }).then(function() {
        return image;
      });
    }).then(function(image) {
      return image.fetch({
        withRelated: ['users', 'items', 'items.brand', 'comments']
      });
    }).then(function(image) {
      res.json({ data: image.toJSON() });
    }).catch(function(err) {
      console.error('There was an error adding the item to the image.', err);
      res.send(500);
    });
  },

  post: function(req, res) {
    /**
    * Takes an instagram url, parses out id, fetches for more info, saves
    * image.
    */
    var image;
    var shortCode;
    var url = req.param('url');
    var userId = req.param('userId');

    if ( !/^(http:\/\/|https:\/\/)/.test(url) ) {
      url = 'https://' + url;
    }

    if ( !/\/$/.test(url) ) {
      url += '/';
    }

    /**
    * TODO: refactor this asap lol
    */
    shortCode = require('url').parse(url).path.match(/\/p\/(.*)\//)[1];

    image = new Image({
      shortCode: shortCode
    });
    image.findOrCreate()
      .then(function(image) {
        return image.fetchViaShortCode();
      })
      .then(function(data) {
        /**
        * TODO: wrap this in a transaction.
        */
        image.set(Image.parseImageData(data));
        return image.save().then(function() {
          return new ImageUser({
            userId: userId,
            imageId: image.get('id')
          }).findOrCreate();
        }).then(function() {
          res.json({ data: image.toJSON() });
        });
      })
      .catch(function(err) {
        console.error('There was an error fetching the image from instagram.', err);
        res.send(500);
      });
  },

  getComments: function(req, res) {
    /**
    * Fetches all the comments related to an image.
    */
    var imageId = escape(req.param('imageId'));

    return new Image({
      id: imageId
    }).fetch({
      withRelated: ['comments', 'comments.user']
    }).then(function(image) {
      res.json({
        data: image.related('comments')
      });
    }).catch(function(err) {
      console.error('Error while fetching comments.', err);
      res.send(500);
    });
  },

  addComment: function(req, res) {
    var text = req.param('text');
    var userId = req.param('userId');
    var imageId = req.param('imageId');

    return new Image({
      id: imageId
    }).fetch({
      withRelated: ['comments', 'comments.user']
    }).then(function(image) {
      return image.related('comments').create({
        text: text,
        imageId: imageId,
        userId: userId
      }).then(function() {
        return image.fetch({
          withRelated: ['comments', 'comments.user']
        }).then(function(image) {
          return res.json({
            data: image.related('comments').toJSON()
          });
        });
      });
    }).catch(function(err) {
      console.error('Error while fetching comments.', err);
      res.send(500);
    });
  },

  removeItem: function(req, res) {
    var itemId = req.param('itemId');
    var imageId = req.param('imageId');

    return new ImageItem({
      itemId: itemId,
      imageId: imageId
    }).fetch().then(function(association) {
      return new ImageItem({ id: association.id }).destroy();
    }).then(function() {
      return new Image({ id: imageId }).fetch({
        withRelated: ['users', 'items', 'items.brand', 'comments']
      });
    }).then(function(image) {
      return res.json({ data: image.toJSON() });
    }).catch(function(err) {
      console.error('There was an error removing the association', err);
      return res.send(500);
    });
  }

};
