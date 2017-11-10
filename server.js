var http = require('http');
var read = require('node-read');
var cheerio = require('cheerio');
var static = require('serve-static')(__dirname);
var host = process.env.HOST;
var port = process.env.PORT || 5000;
var fs = require('fs');

require.extensions['.html'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
}

var header = require("./header.html");
var menu = require("./menu.html");
var script = require("./script.html");
var body = menu;

var extractList = function(url, selector, cb) {
  read(url, function(err, article, res) {
    var $ = cheerio.load(article.html);
    var list = '';
    $(selector).each(function(i, el) {
      list += cheerio.load(el).html();
    });
    if (cb)
      cb(list);
  });
};

var createServer = function() {
  http.createServer(function(request, response) {
    static(request, response, function onNext(err) {
      response.setHeader('Content-Type', 'text/html; charset=UTF-8');
      response.statusCode = 200;
      response.end(header + body);
    });
  }).listen(port, host);
}

var update = function() {
  body = menu;
  extractList('https://www.youtube.com/user/canalpoenaroda/videos', '.channels-content-item', function(youtube) {
    body += '<div id="yt">' + youtube + '</div>';
    extractList('http://poenaroda.com.br', '.col-sm-6', function(superpride) {
      body += '<div id="news"><h2>Novidades</h2>' + superpride + '</div>' + script;
    });
  });
}

update();
createServer();
setInterval(update, 1000 * 60 * 15);
