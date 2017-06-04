$(document).ready(function() {
    var $menu = $('.main-menu-container');

    $menu.hide();
    $('#copyright-date').text(new Date().getFullYear());

    $('#hamburger').click(function(e) {
      e.stopPropagation();
      $menu.slideToggle('slow');
    });

    $('#footer-menu').append($menu.find('li'));

    loadPartial(window.location.hash);
    bindRouterLinks();
    //setActiveMenuItem(window.location.hash);
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
    case '#about-us-2':
    case '#contact-us':
    case '#measure-what-counts':
    case '#get-into-the-mud':
    case '#moons-and-marbles':
    case '#love-this-thing':
    case '#state-of-mi':
    case '#state-of-mi-1':
    case '#state-of-mi-2':
    case '#state-of-mi-3':
    case '#motown-redefined':
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
    //initPage(href);
  });
}

function initPage(href) {
  switch (href.toLowerCase()) {
    case 'about-6metre-financial':

    break;
  }

  //setActiveMenuItem(window.location.hash);
}

/*function setActiveMenuItem(hash) {
  $('.navbar-right li').each(function() {
    var href = $(this).find('a.router-link').attr('href');

    if (href !== undefined && href.toLowerCase() == hash.toLowerCase()) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active')
    }
  });
}*/
