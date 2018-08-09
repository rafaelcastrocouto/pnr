var fs      = require('fs');
var http    = require('http');
var read    = require('node-read');
var feed    = require('feed-read');
var cheerio = require('cheerio');
var static  = require('serve-static')(__dirname);
var host    = process.env.HOST;
var port    = process.env.PORT || 5000;

require.extensions['.html'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
}

var header = require('./header.html');
var menu   = require('./menu.html');
var end = require('./end.html');

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
      response.end(header + body + end);
    });
  }).listen(port, host);
}

var update = function() {
  body = menu;
  extractList('https://www.youtube.com/user/canalpoenaroda/videos', '.channels-content-item', function(youtube) {
    body += '<div id="yt">' + youtube + '</div>';
    var data = [];
    feed('http://poenaroda.com.br/feed', function (error, articles) {
      if (!error) {
        var articlesCount = 0;
        articles.forEach(function (article) {
          data.push(article);
          articlesCount++;
          if (articlesCount === articles.length) {
            body += '<div id="feed" style="display:none">'+(JSON.stringify(data))+'</div>';
          }
        });
      }
    });
  });
}

update();
createServer();
setInterval(update, 1000 * 60 * 60);
