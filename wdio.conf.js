exports.config = {
  sync: true,
  host: 'localhost',
  port: 4444,
  path: '/wd/hub',
  specs: ['./src/test/**/*.test.js'],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'selenoid:options': {
      maxInstances: 1,
      browserName: 'chrome',
      platform: 'LINUX',
      version: '81.0',
      enableVNC: true,
      screenResolution: '1920x1080x24'
    },
    'goog:chromeOptions': {
      args: [
        '--window-size=1920,1080'
      ]
    }
  }],
  logLevel: 'trace',
  coloredLogs: true,
  deprecationWarnings: true,
  bail: 0,
  baseUrl: `http://${process.env.HOST}/`,
  waitforTimeout: 15000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [
    [
      'allure',
      {
        resultsDir: './allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        disableMochaHooks: true
      }
    ]
  ],
  mochaOpts: {
    timeout: 60000,
    compilers: ['ts:ts-node/register'],
    require: ['source-map-support/register']
  },
  onPrepare: function(config, capabilities) {
    require('dotenv').config()
  },
  before: function(capabilities, specs) {
    global.reporter = require('@wdio/allure-reporter').default
    const chai = require('chai')
    chai.config.includeStack = true
    chai.config.showDiff = true
    chai.config.truncateThreshold = 0
    global.expect = chai.expect
  },
  beforeTest: function(test, context) {
    global.cache = require('memory-cache')
  },
  afterTest: function(test, context, { error, result, duration, passed, retries }) {
    const cache = global.cache
    if (cache) {
      cache.clear()
    }
  }
}
