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
      var location = this.getPrevious();
      if (location != null) {
          loadPartial(location);
      }
    }
  },
  state: {
    menu: 'closed',
    firstLoad: true
  }
};

$(document).ready(function() {
    var $menu = $('#main-menu-container'),
      hash = window.location.hash;

    $menu.hide().find('li').clone().appendTo('#footer-menu');

    $('#copyright-date').text(new Date().getFullYear());

    $('#hamburger').click(function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    loadPartial(hash, function() {
      if (app.state.firstLoad === true) {
        $('.text-fadeIn').textillate({in: { effect: 'fadeInUp', sync: true }});

        var delay = 50;
        $('.splash-square-img').css({filter: 'grayscale(0)'}).each(function() {
          var $this = $(this);

          setTimeout(function() {
            $this.animate({'top': '0'}, 'slow', function() {
              for (var i = 0; i <= 100; i++) {
                setTimeout(function() {
                  $this.css('filter', 'grayscale(' + i + '%)');
                }, 250);
              }
            });
          }, delay);

          delay += 200;
        });

        $('.splash-square a.router-link').textillate({in: { effect: 'fadeInUp', sync: true }});
        $('body').addClass('is-loaded');
        this.app.state.firstLoad = false;
      }
    });

    setActiveMenuItem(hash);
});

function bindRouterLinks() {
  $('.router-link').off('click').click(function(e) {

    console.log('[Back] router-link click evt called')

    var href = $(this).attr('href');
    e.stopPropagation();

    if (app.state.menu === 'open') {
      toggleMenu();
    }

    loadPartial(href);
  });

  $('.btn-back').attr('href', this.app.history.getPrevious());

  $('.btn-back').click(function(e) {
    e.stopPropagation();
    //app.history.back();
    console.log('Back href=' + $(this).attr('href'))
  });
}

function loadPartial(hash, callback) {
  var href;

  if (app.state.menu === 'open') {
    toggleMenu();
  }

  hash = hash.toLowerCase();
  switch (hash) {
    case '#what-we-do':
    case '#our-work':
    case '#headlines':
    case '#about-us':
    case '#contact-us':
    /*case '#measure-what-counts':
    case '#get-into-the-mud':
    case '#moons-and-marbles':
    case '#love-this-thing':*/
    case '#state-of-mi':
    case '#state-of-mi-1':
    case '#state-of-mi-2':
    case '#state-of-mi-3':
    case '#motown-redefined':
      href = hash.replace('#', '');
    break;
    default:
      href = 'home';
      hash = '#' + href;
    break;
  }

  $('[data-include]').load(href + '.html', function() {
    app.history.add(hash);
    bindRouterLinks();
    setActiveMenuItem(hash);
    $('html, body').animate({ scrollTop: 0 }, 'fast');

    if (callback && typeof callback === 'function') {
      callback();
    }
  });
}

function setActiveMenuItem(hash) {
  $('#main-menu li, #footer-menu li').each(function() {
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
