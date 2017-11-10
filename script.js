
var news = document.getElementById('news');
if (!news) setTimeout(location.reload.bind(location), 500);
var newslinks = news.getElementsByTagName('a');
[].forEach.call(newslinks, function (el, i) {
  el.setAttribute('target', '_blank');
});
var yt = document.getElementById('yt');
var ytlinks = document.getElementsByClassName('yt-uix-sessionlink');
[].forEach.call(ytlinks, function (el, i) {
  el.setAttribute('href', 'https://www.youtube.com' + el.getAttribute('href'));
  el.setAttribute('target', '_blank');
});
var links = document.getElementsByClassName('l');
var content = document.getElementById('content');
var scrollevent = function() {
  if (yt.offsetHeight < content.scrollTop) {
    links[1].setAttribute('disabled', true);
    links[0].removeAttribute('disabled');
  } else {
    links[0].setAttribute('disabled', true);
    links[1].removeAttribute('disabled');
  }
};
content.addEventListener('scroll', scrollevent);
var searchtoggle = document.getElementsByClassName('search-toggle')[0];
searchtoggle.removeAttribute('href');
var searchform = document.getElementsByClassName('headline-search')[0];
var sociallinks = document.getElementsByClassName('social-links ')[0];
var searchclick = function() {
  toggleSearch();
  return false;
};
searchtoggle.addEventListener('click', searchclick);
var toggleSearch = function () {
  searchform.classList.toggle('toggled');
  searchtoggle.classList.toggle('toggled');
  sociallinks.classList.toggle('toggled');
};
var hidesearch = function (e) {
  if (!searchform.contains(e.target) && !searchtoggle.contains(e.target)){
    searchform.classList.remove('toggled');
    searchtoggle.classList.remove('toggled');
    sociallinks.classList.remove('toggled');
  }
};
document.addEventListener('click', hidesearch);