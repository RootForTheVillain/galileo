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
    var $menu = $('.main-menu-container');

    $menu.hide();
    $('#copyright-date').text(new Date().getFullYear());

    $('#hamburger').click(function(e) {
      e.stopPropagation();
      $menu.slideToggle('slow');
    });

    loadPartial(window.location.hash);
    bindRouterLinks();
    setActiveMenuItem(window.location.hash);
});

function bindRouterLinks() {
  $('.router-link').off('click').click(function(e) {
    var href = $(this).attr('href');/*,
      route = (typeof href != 'undefined') ? href : $(this).attr('data-target');*/

    e.stopPropagation();
    loadPartial(href);
  });

  $('.btn-back').click(function(e) {
    e.stopPropagation();
    console.log(window.history)
    window.history.back();
  });
}

function loadPartial(href) {
  $('.main-menu-container').slideUp('fast');

  href = href.toLowerCase();
  switch (href) {
    case '#what-we-do':
    case '#our-work':
    case '#headlines':
    case '#about-us':
    case '#contact-us':
    case '#measure-what-counts':
    case '#get-into-the-mud':
    case '#moons-and-marbles':
    case '#love-this-thing':
      href = href.replace('#', '');
      //$('body').removeAttr('id');
    break;
    default:
      href = 'home';
      //$('body').attr('id', 'splash');
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

/*function dateDiff(date1, date2) {
  var msInAYear = 31536000000;
  return Math.floor(Math.abs(date1 - date2) / msInAYear);
}*/
