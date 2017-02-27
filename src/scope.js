/**
 * Created by vunguyen on 2/26/17.
 */
'use strict';

var _ = require('lodash');

function Scope() {
    this.$$watchers = [];
}

function initWatchVal() {
}

Scope.prototype.$watch = function (watchFn, listenerFn) {
    this.$$watchers.push({
        watchFn: watchFn,
        listenerFn: listenerFn || function () {
        },
        last: initWatchVal
    });
};

Scope.prototype.$$digestOnce = function () {
    var self = this;
    var newVal, oldVal, dirty;

    _.forEach(this.$$watchers, function (watcher) {
        newVal = watcher.watchFn(self);
        oldVal = watcher.last;

        if (newVal !== oldVal) {
            watcher.last = newVal;
            watcher.listenerFn(newVal,
                oldVal === initWatchVal ? newVal : oldVal,
                self);
            dirty = true;
        }
    });
    return dirty;
};

Scope.prototype.$digest = function () {
    var ttl = 10;
    var dirty;

    do {
        dirty = this.$$digestOnce();

        if (dirty && !(ttl--)) {
            throw 'max ttl digest iterations reached';
        }
    } while (dirty);
};

module.exports = Scope;