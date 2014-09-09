var bookshelf = require('../../../config/bookshelf')();

var _ = require('underscore');
_.str = require('underscore.string');

var BaseModel = bookshelf.Model.extend({

  format: function(attrs) {
    /**
    * Underscorizes all attrs to db.
    */
    return _.reduce(attrs, function(memo, val, key) {
      memo[_.str.underscored(key)] = val;
      return memo;
    }, {});
  },

  parse: function(attrs) {
    /**
    * Converts underscored values from db to camelCase.
    */
    return _.reduce(attrs, function(memo, val, key) {
      memo[_.str.camelize(key)] = val;
      return memo;
    }, {});
  }

});

module.exports = BaseModel;
