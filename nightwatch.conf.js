
const Services = {}; loadServices();

module.exports = {
  "src_folders": ["tests"],

  "webdriver": {
    "start_process": true,
    "server_path": "./node_modules/.bin/geckodriver",
    "cli_args": [
      "--log", "debug"
    ],
    "port": 4444
  },

  "test_settings": {
    "default": {
      "desiredCapabilities": {
        "browserName": "firefox",
        "acceptInsecureCerts": true,
        "alwaysMatch": {
          "moz:firefoxOptions": {
            "args": ["-headless"]
          }
        }

      }
    }
  }
};

function loadServices() {
  try {
    Services.seleniumServer = require('selenium-server');
  } catch (err) { }

  try {
    Services.chromedriver = require('chromedriver');
  } catch (err) { }

  try {
    Services.geckodriver = require('geckodriver');
  } catch (err) { }
}
