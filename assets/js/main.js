app = {
  history: {
    _history: [],
    add: function(location) {
      this._history.push(location);
    },
    getPrevious: function() {
      if (this._history.length < 2)
        return null;

      var index = this._history.length - 2,
        location = this._history.slice(index, index + 1).pop();

      return location;
    },
    back: function() {
      if (this._history.length < 2)
        return;

      var index = this._history.length - 2,
        location = this._history.slice(index, index + 1).pop();

      loadPartial(location);
    }
  }
};

$(document).ready(function() {
    var $menu = $('.main-menu-container');

    $menu.hide();
    $('#copyright-date').text(new Date().getFullYear());

    $('#hamburger').click(function(e) {
      e.stopPropagation();
      $menu.slideToggle('slow');
    });

    $menu.find('li').clone().appendTo('#footer-menu');

    loadPartial(window.location.hash);
    //bindRouterLinks();
    setActiveMenuItem(window.location.hash);
});

function bindRouterLinks() {
  $('.router-link').off('click').click(function(e) {
    var href = $(this).attr('href');/*,
      route = (typeof href != 'undefined') ? href : $(this).attr('data-target');*/
    e.stopPropagation();
    loadPartial(href);
  });

  var previous = this.app.history.getPrevious();

  $('.btn-back').attr('href', previous);

  /*$('.btn-back').click(function(e) {
    e.stopPropagation();
    app.history.back();
  });*/
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
    case '#contact-us-2':
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
    app.history.add('#' + href);
    bindRouterLinks();
    //initPage(href);
  });
}

function initPage(href) {
  switch (href.toLowerCase()) {
    case 'about-6metre-financial':

    break;
  }

  setActiveMenuItem(window.location.hash);
}

function setActiveMenuItem(hash) {
  $('#footer-menu li').each(function() {
    var href = $(this).find('a.router-link').attr('href');

    if (href !== undefined && href.toLowerCase() == hash.toLowerCase()) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active')
    }
  });
}
