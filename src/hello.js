/**
 * Created by vunguyen on 2/26/17.
 */
var _ = require('lodash');

module.exports = function hello(to) {
    return _.template("Hello, <%= name %>!")({name: to});
};