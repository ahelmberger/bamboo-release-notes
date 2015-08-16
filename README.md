# bamboo-release-notes [![Build Status](https://secure.travis-ci.org/ahelmberger/bamboo-release-notes.png?branch=master)](https://travis-ci.org/ahelmberger/bamboo-release-notes)

Creates release notes in Markdown format from a Bamboo build.

## Install

```bash
npm install --save bamboo-release-notes
```

## Example

    var bambooReleaseNotes = require('bamboo-release-notes');

    bambooReleaseNotes({
      bambooServer: 'http://bamboo.mydomain.com:8085',
      bambooUserName: 'john.doe',
      bambooPassword: 'password',
      buildPlan: 'PLAN-KEY',
      buildNumber: '123'
    }).then(function (result) {
      console.log(result);   // Prints the Markdown document
    });

__Note: This module assumes that `fetch` and `Promise` are available in the global namespace. I suggest to import the [es6-promise](https://www.npmjs.com/package/es6-promise) and [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) modules, so it works both on the server as well as in the browser.__

## License

MIT
