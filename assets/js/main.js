app = {
  header: {
    waypoint: []
  },
  state: {
    menu: 'closed',
    footer: 'closed',
    isLoaded: false
  },
  getHash: function() {
    return (document.location.hash) ? document.location.hash: '/';
  },
  getPathFromHash: function(hash) {
    return (hash == '/') ? hash:
      hash.replace('#', '') + '.html';
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

  index(function() {
    $('body').addClass('is-loaded');
    app.state.isLoaded = true;

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
        // Hack to prevent footer from flashing when content initially loads
        $('div[data-include="content"]').css('height', 'auto').css('min-height', 'auto');
      });
    });
  });
});

/**
 * @target      [String|$elem]  Selector of element to load content into
 * @pathToLoad  [String]        Path (filename, CSS selector [optional]) of
 *                                content to load into @target
 * @cb          [Function]      (Optional) Function to run when load completes
 */
function load(target, pathToLoad, cb) {

  target = (!target) ? 'div[data-include]': target;

  $(target).load(pathToLoad, function() {

    $('.router-link').off('click').click(function(e) {
      var $this = $(this),
        href = $this.attr('href'),
        parent = $this.data('parent'),
        path = app.getPathFromHash(href),
        anchor = href.replace(/\/?#/, '');


      e.stopPropagation();

      // Close Main Menu, then scroll to top of page
      $('#navbar').collapse('hide');
      $('.navbar-toggle').removeClass('active');
      $.smoothScroll({scrollTarget: 'body', afterScroll: function() {
        load('div[data-include]', path, function() {
          setActiveMenuItem(app.getHash());
        });
      }});
    });

    switch (app.getHash()) {
      case '#what-we-do':
        whatWeDo();
      break;
      case '#state-of-mi':
        stateOfMi();
      break;
      case '#contact-us':
        contactUs();
      break;
      case '#about-us':
        stateOfMi();
      break;
      case '#headlines':
      case '#our-work':
        home();
      break;
      case '/':
      case '#home':
        home(function() {
          setActiveMenuItem(location.hash);
        });
      break;
    }

    if (cb && typeof cb == 'function')
      cb();

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

  /**
   * Parallax scrolling effect for header
   */
   $('[data-include="content"] div:first').waypoint({group: 'header', handler: function(direction) {
     var $nav = $('nav.navbar');
     if (app.state.menu === 'closed' && direction === 'up') {
         app.state.menu === 'open';
         $nav.animate({top: '0px'}, 'fast', function() {
           app.state.menu === 'closed';
         });
     } else if (app.state.menu === 'closed' && direction === 'down') {
       app.state.menu === 'open';
       $nav.animate({top: '-150px'}, 'slow', function() {
         app.state.menu === 'closed';
       });
     }
   }}, {continuous: false});

  /**
   * Animate footer when scrolled to
   */
  $('footer h2').waypoint(function(direction) {
    if (direction === 'up' && app.state.footer === 'open') {
      $(this.element).animate({'padding-top': '45px', 'padding-bottom': '45px'}, 1000);
      app.state.footer = 'closed';
    } else if (direction === 'down' && app.state.footer === 'closed') {
      $(this.element).animate({'padding-top': '100px', 'padding-bottom': '100px'}, 1000);
      app.state.footer = 'open';
    }
  }, {
    offset: '100%'
  });

  if (cb && typeof cb == 'function')
    cb();
}

function home(cb) {
  if ($(window).width() <= 768)
    return;

  $('section [class*="-text"], .text-fadeIn').css('visibility', 'hidden');
  $('.warmup-container').css({left: '2000px'});
  $('.homepage-section .separator hr').width('0');

  /**
   * Animate each homepage <section>
   */
  $('.homepage-section [class*="-text"]:first-child').waypoint(function(direction) {
    if (direction === 'up')
      return;

    var $section = $(this.element).parents('section'),
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

function contactUs() {
  home();
  $('#contact-us-form').validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      // everything looks good!
      $('#success_message').fadeIn('fast');
    }
  })
}

function whatWeDo() {
  var $galleryItems = $('.gallery-item');
  $galleryItems.css({left: '2000px'});

  home();

  $('section [class*="-text"]:first-child').waypoint(function(direction) {
    if (direction === 'up')
      return;

    var $section = $(this.element).parents('section');
    $section.find('[class*="-text"]').textillate({in: {
      effect: 'fadeInUp',
      sync: true,
      delay: 0
    }});

    // Remove event handler since this only needs to fire once
    this.destroy();
  }, {
    offset: '90%'
  });

  $('.megatrends').waypoint(function(direction) {
    $galleryItems.animate({left: '0px'}, 'slow');
    this.destroy();
  }, {offset: '90%'});
}

function animateSections() {
  $('section [class*="-text"]').css('visibility', 'hidden');

  /**
   * Animate each <section>
   */
  $('section [class*="-text"]:first-child').waypoint(function(direction) {
    if (direction === 'up')
      return;

    var $section = $(this.element).parents('section');
    $section.find('[class*="-text"]').textillate({in: {
      effect: 'fadeInUp',
      sync: true,
      delay: 0
    }});

    // Remove event handler since this only needs to fire once
    this.destroy();
  }, {
    offset: '90%'
  });
}

function stateOfMi() {
  $('section [class*="-text"]').css('visibility', 'hidden');
  $('.animate-bg').css({backgroundPosition: '2000px'});

  /**
   * Animate each <section>
   */
  $('section [class*="-text"]:first-child').waypoint(function(direction) {
    if (direction === 'up')
      return;

    var $section = $(this.element).parents('section');
    $section.find('[class*="-text"]').textillate({in: {
      effect: 'fadeInUp',
      sync: true,
      delay: 0
    }});

    $section.find('.animate-bg').animate({backgroundPosition: '0'}, 'slow');

    // Remove event handler since this only needs to fire once
    this.destroy();
  }, {
    offset: '90%'
  });
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
