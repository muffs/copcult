var app = require('express')();


/**
* Search Handlers
*/
var search = require('./handlers/search');

app.post('/search', search.post);


/**
* User Handlers
*/
var users = require('./handlers/users');

app.get('/users', users.getAll);
app.post('/users', users.post);

app.get('/users/:user_id/images', users.images);
app.get('/users/:user_id/feed', users.feed);

/**
* Storefront Handlers
*/
// var storefronts = require('./handlers/storefronts');
//
// app.get('/storefronts', storefronts.getAll);
// app.get('/storefronts/:storefrontId', storefronts.getOne);
// app.post('/storefronts', storefronts.post);
// app.delete('/storefronts/:storefrontId/items/:itemId', storefronts.deleteItem);

/**
* Item Handlers
*/
var items = require('./handlers/items');

app.post('/items', items.post);
app.put('/items/:itemId', items.put);

/**
* Realtime Tag Handlers
*/
// var realtime = require('./handlers/realtime');
//
// app.get('/realtime', realtime.get);
// app.post('/realtime', realtime.post);
// app.get('/realtime/subscriptions', realtime.listSubscriptions);

/**
* Images Handlers
*/
var images = require('./handlers/images');
app.get('/images', images.get);
app.get('/images/:imageId', images.getOne);
app.post('/images', images.post);
app.post('/images/:imageId/items', images.addItem);
app.delete('/images/:imageId/items/:itemId', images.removeItem);

app.get('/images/:imageId/comments', images.getComments);
app.post('/images/:imageId/comments', images.addComment);

module.exports = app;
