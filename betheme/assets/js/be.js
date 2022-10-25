(function($) {

  /* globals jQuery */

  "use strict";

  var $be = $('.mfn-item');
  
  var lightboxAttr = true;

  /**
   * Sliders configuration
   * Slick Slider | Auto responsive
   */

  function slickAutoResponsive(slider, max, size) {

    if (!max){
      max = 5;
    }
    if (!size){
      size = 380;
    }

    var width = slider.width() || 0,
      count = Math.ceil(width / size);

    if (count < 1) count = 1;
    if (count > max) count = max;

    return count;
  }

  /**
   * Slider
   */

  function sliderSlider() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.content_slider_ul', $be).each(function() {

      var slider = $(this);
      var count = 1;
      var centerMode = false;

      if (slider.closest('.content_slider').hasClass('carousel')) {
        count = slickAutoResponsive(slider);

        $(window).on('debouncedresize', function() {
          slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider), false);
          slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider), true);
        });
      }

      if (slider.closest('.content_slider').hasClass('center')) {
        centerMode = true;
      }

      slider.slick({
        cssEase: 'cubic-bezier(.4,0,.2,1)',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        centerMode: centerMode,
        centerPadding: '20%',

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: count,
        slidesToScroll: count
      });

      // Lightbox | disable on dragstart

      var clickEvent = false;

      slider.on('dragstart', '.slick-slide a[rel="lightbox"]', function(event) {
        if (lightboxAttr) {
          var events = $._data(this,'events');
          if( events && Object.prototype.hasOwnProperty.call(events, 'click') ){
            clickEvent = events.click[0];
            $(this).addClass('off-click').off('click');
          }
        }
      });

      // Lightbox | enable after change

      slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
        if (lightboxAttr) {
          $('a.off-click[rel="lightbox"]', slider).removeClass('off-click').on('click', clickEvent);
        }
      });

    });
  }

  /**
   * Shop
   */

  function sliderShop() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.shop_slider_ul', $be).each(function() {

      var slider = $(this);
      var slidesToShow = 4;

      var count = slider.closest('.shop_slider').data('count');
      if (slidesToShow > count) {
        slidesToShow = count;
        if (slidesToShow < 1) {
          slidesToShow = 1;
        }
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
        appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: slickAutoResponsive(slider, slidesToShow),
        slidesToScroll: slickAutoResponsive(slider, slidesToShow)
      });

      // ON | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
      });

    });
  }

  /**
   * Offer
   */

  function sliderOffer() {
    $('.offer_ul', $be).each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="slider_prev" href="#"><span class="button_icon"><i class="icon-up-open-big"></i></span></a>',
        nextArrow: '<a class="slider_next" href="#"><span class="button_icon"><i class="icon-down-open-big"></i></span></a>',

        adaptiveHeight: true,
        //customPaging 	: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

      // Pagination | Show (css)

      slider.siblings('.slider_pagination').addClass('show');

      // Pager | Set slide number after change

      slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
        slider.siblings('.slider_pagination').find('.current').text(currentSlide + 1);
      });

    });
  }

  /**
   * Offer thumb
   */

  function sliderOfferThumb() {

    var pager = function(el, i) {
      var img = $(el.$slides[i]).find('.thumbnail:first').html();
      return '<a>' + img + '</a>';
    };

    $('.offer_thumb_ul', $be).each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        arrows: false,
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pagination'),
        customPaging: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

    });
  }

  /**
   * Portfolio
   */

  function sliderPortfolio() {

    $('.portfolio_slider_ul', $be).each(function() {

      var slider = $(this);
      var size = 380;
      var scroll = 5;

      if (slider.closest('.portfolio_slider').data('size')) {
        size = slider.closest('.portfolio_slider').data('size');
      }

      if (slider.closest('.portfolio_slider').data('size')) {
        scroll = slider.closest('.portfolio_slider').data('scroll');
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="slider_nav slider_prev themebg" href="#"><i class="icon-left-open-big"></i></a>',
        nextArrow: '<a class="slider_nav slider_next themebg" href="#"><i class="icon-right-open-big"></i></a>',

        autoplay:false,
        autoplaySpeed: 5000,

        slidesToShow: slickAutoResponsive(slider, 5, size),
        slidesToScroll: slickAutoResponsive(slider, scroll, size)
      });

      // ON | debouncedresize
      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, 5, size), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, scroll, size), true);
      });

    });
  }

  /**
   * Testimonials
   */

  function sliderTestimonials() {

    var pager = function(el, i) {
      var img = $(el.$slides[i]).find('.single-photo-img').html();
      return '<a>' + img + '</a>';
    };

    $('.testimonials_slider_ul', $be).each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

        adaptiveHeight: true,
        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: 1,
        slidesToScroll: 1
      });

    });
  }

  /**
   * Blog
   */

  function sliderBlog() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $('.blog_slider_ul', $be).each(function() {

      var slider = $(this);
      var slidesToShow = 4;

      var count = slider.closest('.blog_slider').data('count');
      if (slidesToShow > count) {
        slidesToShow = count;
        if (slidesToShow < 1) {
          slidesToShow = 1;
        }
      }

      slider.slick({
        cssEase: 'ease-out',
        dots: true,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
        appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

        appendDots: slider.siblings('.slider_pager'),
        customPaging: pager,

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: slickAutoResponsive(slider, slidesToShow),
        slidesToScroll: slickAutoResponsive(slider, slidesToShow)
      });

      // On | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
      });

    });
  }

  /**
   * Clients
   */

  function sliderClients() {

    $('.clients_slider_ul', $be).each(function() {

      var slider = $(this);

      slider.slick({
        cssEase: 'ease-out',
        dots: false,
        infinite: true,
        touchThreshold: 10,
        speed: 300,

        prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
        nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
        appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

        autoplay: false,
        autoplaySpeed: 5000,

        slidesToShow: slickAutoResponsive(slider, 4),
        slidesToScroll: slickAutoResponsive(slider, 4)
      });

      // ON | debouncedresize

      $(window).on('debouncedresize', function() {
        slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, 4), false);
        slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, 4), true);
      });

    });

  }

  /**
   * Lightbox | Magnific Popup
   * with prettyPhoto backward compatibility
   */

  function lightbox() {

    var galleries = [];

    // init

    var init = function() {

      compatibility();
      setType();
      constructor();

    };

    // backward compatibility for prettyPhoto

    var compatibility = function() {

      $('a[rel^="prettyphoto"], a.prettyphoto, a[rel^="prettyphoto"]', $be).each(function() {

        var el = $(this);
        var rel = el.attr('rel');

        if (rel) {
          rel = rel.replace('prettyphoto', 'lightbox');
        } else {
          rel = 'lightbox';
        }

        el.removeClass('prettyphoto').attr('rel', rel);

      });

    };

    // check if item is a part of gallery

    var isGallery = function(rel) {

      if (!rel) {
        return false;
      }

      var regExp = /\[(?:.*)\]/;
      var gallery = regExp.exec(rel);

      if (gallery) {
        gallery = gallery[0];
        gallery = gallery.replace('[', '').replace(']', '');
        return gallery;
      }

      return false;
    };

    // set array of names of galleries

    var setGallery = function(gallery) {

      if (galleries.indexOf(gallery) == -1) {
        galleries.push(gallery);
        return true;
      }

      return false;
    };

    // get file type by link

    var getType = function(src) {

      if (src.match(/youtube\.com\/watch/i) || src.match(/youtube\.com\/embed/i) || src.match(/youtu\.be/i)) {
        return 'iframe';

      } else if (src.match(/youtube-nocookie\.com/i)) {
        return 'iframe';

      } else if (src.match(/vimeo\.com/i)) {
        return 'iframe';

      } else if (src.match(/\biframe=true\b/i)) {
        return 'ajax';

      } else if (src.match(/\bajax=true\b/i)) {
        return 'ajax';

      } else if (src.substr(0, 1) == '#') {
        return 'inline';

      } else {
        return 'image';

      }
    };

    // set file type

    var setType = function() {

      $('a[rel^="lightbox"]', $be).each(function() {

        var el = $(this);
        var href = el.attr('href');
        var rel = el.attr('rel');

        // FIX: WPBakery Page Builder duplicated lightbox
        if ( el.closest('.wpb_column').length ){
          return true;
        }

        if (href) {

          // gallery

          var gallery = isGallery(rel);

          if (gallery) {
            el.attr('data-type', 'gallery');
            setGallery(gallery);
            return true;
          }

          el.attr('data-type', getType(href));

          // iframe paremeters

          if (getType(href) == 'iframe') {
            el.attr('href', href.replace('&rel=0', ''));
          }
        }

      });

    };

    // constructor

    var constructor = function() {

      var attr = {
        autoFocusLast: false,
        removalDelay: 160,
        image: {
          titleSrc: function(item) {
            return false;
          }
        }
      };

      // image

      $('a[rel^="lightbox"][data-type="image"]', $be).magnificPopup({
        autoFocusLast: attr.autoFocusLast,
        removalDelay: attr.removalDelay,
        type: 'image',
        image: attr.image
      });

      // iframe | video

      $('a[rel^="lightbox"][data-type="iframe"]', $be).magnificPopup({
        autoFocusLast: attr.autoFocusLast,
        removalDelay: attr.removalDelay,
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

      // inline

      $('a[rel^="lightbox"][data-type="inline"]', $be).magnificPopup({
        autoFocusLast: attr.autoFocusLast,
        type: 'inline',
        midClick: true,
        callbacks: {
          open: function() {
            $('.mfp-content').children().addClass('mfp-inline');
          },
          beforeClose: function() {
            $('.mfp-content').children().removeClass('mfp-inline');
          }
        }
      });

      // gallery

      for (var i = 0, len = galleries.length; i < len; i++) {

        var gallery = '[' + galleries[i] + ']';
        gallery = 'a[rel^="lightbox' + gallery + '"]:visible';

        $(gallery).magnificPopup({
          autoFocusLast: attr.autoFocusLast,
          removalDelay: attr.removalDelay,
          type: 'image',
          image: attr.image,
          gallery: {
            enabled: true,
            tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
          }
        });
      }

    };

    // reload

    var reload = function() {

      $('a[rel^="lightbox"]').off('click');
      constructor();

    };

    // init

    init();

    // isotope:arrange

    $(document).on('isotope:arrange', reload);

  }

  /**
   * $(document).ready
   * Specify a function to execute when the DOM is fully loaded.
   */

  $(document).ready(function() {

    /**
     * Lightbox
     */

    lightbox();

    /**
     * Tabs
     */

    $('.jq-tabs', $be).tabs();

    /**
     * Accordion & FAQ
     */

    $('.mfn-acc', $be).each(function() {

      var el = $(this);

      if (el.hasClass('openAll')) {

        // show all
        el.find('.question')
          .addClass("active")
          .children(".answer")
          .show();

      } else {

        // show one
        var activeTab = el.attr('data-active-tab');
        if (el.hasClass('open1st')) activeTab = 1;

        if (activeTab) {
          el.find('.question').eq(activeTab - 1)
            .addClass("active")
            .children(".answer")
            .show();
        }

      }
    });

    $('.mfn-acc .question > .title', $be).on('click', function() {

      if ($(this).parent().hasClass("active")) {

        $(this).parent().removeClass("active").children(".answer").slideToggle(100);

      } else {

        if (!$(this).closest('.mfn-acc').hasClass('toggle')) {
          $(this).parents(".mfn-acc").children().each(function() {
            if ($(this).hasClass("active")) {
              $(this).removeClass("active").children(".answer").slideToggle(100);
            }
          });
        }
        $(this).parent().addClass("active");
        $(this).next(".answer").slideToggle(100);

      }

      setTimeout(function() {
        $(window).trigger('resize');
      }, 50);

    });

    /**
     * Before After | TwentyTwenty
     */

    $('.before_after.twentytwenty-container', $be).twentytwenty();

    /**
     * Chart
     */

    $('.chart', $be).waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function(){

        var el = $(this.element).length ? $(this.element) : $(this);
        var lineW = 6;

        el.easyPieChart({
          animate: 1000,
          lineCap: 'circle',
          lineWidth: lineW,
          size: 140,
          scaleColor: false
        });

        if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
          this.destroy();
        }
      }

    });

    /**
     * Downcount
     */

    $('.downcount', $be).each(function() {
      var el = $(this);
      el.downCount({
        date: el.attr('data-date'),
        offset: el.attr('data-offset')
      });
    });

    /**
     * Animate Math | Counter, Quick Fact, etc.
     */

    $('.animate-math .number', $be).waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function() {

        var el = $(this.element).length ? $(this.element) : $(this);
        var duration = Math.floor((Math.random() * 1000) + 1000);
        var to = el.attr('data-to');

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

    /**
     * Helper
     */

    $('.helper .link.toggle', $be).on('click', function(e) {

      e.preventDefault();

      var el = $(this);
      var id = el.attr('data-rel');
      var parent = el.closest('.helper');

      if (el.hasClass('active')) {

        el.removeClass('active');
        parent.find('.helper_content > .item-' + id).removeClass('active').slideUp(200);

      } else {

        parent.find('.links > .link.active').removeClass('active');
        parent.find('.helper_content > .item.active').slideUp(200);

        el.addClass('active');
        parent.find('.helper_content > .item-' + id).addClass('active').slideDown(200);

      }

      setTimeout(function() {
        $(window).trigger('resize');
      }, 50);

    });

    /**
     * Gallery | WordPress Gallery
     */

    $('.gallery.masonry', $be).isotope({
      itemSelector: '.gallery-item',
      layoutMode: 'masonry',
    });

    /**
     * Skills
     */

    $('.bars_list', $be).waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function() {

        var el = $(this.element).length ? $(this.element) : $(this);

        el.addClass('hover');

        if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
          this.destroy();
        }
      }

    });

    /**
     * Progress Icons
     */

    $('.progress_icons', $be).waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function() {

        var el = $(this.element).length ? $(this.element) : $(this);
        var active = el.attr('data-active');
        var color = el.attr('data-color');
        var icon = el.find('.progress_icon');
        var timeout = 200; // timeout in milliseconds

        icon.each(function(i) {
          if (i < active) {
            var time = (i + 1) * timeout;
            setTimeout(function() {
              $(icon[i])
                .addClass('themebg')
                .css('background-color', color);
            }, time);
          }
        });

        if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
          this.destroy();
        }
      }

    });

    /**
     * ON | debouncedresize
     */

    $(window).on('debouncedresize', function() {

      // isotope
      $('.masonry', $be).isotope();

    });

  });

  /**
   * $(window).on('load')
   * window.load
   */

  $(window).on('load', function() {

    sliderTestimonials();
    sliderBlog();
    sliderClients();
    sliderOffer();
    sliderOfferThumb();
    sliderPortfolio();
    sliderShop();
    sliderSlider();

    $(window).trigger('debouncedresize');

  });

})(jQuery);
