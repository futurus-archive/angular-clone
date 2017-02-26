/**
 * Created by vunguyen on 2/26/17.
 */
var hello = require('../src/hello');

describe('Hello', function () {
   it('says hello', function() {
       expect(hello('world')).toBe('Hello, world!');
   });
});