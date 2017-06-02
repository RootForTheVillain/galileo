/*$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $('#navbar').addClass("navbar-shadow");
    }
    else {
        $('#navbar').removeClass("navbar-shadow");
    }
});*/

$(document).ready(function() {
    $('#copyright-date').text(new Date().getFullYear());

    loadPartial(window.location.hash);
    bindRouterLinks();
    setActiveMenuItem(window.location.hash);
});

function bindRouterLinks() {
  $('.router-link').off('click').click(function(e) {
    e.stopPropagation();
    loadPartial($(this).attr('href'));
  });
}

function loadPartial(href) {
  href = href.toLowerCase();
  switch (href) {
    case '#about-6metre-financial':
    case '#360-degree-planning':
    case '#products-and-services':
    case '#contact':
      href = href.replace('#', '');
      $('body').removeAttr('id');
    break;
    default:
      href = 'home';
      $('body').attr('id', 'splash');
    break;
  }

  $('[data-include]').load(href + '.html', function() {
    bindRouterLinks();
    initPage(href);
  });
}

function initPage(href) {
  switch (href.toLowerCase()) {
    case 'about-6metre-financial':

      var today = new Date();
      $('.financial-advisor-experience').text(dateDiff(today, new Date('4/1/2008')));
      $('.lending-experience').text(dateDiff(today, new Date('4/1/2015')));
      $('.training-experience').text(dateDiff(today, new Date('4/1/2012')));

    break;
  }

  setActiveMenuItem(window.location.hash);
}

function setActiveMenuItem(hash) {
  $('.navbar-right li').each(function() {
    var href = $(this).find('a.router-link').attr('href');

    if (href !== undefined && href.toLowerCase() == hash.toLowerCase()) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active')
    }
  });
}

function dateDiff(date1, date2) {
  var msInAYear = 31536000000;
  return Math.floor(Math.abs(date1 - date2) / msInAYear);
}
