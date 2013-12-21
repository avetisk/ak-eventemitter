module.exports = process.env.TEST_COVERAGE ? require('./lib-cov/eventemitter') : require('./lib/eventemitter');
