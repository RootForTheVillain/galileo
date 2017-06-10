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
  },
  state: {
    menu: 'closed'
  }
};

$(document).ready(function() {
    var $menu = $('#main-menu-container');
    $menu.hide();

    $('#copyright-date').text(new Date().getFullYear());

    $('#hamburger').click(function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    $menu.find('li').clone().appendTo('#footer-menu');

    loadPartial(window.location.hash);
    //bindRouterLinks();
    setActiveMenuItem(window.location.hash);
});

function bindRouterLinks() {
  $('.router-link').off('click').click(function(e) {
    var href = $(this).attr('href');
    e.stopPropagation();

    if (app.state.menu === 'open') {
      toggleMenu();
    }

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
    break;
    default:
      href = 'home';
    break;
  }

  $('[data-include]').load(href + '.html', function() {
    var hash = '#' + href;
    app.history.add(hash);
    bindRouterLinks();
    setActiveMenuItem(hash);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  });
}

function setActiveMenuItem(hash) {
  $('#footer-menu li').each(function() {
    var $this = $(this),
        href = $this.find('a.router-link').attr('href');

    $this.removeClass('active');

    if (href !== undefined && href.toLowerCase() == hash.toLowerCase()) {
      $this.addClass('active');
    }
  });
}

function toggleMenu() {
  var delay,
      $menu = $('#main-menu-container');

  if (app.state.menu === 'open') {
    delay = 0;
    $menu.find('li').each(function() {
      var $this = $(this);
      setTimeout(function() {
        $this.animate({left: '1000px'}, 'fast');
      }, delay);
      delay += 75;
    });

    $menu.animate({backgroundPosition: '-900px'}).slideUp(100);
    app.state.menu = 'closed';

  } else {

    delay = 75;
    $menu.slideDown(100, function() {
      $menu.animate({backgroundPosition: '0px'});
    }).find('li').each(function() {
      delay += 50;
      var $this = $(this);
      setTimeout(function() {
        $this.animate({left: '0px'}, 'fast');
      }, delay);
    });
    app.state.menu = 'open';
  }
}
