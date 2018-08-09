var content = $('#content');

var yt = $('#yt');
$('.yt-uix-sessionlink').each(function (i, el) {
  el.setAttribute('href', 'https://www.youtube.com' + el.getAttribute('href'));
  el.setAttribute('target', '_blank');
});

var news = $('<div>').attr('id','news').addClass('tab mhide').prependTo(content);
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

var feed = $('#feed').text();
var data = JSON.parse(feed);
data.sort(function (a, b) {
  var aDate = new Date(a.published),
    bDate = new Date(b.published);
  return bDate - aDate;
});
data.forEach(addArticle);

var ct = $('#ct');

var menu = {
  yt: yt,
  news: news,
  ct: ct
}

$('#header .link').on('click', function () {
  var target = $(this);
  var id = target.data('to');
  if (menu[id]) {
    window.scrollTo(0,0);
    $('#header .link.active').removeClass('active');
    target.addClass('active');
    $('#content > .tab').addClass('mhide');
    menu[id].removeClass('mhide');
  }
});
