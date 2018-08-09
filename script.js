/*var news = document.getElementById('news');
if (!news) setTimeout(location.reload.bind(location), 500);
var newslinks = news.getElementsByTagName('a');
[].forEach.call(newslinks, function (el, i) {
  el.setAttribute('target', '_blank');
});*/


var yt = document.getElementById('yt');
var ytlinks = document.getElementsByClassName('yt-uix-sessionlink');
[].forEach.call(ytlinks, function (el, i) {
  el.setAttribute('href', 'https://www.youtube.com' + el.getAttribute('href'));
  el.setAttribute('target', '_blank');
});

var news = $('<div>').attr('id','news').appendTo($('#content'));
var addArticle = function (article) {
  var container = $('<div>').addClass('article').appendTo(news),
    title = $('<a>').addClass('title').attr('href', article.link).appendTo(container),
    content = $('<div>').addClass('content').html(article.content).appendTo(container),
    meta = $('<p>').addClass('meta').appendTo(container),
    date = new Date(article.published),
    formatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    //link = $('<a>').attr('href', article.feed.link).appendTo(meta);
  $('<h1>').text(article.title).appendTo(title);
  $('<span>').addClass('date').text(formatedDate).appendTo(meta).attr('title', date.toUTCString());
  //$('<span>').text(article.feed.name).appendTo(link);
  //$('<span>').addClass('author').text(article.author).appendTo(meta);
};

var feed = document.getElementById('feed');
var data = JSON.parse(feed.textContent);
data.sort(function (a, b) {
  var aDate = new Date(a.published),
    bDate = new Date(b.published);
  return bDate - aDate;
});
data.forEach(addArticle);