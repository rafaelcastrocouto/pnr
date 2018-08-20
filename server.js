var fs      = require('fs');
var http    = require('http');
var read    = require('node-read');
//var feed    = require('feed-read');
var cheerio = require('cheerio');
var static  = require('serve-static')(__dirname);
var host    = process.env.HOST;
var port    = process.env.PORT || 5000;

require.extensions['.html'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
}

var header = require('./html/header.html');
var menu   = require('./html/menu.html');
var end = require('./html/end.html');

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
    body += '<div id="yt" class="tab">' + youtube + '</div>';
    extractList('http://poenaroda.com.br/contato', '.td-ss-main-content', function (contact) {
      body += '<div id="news" class="tab mhide"><iframe src="https://poenaroda.com.br"></iframe></div>';
      body += '<div id="ct" class="tab mhide">' + contact + '</div>';
      createServer();
      /*extractList('http://poenaroda.com.br', '.home', function (home) {
        body += '<div id="feed" class="tab mhide">' + home + '</div>';
        createServer();
      });*/
      /*feed('http://poenaroda.com.br/feed', function (error, articles) {
        if (!error) body += '<div id="feed" style="display:none">'+(JSON.stringify(articles))+'</div>';
      });
      */
    });
  });
}

update();
setInterval(update, 1000 * 60 * 60);
