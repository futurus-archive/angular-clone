/**
 * Created by vunguyen on 2/26/17.
 */
'use strict';

var _ = require('lodash');

function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

function initWatchVal() {
}

Scope.prototype.$watch = function (watchFn, listenerFn, valueEq) {
    var self = this;
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function () {},
        valueEq: !!valueEq,
        last: initWatchVal
    };
    
    // unshift rather than push to support watch removal inside of $watch
    this.$$watchers.unshift(watcher); 
    this.$$lastDirtyWatch = null;
    
    return function() {
        var index = self.$$watchers.indexOf(watcher);
        if (index >= 0) {
            self.$$watchers.splice(index, 1);
            self.$$lastDirtyWatch = null;
        }
    };
};

Scope.prototype.$$digestOnce = function () {
    var self = this;
    var newVal, oldVal, dirty;

    // forEachRight rather than forEach to support watch removal inside of $watch
    _.forEachRight(this.$$watchers, function (watcher) {
        try {
            // making sure watcher exists, see watch removing several watches test case
            if (watcher) {
                newVal = watcher.watchFn(self);
                oldVal = watcher.last;

                if (!self.$$areEqual(newVal, oldVal, watcher.valueEq)) {
                    self.$$lastDirtyWatch = watcher;
                    watcher.last = (watcher.valueEq ? _.cloneDeep(newVal) : newVal);
                    watcher.listenerFn(newVal,
                        oldVal === initWatchVal ? newVal : oldVal,
                        self);
                    dirty = true;
                } else if (self.$$lastDirtyWatch === watcher) {
                    return false;
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
    return dirty;
};

Scope.prototype.$digest = function () {
    var ttl = 10;
    var dirty;
    this.$$lastDirtyWatch = null;

    do {
        dirty = this.$$digestOnce();

        if (dirty && !(ttl--)) {
            throw 'max ttl digest iterations reached';
        }
    } while (dirty);
};

Scope.prototype.$$areEqual = function(newVal, oldVal, valueEq) {
    if (valueEq) {
        return _.isEqual(newVal, oldVal);
    } else {
        return newVal === oldVal ||
            (typeof newVal === 'number' &&
             typeof oldVal === 'number' &&
             isNaN(newVal) && isNaN(oldVal));
    }
};

Scope.prototype.$eval = function (expr, locals) {
    return expr(this, locals);
};

module.exports = Scope;