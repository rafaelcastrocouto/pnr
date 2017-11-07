var http = require('http');
var read = require('node-read');
var cheerio = require('cheerio');
var host = process.env.HOST;
var port = process.env.PORT || 5000;
var defaultbody = '<body><div id="container"><div id="bh"><a href="/"><img src="data:image/jpeg;base64,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AAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADPwAAAAYAAAAAAAAAAAAAAEAAAABAAAAABQBwAGgAbwB0AG8AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAABAAAAAAFJnaHRsb25nAAAAQAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABU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IHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9Ikdvb2dsZSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMTEtMDZUMTg6MTE6MzQtMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTExLTA2VDIxOjMyOjM1LTAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE3LTExLTA2VDIxOjMyOjM1LTAyOjAwIiB4bXBNTTpEb2N1bWVudElEPSJBRDM3ODBCM0I3MzE2MzEyQzY5NEIxREFBQUFGODJEOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxODFBOTBDNDRBQzNFNzExQTM4REJBRUNCMEQwNjdBOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJBRDM3ODBCM0I3MzE2MzEyQzY5NEIxREFBQUFGODJEOCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTgxQTkwQzQ0QUMzRTcxMUEzOERCQUVDQjBEMDY3QTgiIHN0RXZ0OndoZW49IjIwMTctMTEtMDZUMjE6MzI6MzUtMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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"/></a>'+
' <a class="l" href="#news">Novidades</a> <a class="l" href="#yt">Videos</a></div><div id="content">';

var body = defaultbody;

var extractList = function (url, selector, cb) {
  read(url, function(err, article, res) {
    var $ = cheerio.load(article.html);
    var list = '';
    $(selector).each(function (i, el) {
      list += cheerio.load(el).html();
    });
    if (cb) cb(list);
  });
};

var createServer = function () {
  http.createServer(function(request, response) {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.statusCode = 200;
    response.end(header+body);
  }).listen(port, host);
}

var update = function () {
  body = defaultbody;
  extractList('https://www.youtube.com/user/canalpoenaroda/videos', '.channels-content-item', function (youtube) {
    body += '<div id="yt">'+youtube+'</div>';
    extractList('http://www.superpride.com.br', '.entry-post', function (superpride) {
      body += '<div id="news"><h2>Novidades</h2>'+superpride+'</div></div></div></body></html>';
    });
  });
}

var header = '<!DOCTYPE html><html lang="en"><head>'+
'<meta charset="utf-8"><title>Põe na Roda</title><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><style>'+
'html,body,#container{height:100%;margin:0;}'+
'body {background:#efefef;font-size:13px;font-family:"YouTube Noto",Roboto,arial,sans-serif;}'+
'h3{font-size:13px;margin:4px 0;}'+
'ul{list-style:none;padding:0;margin:0}'+
'li{list-style:none;}'+
'a{color: #167ac6;margin:0;padding:0;border:0;font-size:100%;background:transparent;}'+
'.clearfix:before{content:".";display:block;height:0;visibility:hidden;}'+
'.clearfix:after{content:".";display:block;height:0;visibility:hidden;clear:both;}'+
'.no-focus-outline :focus{outline:0;}'+
'a{color:#167ac6;cursor:pointer;text-decoration:none;}'+
'a:hover,a:focus{text-decoration:underline;}'+
'.accessible-description{display:none;}'+
'.spf-link{position:relative;}'+
'.yt-badge-list{visibility:hidden;}'+
'.yt-lockup-meta{position:absolute;left:200px;top:0;}'+
'.video-time{position: absolute;bottom:6px;right:2px;padding:0 4px;font-weight:500;font-size:11px;background-color:#000;color:#fff;height:14px;line-height:14px;opacity:0.75;vertical-align:top;display:inline-block;}'+
'.channels-content-item{position:relative;margin-bottom:12px;min-height:180px;}'+
'#container{display:flex;flex-direction:column;}'+
'#bh{float:none;background:#fff;width:100%;padding:6px;z-index:1;min-height:68px;}'+
'#bh .l{margin:0 10px;font-size: 15px;}'+
'#content{overflow:scroll;margin-top:8px;}'+
'#yt,#news{margin:0 8px;}'+
'#yt{margin-bottom:16px;margin-right:0;}'+
'#news{float:right;}'+
'#news > div{break-inside: avoid;}'+
'#news img,.hid,button{display: none;}'+
'#news *{font-size:13px;line-height:16px;font-weight:normal;}'+
'#news .posted-in,#news .entry-views,.yt-lockup-meta{color:rgb(118, 118, 118);font-size:11px;}'+
'#news > h2{font-size:15px;color:#999;}'+
'@media(min-width:419px){'+
'  #bh .l,#news > h2{display:none;}'+
'  .yt-lockup-meta{position:inherit;left:0;}'+
'  #yt{float:right;width:200px;}'+
'  #news{float:left;width:calc(100% - 232px);column-width:280px;}'+
'}</style></head>';

update();
createServer();
setInterval(update, 1000 * 60 * 2);