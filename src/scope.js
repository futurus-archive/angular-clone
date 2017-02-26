/**
 * Created by vunguyen on 2/26/17.
 */
'use strict';

var _ = require('lodash');

function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {}

Scope.prototype.$watch = function (watchFn, listenerFn) {
    this.$$watchers.push({
        watchFn: watchFn,
        listenerFn: listenerFn,
        last: initWatchVal
    });
};

Scope.prototype.$digest = function () {
    var self = this;
    var newVal, oldVal;

    _.forEach(this.$$watchers, function (watcher) {
        newVal = watcher.watchFn(self);
        oldVal = watcher.last;

        if (newVal !== oldVal) {
            watcher.last = newVal;
            watcher.listenerFn(newVal,
                oldVal === initWatchVal ? newVal : oldVal,
                self);
        }
    });
};

module.exports = Scope;