var fs      = require('fs');
var http    = require('http');
var read    = require('node-read');
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
    extractList('http://www.poenaroda.com.br/category/diversidade', '.td_module_mx18, .td_module_wrap', function (home) {
      body += '<div id="news" class="tab mhide">'+home+'<!-- diversidade end -->';
      extractList('http://www.poenaroda.com.br/category/pop', 'td_module_mx18, .td_module_wrap', function (pop) {
        body += '<!-- pop start -->'+pop+'</div>';
        extractList('http://poenaroda.com.br/contato', '.td-ss-main-content', function (contact) {
          body += '<div id="ct" class="tab mhide">' + contact + '</div>';
          createServer();
        });
      });
    });
  });
}

update();
setInterval(update, 1000 * 60 * 60);
