/** @jsx React.DOM */

var $ = require('jquery');
var React = require('react');
var ReactRouter = require('react-router');
var Modal = require('react-modal');

var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var AppWrapper = require('./components/app_wrapper');
var HomeView = require('./views/home');
var ImageView = require('./views/image');
var BrandView = require('./views/brand');

var routes = (
  <Route handler={AppWrapper} path="/">
    <DefaultRoute handler={HomeView} />
    <Route name="images" path="/images/:imageId" handler={ImageView} />
    <Route name="brand" path="/brands/:brandId" handler={BrandView} />
  </Route>
);

var appElement = $('#content').get(0);

Modal.setAppElement(appElement);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler, state) {
  var params = state.params;
  React.render(<Handler params={params} />, appElement);
});
