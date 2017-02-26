/**
 * Created by vunguyen on 2/26/17.
 */
'use strict';

var Scope = require('../src/scope');

describe('Scope', function () {
    it('can be constructed and used as an object', function () {
        var scope = new Scope();
        scope.aProperty = 1;

        expect(scope.aProperty).toBe(1);
    });

    describe('digest', function () {
        var scope;

        beforeEach(function () {
            scope = new Scope();
        });

        it('calls the listener function of a watch on first $digest', function () {
            var watchFn = function () {
                return 'wat';
            };

            var listenerFn = jasmine.createSpy();
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(listenerFn).toHaveBeenCalled();
        });

        it('calls the watch function with the scope as the argument', function () {
            var watchFn = jasmine.createSpy();
            var listenerFn = function () {
            };
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(watchFn).toHaveBeenCalledWith(scope);
        });

        it('calls the listener function when the watched value changes', function () {
            scope.someValue = 'a';
            scope.counter = 0;

            var watchFn = function (scope) {
                return scope.someValue;
            };
            var listenerFn = function (newValue, oldValue, scope) {
                scope.counter++;
            };
            scope.$watch(watchFn, listenerFn);

            expect(scope.counter).toBe(0);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(1);

            scope.someValue = 'b';
            expect(scope.counter).toBe(1);

            scope.$digest();
            expect(scope.counter).toBe(2);
        });

        it('calls listener when watch value is first undefined', function() {
            scope.counter = 0;

            scope.$watch(
                function(scope) { return scope.someVal; },
                function(newVal, oldVal, scope) { scope.counter++; }
            );

            scope.$digest();
            expect(scope.counter).toBe(1);
        });

        it('calls listener with new value as old value the first time', function() {
           scope.someVal = 123;
           var oldValueGiven;

           scope.$watch(
               function(scope) { return scope.someVal; },
               function(newVal, oldVal, scope) { oldValueGiven = oldVal; }
           );

           scope.$digest();
           expect(oldValueGiven).toBe(123);
        });
    });
});