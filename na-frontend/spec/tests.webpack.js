require('core-js');
require('core-js/es5');
require('babel-core/polyfill');

var context = require.context('./', true, /-test\.js$/);
context.keys().forEach(context);
