module.exports = function (config) {
    config.set({
        frameworks: ['browserify', 'jasmine'],
        files: [
            'src/**/*.js',
            'test/**/*_spec.js'
        ],
        preprocessors: {
            'src/**/*.js': ['jshint', 'browserify'],
            'test/**/*_spec.js': ['jshint', 'browserify']
        },
        browsers: ['PhantomJS'],
        bundleDelay: 2000
    });
};