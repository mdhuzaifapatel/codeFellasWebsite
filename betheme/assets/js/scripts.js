(function($) {

  /* globals jQuery, lozad, ScrollMagic */

  "use strict";

  var  dictionary = {
    '.one'	: 'One Page',
    '.por'	: 'Portfolio',
    '.box'	: 'Boxed',
    '.blo'	: 'Blog',
    '.dar'	: 'Dark',
    '.sho'	: 'Shop',
    '.mob'  : 'Mobile First',
    '.lig'	: 'Light',
    '.ele'	: 'Elementor',

    '.ani' : 'Animals & Nature',
    '.art' : 'Art & Culture',
    '.car' : 'Cars & Bikes',
    '.cor' : 'Corporations & Organizations',
    '.des' : 'Design & Photography',
    '.edu' : 'Education & Science',
    '.ent' : 'Entertainment',
    '.fas' : 'Fashion',
    '.fin' : 'Finance',
    '.foo' : 'Food & Restaurants',
    '.hea' : 'Health & Beauty',
    '.hou' : 'Housing & Architecture',
    '.mag' : 'Magazines & Writing',
    '.occ' : 'Occasions & Gifts',
    '.oth' : 'Others',
    '.peo' : 'People and services',
    '.pro' : 'Product & Production',
    '.spo' : 'Sports & Travel',
    '.tec' : 'Technology & Computing ',
  };

  var Splash = (function($) {

    var body = $('body');
    var header = $('#header');
    var websites = $('.websites');
    var websitesIso = $('.websites-iso');
    var search = $('input.search');
    var menu = $('#menu');

    var sidebar = false;
    var searchLock = false;
    var submenuLock = false;
    var stickyOff = false;

    var headerH = 0;
    var previousY = 0;

    var getWebsitesOnce = false;
    var getWebsitesDone = $.Deferred();
    var isMobile = false;

    /**
     * Mobile
     */

    var mobile = {

      // mobile.set()

      set: function() {

        headerH = header.height();

        if (window.innerWidth <= 777) {
          isMobile = true;
        } else {
          isMobile = false;
        }

        if (isMobile) {

          body.addClass('mobile');

          if (header.hasClass('filters-open')) {
            this.filtersSize();
          }

          this.filtersToHeader();

        } else {

          body.removeClass('mobile');

          this.filtersToContent();

        }

        if (header.hasClass('submenu-open')) {
          this.submenuSize();
        }

      },

      toggleMenu: function() {

        header.toggleClass('menu-open');
        header.removeClass('filters-open search-open');

        if (header.hasClass('submenu-open')) {
          this.submenuClose();
        }

      },

      menuClose: function(){

        header.removeClass('menu-open');
        this.submenuClose();

      },

      submenuOpen: function(el) {

        // open 2nd level
        el.closest('li').addClass('open');

        header.addClass('submenu-open');
        this.modalOpen();
        this.submenuSize();

      },

      submenuClose: function() {
        header.removeClass('submenu-open').find('li.open').removeClass('open');
        this.modalClose();
      },

      submenuSize: function() {
        header.find('li.open > ul').innerWidth(window.innerWidth).innerHeight(window.innerHeight - headerH);
      },

      modalOpen: function() {
        body.addClass('modal-open');
      },

      modalClose: function() {
        body.removeClass('modal-open');
      },

      searchToggle: function() {
        header.toggleClass('search-open');
        header.removeClass('filters-open menu-open submenu-open');
        this.modalClose();
      },

      filtersToggle: function() {
        header.toggleClass('filters-open');
        header.removeClass('search-open menu-open submenu-open');

        if (header.hasClass('filters-open')) {
          this.filtersSize();
          this.modalOpen();
        } else {
          this.modalClose();
        }

      },

      filtersClose: function() {
        header.removeClass('filters-open');
        this.modalClose();
      },

      filtersSize: function() {
        header.find('.filters').innerWidth(window.innerWidth).innerHeight(window.innerHeight - headerH);
      },

      filtersToHeader: function() {
        $('#websites .filters .sidebar__inner').detach().prependTo('#header .filters');
      },

      filtersToContent: function() {
        $('#header .filters .sidebar__inner').detach().prependTo('#websites .filters .inner-wrapper-sticky');
        if( sidebar ){
          sidebar.stickySidebar('updateSticky');
        }
      }

    };

    /**
     * One page
     */

    var onePage = {

      positions: [],

      // onePage.setPositions()

      setPositions: function() {

        var $this = this;

        $('article[id]').each(function() {

          var article = $(this);
          var id = article.attr('id');

          $this.positions[id] = {
            top: article.offset().top,
            bottom: article.offset().top + article.height() - 1
          };

        });

        // console.log($this.positions);

      },

      // onePage.scrollActive()

      scrollActive: function() {

        var active = false;

        var $this = this,
          $menu = $('#menu > ul > li.active > .one-page');

        var currentY = $(window).scrollTop();

        $('article[id]').each(function() {

          var article = $(this);
          var id = article.attr('id');

          if ((currentY >= $this.positions[id].top) && (currentY < $this.positions[id].bottom)) {
            active = id;
          }

        });

        $menu.find('li').removeClass('active');

        if ( active ) {

          var el = '[data-hash="' + active + '"]';

          $( el, $menu ).closest('li').addClass('active');

          if( $( el, $menu ).length ){

            history.replaceState({}, '', '#' + active);

          } else {

            history.replaceState({}, '', ' ');

          }

        } else {

          history.replaceState({}, '', ' ' );

        }

      },

      // onePage.click()

      click: function(link) {

        var el = link.closest('li');
        var hash = '#' + link.data('hash');

        el.addClass('active')
          .siblings().removeClass('active');

        if ( ! $(hash).length ) {
          return false;
        }

        history.replaceState({}, '', hash);

        mobile.menuClose();

        submenuLock = true;

        $('html, body').animate({
          scrollTop: $(hash).offset().top + 1
        }, 200, 'swing');

        setTimeout(function() {
          submenuLock = false;
        }, 250);

      },

      // onePage.scrollTo()

      scrollTo: function(el) {

        var hash = el.attr('href');

        mobile.menuClose();

        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 200);

      },

      // onePage.scrollTop()

      scrollTop: function() {

        $('html, body').animate({
          scrollTop: 0
        }, 200);

      }

    };

    /**
     * Sticky header
     */

    var sticky = {

      websitesTop: 0,
      websitesBottom: 0,

      // sticky.set()

      set: function() {

        if( ! websites.length ){
          return;
        }

        this.websitesTop = $('#websites .search-wrapper').offset().top - 0;
        this.websitesBottom = websites.offset().top + websites.height() - headerH /* header height */ ;

      },

      // sticky.scroll()

      scroll: function() {

        var currentY = $(window).scrollTop();

        if ( ! headerH ) {
          // some JS has not been finished
          return false;
        }

        // console.log([currentY, this.websitesTop, this.websitesBottom]);

        if ( stickyOff ) {
          return false;
        }

        if ( submenuLock && header.hasClass('down') ) {

          // submenu - one page link clicked

        } else if ( searchLock ) {

          // #websites - scroll to websites top when filter selected

          header
            .removeClass('hide down')
            .addClass('show sticky search animate');

        } else if (currentY <= 1) {

          // site TOP - static header

          header
            .removeClass('sticky down hide show')
            .addClass('animate-bg');


        } else if ((currentY >= this.websitesTop) && (currentY < this.websitesBottom)) {

          // #websites - menu or search inside websites section

          header
            .removeClass('hide down')
            .addClass('show sticky search animate');

          if (currentY > previousY) {
            header.addClass('search');
          } else {
            header.removeClass('search');
          }

        } else if (currentY <= headerH) {

          // space <= header height - first 70px of the page - do nothing

        } else if (currentY < previousY) {

          // scroll up - menu

          header
            .removeClass('hide search down')
            .addClass('show sticky animate');

        } else {

          // scroll down - submenu

          header
            .removeClass('hide search animate-bg')
            .addClass('show sticky down animate');

        }

        previousY = currentY;

      },

    };

    /**
     * Search
     */

    var searchForm = {

      timer: false,

      // searchForm.search()

      search: function(value) {

        var filter = value.replace('&', '').replace(/ /g, '').toLowerCase();

        // TMP: temporary holiday filters
        // pseudo Thesaurus

        if( 'christ' == filter || 'christmas' == filter ){
          filter = 'xmas';
        }

        if( 'new' == filter || 'newyear' == filter ){
          filter = 'party';
        }

        // end: TMP: temporary holiday filters

        isotope.scrollTop();

        search.val(value);

        if (filter) {
          body.addClass('search-active');
          header.addClass('search-open');
        } else {
          body.removeClass('search-active');
        }

        isotope.overlay('show');

        setTimeout(function(){

          getWebsites();

          $.when(getWebsitesDone).done(function(){

            websitesIso.isotope({
              filter: function() {
                return filter ? $(this).data('title').match(filter) : true;
              }
            });

            isotope.clear();
            isotope.result( filter );

          });

        }, 200);

      },

      searchTimer: function(input) {

        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          searchForm.search(input.val());
        }, 300, input);

      },

      clear: function() {

        search.val('');
        body.removeClass('search-active');

      }

    };

    /**
     * Isotope
     */

    var isotope = {

      currentFilters: {
        layout: [],
        subject: []
      },

      // isotope.concatValues()

      concatValues: function(filters) {

        var i = 0;
        var comboFilters = [];

        for ( var prop in filters ) {
          var filterGroup = filters[ prop ];
          // skip to next filter group if it doesn't have any values
          if ( !filterGroup.length ) {
            continue;
          }
          if ( i === 0 ) {
            // copy to new array
            comboFilters = filterGroup.slice(0);
          } else {
            var filterSelectors = [];
            // copy to fresh array
            var groupCombo = comboFilters.slice(0); // [ A, B ]
            // merge filter Groups
            for (var k=0, len3 = filterGroup.length; k < len3; k++) {
              for (var j=0, len2 = groupCombo.length; j < len2; j++) {
                filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
              }

            }
            // apply filter selectors to combo filters for next group
            comboFilters = filterSelectors;
          }
          i++;
        }

        var comboFilter = comboFilters.join(', ');
        return comboFilter;

      },

      // isotope.init()

      init: function() {

        websitesIso.isotope({
          itemSelector: '.website',
          transitionDuration: 200,
          hiddenStyle: {
            opacity: 0
          },
          visibleStyle: {
            opacity: 1
          }
        }).isotope('reloadItems').isotope({
          sortBy: 'original-order'
        });

        websitesIso.on('layoutComplete', function() {
          recalculate();
        });

      },

      // isotope.reset()

      reset: function(li, group) {

        var index = this.currentFilters[group].indexOf( li.data('filter') );

        li.removeClass('current');

        this.currentFilters[group].splice( index, 1 );

        if ( ! this.currentFilters.layout.length && ! this.currentFilters.subject.length ) {
          body.removeClass('filter-active');
        }

        websitesIso.isotope({
          filter: this.concatValues(this.currentFilters)
        });

        this.result();

      },

      // isotope.scrollTop()

      scrollTop: function() {

        searchLock = true;

        $('html, body').animate({
          scrollTop: websites.offset().top - 90
        }, 200);

        setTimeout(function() {
          searchLock = false;
        }, 250);

      },

      // isotope.filter()

      filter: function(el) {

        var li = el.closest('li');
        var group = el.closest('ul').data('filter-group');

        isotope.scrollTop();
        mobile.filtersClose();

        searchForm.clear();

        isotope.overlay('show');

        setTimeout(function(){

          getWebsites();

          $.when(getWebsitesDone).done(function(){

            if (li.hasClass('current')) {
              isotope.reset(li, group);
              return true;
            }

            // li.siblings().removeClass('current');
            li.addClass('current');

            isotope.currentFilters[group].push( li.data('filter') );

            websitesIso.isotope({
              filter: isotope.concatValues(isotope.currentFilters)
            });

            body.addClass('filter-active');

            // results

            isotope.result();

          });

        }, 200);

      },

      // isotope.removeButton()

      removeButton: function(){

        $('.show-all .button').remove();

      },

      // isotope.showAll()

      showAll: function(){

        this.overlay('show');

        getWebsites();
        this.result();

      },

      // isotope.overlay()

      overlay: function(state){

        if ( 'show' == state ) {

          websitesIso.addClass('loading');

        } else {

          setTimeout(function(){
            websitesIso.removeClass('loading');
          }, 250);

        }

      },

      // isotope.result()

      result: function(search){

        search = (typeof search !== 'undefined') ?  search : '';

        var count, all, text, layout, subject,
          el = $('.results', websites);

        count = websitesIso.data('isotope').filteredItems.length;
        all = el.data('count');

        // console.log(this.currentFilters);

        layout = this.currentFilters.layout;
        subject = this.currentFilters.subject;

        isotope.overlay('hide');

        if( ! layout.length && ! subject.length && ! search ){

          el.html('<strong>All '+ all + '</strong> pre-built websites');
          return false;
        }

        text  = pluralize(count, 'result') +' for: ';

        if( layout.length ){
          $.each( layout, function( index, value ){
            text += '<span class="filter" data-filter="'+ value +'">'+ dictionary[value] +'</span>';
          });
        }

        if( subject.length ){
          $.each( subject, function( index, value ){
            text += '<span class="filter" data-filter="'+ value +'">'+ dictionary[value] +'</span>';
          });
        }

        if( search ){
          text += '<span class="filter key">'+ search +'</span>';
        }

        el.html(text);

      },

      // isotope.unclick()

      unclick: function(el){

        var filter = el.data('filter');

        if( filter ){
          $('.filters li[data-filter="'+ filter +'"] a').click();
        } else {
          $('.search-wrapper .close').click();
        }


      },

      // isotope.clear()

      clear: function() {

        isotope.currentFilters.layout = [];
        isotope.currentFilters.subject = [];

        $('.filters li').removeClass('current');
        body.removeClass('filter-active');

      }

    };

    /**
     * Sliders
     */

    var sliders = {

      // sliders.init()

      init: function() {
        this.testimonials();
        this.gallery();
        this.video();
        this.landing();
      },

      // sliders.testimonials()

      testimonials: function(){

        $('.testimonials-slider').each(function() {

          var slider = $(this);

          slider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: false,
            responsive: [
              {
                breakpoint: 1239,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });

        });

      },

      // sliders.gallery()

      gallery: function(){

        $('.content-gallery').each(function() {

          var slider = $(this);

          slider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: false,
            responsive: [
              {
                breakpoint: 1239,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });

        });

      },

      // sliders.landing()

      landing: function(){

        $('.landing-livebuilder-slider').each(function() {

          var slider = $(this);

          slider.slick({
            adaptiveHeight: true,
            autoplay: false,
            autoplaySpeed: 2000,
            dots: false
          });

        });

      },

      // sliders.video()

      video: function(){

        $('.our-video-slider').slick({
          centerMode: true,
          centerPadding: '0',
          slidesToShow: 3,
          responsive: [
            {
              breakpoint: 777,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            }
          ]
        });

      },

    };

    /**
     * Tabs
     */

    var tabs = {

      // tabs.init();

      init: function() {

        $('.tabs > ul > li:first').addClass('active');
        $('.tabs > div:first-of-type').siblings('div').hide();

      },

      // tabs.open();

      open: function( $el ){

        var $tabs = $el.closest('.tabs'),
          $li = $el.closest('li');

        var index = $li.index();

        $li.addClass('active')
          .siblings().removeClass('active');

        $tabs.children('div').eq(index).show()
          .siblings('div').hide();

        recalculate();

      }

    };

    /**
     * Menu tabs
     */

    var menuTabs = {

      // menuTabs.init();

      init: function() {

        $('.submenu.with-tabs .tabs-nav > li:first').addClass('active');
        $('.submenu.with-tabs .tab:first-of-type').siblings('.tab').hide();

      },

      // menuTabs.open();

      open: function( $el ){

        var $tabs = $el.closest('.submenu.with-tabs'),
          $li = $el.closest('li');

        var index = $li.index();

        $li.addClass('active')
          .siblings().removeClass('active');

        $tabs.find('.tab').eq(index).show()
          .siblings('.tab').hide();

        recalculate();

      }

    };

    /**
     * Classic simple switch
     */

    var classicSimple = function($el){

      var $li = $el.closest('li'),
        $container = $('.mfn-item');

      var style = $li.data('style');

      $li.addClass('active')
        .siblings().removeClass('active');

      if( 'simple' == style ){
        $container.addClass('style-simple');
      } else {
        $container.removeClass('style-simple');
      }

    };

    /**
     * FAQ
     */

    var faq = {

      // faq.init();

      init: function() {

        $('.faq.open-first .question:first').addClass('active');

      },

      // faq.open();

      open: function( $el ){

        var $li = $el.closest('li');

        if( $li.hasClass('active') ){
          $li.removeClass('active');
        } else {
          $li.addClass('active')
            .siblings().removeClass('active');
        }

        recalculate();

      }

    };

    /**
     * Popup
     */

    var popup = {

      // popup.init();

      init: function() {

        if( 'be-builder' != Cookies.get('be-splash-popup') ){
          body.addClass('show-popup-bebuilder');
        }

      },

      // popup.close();

      close: function( $el ){

        body.removeClass('show-popup-bebuilder');
        Cookies.set('be-splash-popup', 'be-builder');

      }

    };

    /**
     * Accordion
     */

    var accordion = {

      // accordion.init();

      init: function() {

        $('.accordion.open-first .step:first').addClass('active');

      },

      // accordion.open();

      open: function( $el ){

        var $li = $el.closest('li');

        if( $li.hasClass('active') ){
          $li.removeClass('active');
        } else {
          $li.addClass('active')
            .siblings().removeClass('active');
        }

        recalculate();

      }

    };

    /**
     * Filter tabs
     */

    var filterTabs = {

      // filterTabs.init();

      init: function() {

        $('.filter-tabs > ul:first li:first').addClass('active');

      },

      // filterTabs.filter();

      filter: function( $el ){

        var $li = $el.closest('li'),
          $items = $el.closest('.filter-tabs').find('.items');

        var filter = $li.data('filter'),
          container = $el.closest('.filter-tabs').data('container') || 'li',
          prefix = $el.closest('.filter-tabs').data('prefix') || '';

        $li.addClass('active')
          .siblings().removeClass('active');

        if ( '*' == filter ) {
          $items.children( container ).show();
        } else {
          $items.children( container + '.' + prefix + filter ).show();
          $items.children( container ).not('.' + prefix + filter ).hide();
        }

        recalculate();

      }

    };

    /**
     * Countdown
     */

    var countdown = function(){

      $('.countdown').waypoint({

        offset: '100%',
        triggerOnce: true,
        handler: function() {

          var el = $(this.element).length ? $(this.element) : $(this);
          var duration = el.data('duration') || Math.floor((Math.random() * 1000) + 1000);
          var to = el.text();

          $({
            property: 0
          }).animate({
            property: to
          }, {
            duration: duration,
            easing: 'linear',
            step: function() {
              el.text(Math.floor(this.property));
            },
            complete: function() {
              el.text(this.property);
            }
          });

          if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
            this.destroy();
          }
        }

      });

    };


    /**
     * Progress bars
     */

    var progress = function(){

      $('.progress-bars').waypoint({

        offset: '100%',
        triggerOnce: true,
        handler: function() {

          var el = $(this.element).length ? $(this.element) : $(this);
          var duration = 1000;

          el.addClass('hover');

          el.find('.label').each(function(){

            var $item = $(this);
            var to = parseInt( $(this).text(), 10 );

            $({
              property: 0
            }).animate({
              property: to
            }, {
              duration: duration,
              easing: 'linear',
              step: function() {
                $item.text( '+'+ Math.floor(this.property) +'%' );
              },
              complete: function() {
                $item.text( '+'+ this.property +'%' );
              }
            });

          });

          if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
            this.destroy();
          }
        }

      });

    };


    /**
     * Expand
     * expand()
     */

    var expand = function( $el ){

      $el.hide()
        .siblings('.expand-me').show();

    };


    /**
     * Lazy load images
     * lazyLoad()
     */

    var lazyLoad = function() {

      var observer = lozad('.lozad, img[data-src]');
      observer.observe();

    };

    /**
     * Lightbox
     */

    var lightbox = function(){

      // image

      $('a.lightbox-image').magnificPopup({
        type: 'image',
      });

      // video

      $('a.lightbox-video').magnificPopup({
        type: 'iframe',
        iframe: {
          patterns: {
            youtube: {
              index: 'youtube.com/',
              id: 'v=',
              src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
            },
            youtu_be: {
              index: 'youtu.be/',
              id: '/',
              src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
            },
            nocookie: {
              index: 'youtube-nocookie.com/embed/',
              id: '/',
              src: '//www.youtube-nocookie.com/embed/%id%?autoplay=1&rel=0'
            }
          }
        }
      });

    };

    /**
     * Pluralize nouns
     */

    var pluralize = function(count, noun){

      if( 1 !== count ){
        noun = noun + 's';
      }

      return count + ' ' + noun;

    };

    /**
     * Video
     */

    var magicVideo = function(){

      if( ! $('#player-main').length ){
        return;
      }

      var controller = new ScrollMagic.Controller();

      var Scene = new ScrollMagic.Scene({
        triggerElement: "#player-main",
        duration: '160%',
        triggerHook: 0

      }).setPin("#player-main-inner").addTo(controller);

      var Scene3 = new ScrollMagic.Scene({
        triggerElement: "#player-main",
        duration: '69%',
        triggerHook: 0

      });

      Scene3.on("end", function () {
        $("#desc-1").toggleClass("show");
        $(".player-counter-number.two").toggleClass("active");
        $("#desc-2").toggleClass("show");
      }).addTo(controller);

      var Scene4 = new ScrollMagic.Scene({
        triggerElement: "#player-main",
        duration: '140%',
        triggerHook: 0
      });

      Scene4.on("end", function () {
        $("#desc-2").toggleClass("show");
        $("#desc-3").toggleClass("show");
        $(".player-counter-number.three").toggleClass("active");
        $("#replay").toggleClass("showme");
      }).addTo(controller);

      var video = document.getElementById('video');
      var scrollpos = 0;
      var lastpos = void 0;

      var Scene2 = new ScrollMagic.Scene({
        triggerElement: "#player-main",
        duration: '150%',
        triggerHook: 0
      });
      var startScrollAnimation = function startScrollAnimation() {
        Scene2.addTo(controller)
        // .addIndicators()
        .on("progress", function (e) {
          scrollpos = e.progress;
        });

        setInterval(function () {
          if (lastpos === scrollpos) return;
          requestAnimationFrame(function () {

            video.currentTime = video.duration * scrollpos;
            video.pause();
            lastpos = scrollpos;

            var dur = video.currentTime * 100 / video.duration;
            $(".duration").css("width", dur + "%");
          });
        }, 40);
      };

      var preloadVideo = function preloadVideo(v, callback) {
        var ready = function ready() {
          v.removeEventListener('canplaythrough', ready);

          video.pause();
          var i = setInterval(function () {
            if (v.readyState > 3) {
              clearInterval(i);
              video.currentTime = 0;
              callback();
            }
          }, 50);
        };
        v.addEventListener('canplaythrough', ready, false);
        // v.play();
      };

      preloadVideo(video, startScrollAnimation);

    };

    /**
     * Get all pre-built websites
     * getWebsites()
     */

    var getWebsites = function() {

      if ( getWebsitesOnce ) {
        return true;
      }

      getWebsitesOnce = true;

      var data = {
        action: 'get'
      };

      $.ajax({

        type: 'post',
        // dataType: 'json',
        data: data

      }).done(function(response) {

        if (response) {

          websitesIso.append(response).isotope('reloadItems').isotope({
            sortBy: 'original-order'
          });

          websitesIso.on('arrangeComplete', function() {
            lazyLoad();
            isotope.removeButton();
            getWebsitesDone.resolve();
          });

        } else {

          console.log('Error: Could not get all pre-built websites.');

        }

      });

    };

    /**
     * Feature voting
     * vote()
     */

    var vote = function( $el ) {

      var $li = $el.closest('li');

      var id = $li.data('vote');

      var data = {
        action: 'vote',
        id: id
      };

      $.ajax({

        type: 'post',
        // dataType: 'json',
        data: data

      }).done(function(response) {

        if( response ){

          $li.closest('.voting').addClass('voted');

          $li.addClass('active')
            .find('.votes').text( response );

        } else {
          console.log('Voting is not possible at this moment. Please try again later.');
        }

      });

    };

    /**
     * Sticky filters
     */

    var stickyFilters = function() {

      if( ! $('#websites .filters').length ){
        return;
      }

      sidebar = $('#websites .filters').stickySidebar({
        topSpacing: 90
      });

    };

    /**
     * Hash navigation
     */

    var hashNav = function() {

      if( window.location.hash ){
        setTimeout(function(){
          var initial = $(window).scrollTop();
          $(window).scrollTop( $(window).scrollTop() - 2 );
          $(window).scrollTop( initial + 1 );
        }, 100);

      }

    };

    /**
     * Recalculate
     */

    var recalculate = function() {

      $(window).trigger('resize');

      mobile.set();
      sticky.set();

      onePage.setPositions();

      if( sidebar ){
        sidebar.stickySidebar('updateSticky');
      }

    };

    /**
     * Bind
     */

    var bind = function() {

      // websites

      $('.filters').on('click', 'a', function(e) {
        e.preventDefault();
        isotope.filter($(this));
      });

      $('.results').on('click', '.filter', function(e) {
        e.preventDefault();
        isotope.unclick($(this));
      });

      $('.show-all').on('click', '.button', function(e) {
        e.preventDefault();
        isotope.showAll();
      });

      // menu

      menu.on('click', '.menu-toggle', function(e) {
        e.preventDefault();
        mobile.toggleMenu();
      });

      menu.on('click', '.submenu-open', function(e) {
        mobile.submenuOpen($(this));
        return false;
      });

      menu.on('click', '.scroll', function(e) {
        e.preventDefault();
        onePage.click($(this));
      });

      menu.on('click', '.active .one-page li a', function(e) {
        e.preventDefault();
        onePage.click($(this));
      });

      // header

      header.on('click', '.submenu-close', function(e) {
        mobile.submenuClose();
      });

      header.on('click', '.search-toggle', function(e) {
        e.preventDefault();
        mobile.searchToggle();
      });

      header.on('click', '.filters-toggle', function(e) {
        e.preventDefault();
        mobile.filtersToggle();
      });

      // one page

      body.on('click', '.scroll', function(e) {
        e.preventDefault();
        onePage.scrollTo($(this));
      });

      $('.scroll-top').on('click', function(e) {
        e.preventDefault();
        onePage.scrollTop();
      });

      // menu tabs

      $('.submenu.with-tabs .tabs-nav > li').on('click', 'a', function(e) {
        e.preventDefault();
        menuTabs.open($(this));
      });

      // tabs

      $('.tabs:not(.fake-tabs) > ul > li').on('click', 'a', function(e) {
        e.preventDefault();
        tabs.open($(this));
      });

      // classic simple

      $('.classic-simple > ul > li').on('click', 'a', function(e) {
        e.preventDefault();
        classicSimple($(this));
      });

      // filter tabs

      $('.filter-tabs > ul:first li').on('click', 'a', function(e) {
        e.preventDefault();
        filterTabs.filter($(this));
      });

      // faq

      $('.faq .question .title').on('click', function(e) {
        faq.open($(this));
      });

      // popup close

      $('.mfn-popup').on('click', function(e) {
        popup.close($(this));
      });

      // expand

      $('.link-expand').on('click', function(e) {
        e.preventDefault();
        expand($(this));
      });

      // accordion

      $('.accordion > li').on('click', function(e) {
        accordion.open($(this));
      });

      // search

      $('.search-wrapper').on('click', '.close', function() {

        if (body.hasClass('search-active')) {
          searchForm.search('');
        }

        header.removeClass('search-open');

      });

      // vote

      $('.voting-list').on('click', '.vote', function(e) {
        e.preventDefault();

        vote($(this));
      });

      // keyup

      search.on('keyup', function() {
        searchForm.searchTimer($(this));
      });

      // window.scroll

      $(window).scroll(function() {

        sticky.scroll();
        onePage.scrollActive();

      });

      // window resize

      $(window).on('debouncedresize', function() {

        mobile.set();
        sticky.set();

      });

    };

    /**
     * Ready
     * document.ready
     */

    var ready = function() {

      lazyLoad();
      onePage.setPositions();

      sliders.init();

      menuTabs.init();
      tabs.init();
      filterTabs.init();
      accordion.init();
      faq.init();

      countdown();
      progress();

      lightbox();

      bind();

    };

    /**
     * Load
     * window.load
     */

    var load = function() {

      stickyFilters();

      isotope.init();

      magicVideo();

      hashNav();

      popup.init();

      // show all websites on websites subpage

      if( $('body').hasClass('page-websites') ){
        $('.show-all > a').trigger('click');
      }

      $(".twentytwenty-container").twentytwenty({default_offset_pct: 0.624, before_label: 'Backend', after_label: 'Frontpage'});

      recalculate();

    }

    /**
     * Return
     */

    return {
      ready: ready,
      load: load
    };

  })(jQuery);

  /**
   * $(document).ready
   */

  $(function() {

    Splash.ready();

    /* ATF Lottie animation on homepage */
    var container = document.getElementById("slider-lottie");
  	var lottieSlider = bodymovin.loadAnimation({
  		container: container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'https://muffingroup.com/betheme/assets/lottie/home-splash-atf.json'
    });

    /* Lottie player Mfn to BeBuilder logo on homepage */
    if($("#mb-bb").length){
      LottieInteractivity.create({
        mode:"scroll",
        player:'#mb-bb',
        container:'#mb-bb',
        actions: [
          {
            visibility:[0,1],
            type: "seek",
            frames: [0, 159],
          },
        ]
      });
    }

    /* Delay autoplay Hero Video on BeBuilder by 0.5s */
    if($("#bebuilder-hero-video").length){
      setTimeout(function(){
        document.getElementById("bebuilder-hero-video").play();
      }, 700)
    }

  });

  /**
   * $(window).load
   */

  $(window).on('load', function(){
    Splash.load();
  });

})(jQuery);
