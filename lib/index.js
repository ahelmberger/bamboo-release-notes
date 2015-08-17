'use strict';

var replacements = [
  [ /\*/g, '\\*' ],
  [ /#/g, '\\#' ],
  [ /\//g, '\\/' ],
  [ /\(/g, '\\(' ],
  [ /\)/g, '\\)' ],
  [ /\[/g, '\\[' ],
  [ /\]/g, '\\]' ],
  [ /</g, '&lt;' ],
  [ /\>/g, '&gt;' ],
  [ /_/g, '\\_' ]
];

function markdownEscape(string) {
  return replacements.reduce(function(current, replacement) {
    return current.replace(replacement[0], replacement[1]);
  }, string);
}

function protectLeadingWhitespaces(string) {
  var captures = /^(\s+)/.exec(string);
  return captures ? new Array(captures[1].length + 1).join('&nbsp;') + string.substr(captures[1].length) : string;
}

function createReleaseNotes(json) {
  return json.changes.change.reduce(function (paragraphs, change) {
    var header = '__Commit [' + change.changesetId + '](' + change.commitUrl + ') by ' + change.fullName + ':__';
    var comment = change.comment.split('\n').map(markdownEscape).map(protectLeadingWhitespaces).join('  \n');
    paragraphs.push(header, '', comment, '', '---', '');
    return paragraphs;
  }, [json.reasonSummary, '', '---', '']).join('\n');
}

function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}

module.exports = function (options) {
  var url = options.bambooServer +
            '/rest/api/latest/result/' +
            options.buildPlan +
            '/' +
            options.buildNumber +
            '.json?os_authType=basic&expand=changes.change.files';

  return fetch(url).then(handleResponse).then(createReleaseNotes);
};
