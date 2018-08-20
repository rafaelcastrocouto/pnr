var content = $('#content');

var yt = $('#yt');
$('.yt-uix-sessionlink').each(function (i, el) {
  el.setAttribute('href', 'https://www.youtube.com' + el.getAttribute('href'));
  el.setAttribute('target', '_blank');
});

var news = $('#news')
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
