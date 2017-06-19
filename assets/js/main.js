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

          console.log('Running callbacks:', key);

          callbacks[key].call();
        }
      }
    }
  }
};



$(document).ready(function() {

  var hash = location.hash;
  if (hash) {
    load(null, app.getPathFromHash(hash), function() {
      setActiveMenuItem(hash);
    });
  }

  console.log('document.ready', app.state.isLoaded, location.hash)

  if (!app.state.isLoaded) {
    index(function() {
      $('body').addClass('is-loaded');
      app.state.isLoaded = true;
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
      e.preventDefault();

      load('div[data-include]', path, function() {
        app.runCallbacks($this);
        $.smoothScroll({scrollTarget: 'a[name="top"]'});
        setActiveMenuItem(app.getHash());
      });
    });

    if (cb && typeof cb === 'function')
      cb();

    if (app.state.menu === 'open')
      toggleMenu();
  });
}

function index(cb) {
  var $menu = $('#main-menu-container'),
    hash = app.getHash();

  $menu.hide().find('li').clone().appendTo('#footer-menu');

  $('#copyright-date').text(new Date().getFullYear());

  $('#hamburger').click(function(e) {
    e.stopPropagation();
    toggleMenu();
  });

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
    });
  });

  if (cb && typeof cb === 'function')
    cb();
}

function home(cb) {
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

  if (cb && typeof cb === 'function')
    cb();
}

function setActiveMenuItem(hash) {
  hash = (!hash) ? app.getHash(): hash;
  $('#main-menu li, #footer-menu li').each(function() {
    var $this = $(this),
        href = $this.find('a.router-link').attr('href');

    $this.removeClass('active');

    if (href && href == hash) {
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
