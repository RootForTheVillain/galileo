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
    isLoaded: false
  },
  getHash: function() {
    return (document.location.hash) ? document.location.hash: '/';
  },
  getPathFromHash: function(hash) {
    return (hash == '/') ? hash:
      hash.replace('#', '') + '.html';
  },
  getCallbacks: function($elem) {
    var arr,
      cb = $elem.data('callback'),
      callbacks;

    if (cb) {
      arr = cb.split(',');
      callbacks = {};

      for (var i = 0; i < arr.length; i++) {
        if (typeof window[arr[i]] === 'function') {
          callbacks[arr[i]] = window[arr[i]];
        }
      }
    }
    return callbacks;
  },
  runCallbacks: function($elem) {
    var callbacks = this.getCallbacks($elem);
    if (callbacks && typeof callbacks === 'object') {
      for (var key in callbacks) {
        if (callbacks.hasOwnProperty(key)) {
          callbacks[key].call();
        }
      }
    }
  }
};



$(document).ready(function() {
  /**
   * Handles refreshes on partials
   */
  var hash = location.hash;
  if (hash) {
    load(null, app.getPathFromHash(hash), function() {
      setActiveMenuItem(hash);
    });
  }

  if (!app.state.isLoaded) {

    index(function() {
      $('body').addClass('is-loaded');
      app.state.isLoaded = true;

      home(function() {

        // Animate footer when scrolled to
        $('footer h2').waypoint(function(direction) {
          if (direction === 'up')
            return;

          $(this.element).animate({'padding-top': '75px', 'padding-bottom': '75px'}, 1000);

          // Remove event handler since this only needs to fire once
          this.destroy();
        }, {
          offset: '100%'
        });

        setActiveMenuItem(location.hash);
      });
    });
  }
});

/**
 * @target      [String|$elem]  Selector of element to load content into
 * @pathToLoad  [String]        Path (filename, CSS selector [optional]) of
 *                                content to load into @target
 * @cb          [Function]      (Optional) Function to run when load completes
 */
function load(target, pathToLoad, cb) {

  target = (!target) ? 'div[data-include]': target;

  app.history.add(document.location.hash);

  $(target).load(pathToLoad, function() {

    $('.router-link').off('click').click(function(e) {
      var $this = $(this),
        href = $this.attr('href'),
        parent = $this.data('parent'),
        path = app.getPathFromHash(href),
        anchor = href.replace(/\/?#/, '');

      e.stopPropagation();

      load('div[data-include]', path, function() {
        app.runCallbacks($this);
        $.smoothScroll({scrollTarget: 'a[name="top"]'});
        setActiveMenuItem(app.getHash());
      });
    });

    if (cb && typeof cb === 'function')
      cb();

    /*if (app.state.menu === 'open')
      toggleMenu();*/
  });
}

/**
 * Bootstrapper
 */
function index(cb) {
  var $menu = $('#navbar'),
    hash = app.getHash();

  $menu.find('li').clone().appendTo('#footer-menu');

  $('.copyright span').text(new Date().getFullYear());

  $('.navbar-toggle').click(function() {
      $(this).toggleClass('active');
  });

  /*$('button.navbar-toggle').click(function(e) {
    e.stopPropagation();
    toggleMenu();
  });*/

  /**
    * Interior page elements with class="homepage-section"
    * will appear on homepage
    */
  $('div[data-content]').each(function() {
    var $this = $(this),
      filename = ($this.data('content') == '/') ? $this.data('content'):
        $this.data('content') + '.html',
      filter = $this.data('filter'),
      pathToLoad = (filter) ? filename + ' ' + filter: filename;

    load($this, pathToLoad, function() {
      app.runCallbacks($this);

      if (cb && typeof cb === 'function')
        cb();
    });
  });
}

function home(cb) {
  if ($(window).width() <= 768)
    return;

  $('[class*="-text"]').css('visibility', 'hidden');
  $('.warmup-container').css({left: '2000px'});

  $('.text-fadeIn').textillate({in: { effect: 'fadeInUp', sync: true }});

  /**
   * Parallax scrolling effect for header
   */
  var _state = 0;
  $('[data-include="content"] div:first').waypoint(function(direction) {
    var $nav = $('nav.navbar');
    if (_state === 0 && direction === 'up') {
        _state = 1;
        $('body').animate({'padding-top': '80px'}, 'fast', function() {
          $nav.animate({top: '0px'}, 'fast', function() {
            _state = 0;
          });
        });
    } else if (_state === 0 && direction === 'down') {
      _state = 1;
      $nav.animate({top: '-150px'}, 'slow', function() {
        $('body').animate({'padding-top': '0'}, 'slow', function() {
          _state = 0;
        });
      });
    }
  }, {continuous: false});

  /**
   * Animate each homepage <section>
   */
  $('.homepage-section').waypoint(function(direction) {
    if (direction === 'up')
      return;

    var $section = $(this.element),
      $hr = $section.find('.separator hr'),
      fn = function() {
        $section.find('[class*="-text"]').textillate({in: {
          effect: 'fadeInUp',
          sync: true,
          delay: 0
        }});

        $section.find('.warmup-container').animate({left: '0px'}, 'slow');
      };

    if ($hr.length > 0) {
      $hr.animate({'width': '100%'}, 750, fn);
    } else {
      fn();
    }

    // Remove event handler since this only needs to fire once    
    this.destroy();
  }, {
    offset: '90%'
  });

  if (cb && typeof cb === 'function') {
    cb();
  }
}

function setActiveMenuItem(hash) {
  hash = (!hash) ? app.getHash(): hash;

  $('#navbar li, #footer-menu li').each(function() {
    var $this = $(this),
        href = $this.find('a').attr('href');

    $this.removeClass('active');

    if (href && href == hash) {
      $this.addClass('active');
    }
  });
}
/*
function toggleMenu() {
  var delay,
      $menu = $('#main-menu-container'),
      $wrapper = $('#main-menu-container .main-menu-wrapper');

  if (app.state.menu === 'open') {
    delay = 0;
    $menu.find('li').each(function() {
      var $this = $(this);
      setTimeout(function() {
        $this.animate({left: '1000px'}, 'fast');
      }, delay);
      delay += 75;
    });

    $wrapper.animate({backgroundPosition: '-900px'}, function() {
      $menu.slideUp(100);
    });
    $('.navbar-toggle').removeClass('active');
    app.state.menu = 'closed';

  } else {

    delay = 75;
    $menu.slideDown(100, function() {
      $wrapper.animate({backgroundPosition: '0px'});
    }).find('li').each(function() {
      delay += 50;
      var $this = $(this);
      setTimeout(function() {
        $this.animate({left: '0px'}, 'fast');
      }, delay);
    });
    $('.navbar-toggle').addClass('active');
    app.state.menu = 'open';
  }
}*/
