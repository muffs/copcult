/** @jsx React.DOM */

define([
  'react',
], function(React) {

  var NotFoundView = React.createClass({

    getInitialState: function() {
    },

    render: function() {
      return (
        <div className='error-page'>
        </div>
      );
    }
  });

  return NotFoundView;
});