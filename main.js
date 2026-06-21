;(function ($, window, document, undefined) {
  'use strict';

  function dismissPreloader() {
    $('.preloader').fadeOut(600);
  }

  // Dismiss preloader as soon as window loads
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    $(window).on('load', dismissPreloader);
    // Safety fallback: always dismiss after 2s regardless
    setTimeout(dismissPreloader, 2000);
  }

  $(document).ready(function () {

    // ── Hamburger (mobile navigation) ─────────────────────────
    $('#hamburger').on('click', function () {
      $('#navigation').toggleClass('open');
    });

    // Close mobile nav when a link is clicked
    $('.nav-menu a').on('click', function () {
      $('#navigation').removeClass('open');
    });

    // ── FullPage.js Initialization ────────────────────────────
    if ($('.fullpage-default').length) {
      new fullpage('.fullpage-default', {
        licenseKey: 'OPEN-SOURCE-GPLv3-LICENSE', // Open source fallback
        anchors: ['homepage', 'about', 'skills', 'experience', 'projects', 'publications', 'certifications', 'achievements', 'contact'],
        menu: '#nav',
        navigation: true, // Enables right dots navigation
        navigationPosition: 'right',
        scrollOverflow: true,
        responsiveWidth: 768,
        responsiveHeight: 500,
        lazyLoading: true,
        afterResponsive: function(isResponsive) {
          // Additional handling when switching between desktop/mobile if needed
        }
      });
    }

    // ── "Hire Me" Button Custom Trigger ────────────────────────
    $(document).on('click', '#hire-me-btn', function (e) {
      e.preventDefault();
      if (typeof fullpage_api !== 'undefined') {
        fullpage_api.moveTo('contact');
      } else {
        // Fallback for responsive mode where fullpage is disabled
        var target = $('#contact');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - 70
          }, 800);
        }
      }
    });

    // ── Scroll Animation logic with jquery.inview ─────────────
    $('.animated-row').each(function () {
      $(this).find('.animate').each(function (index) {
        var $item = $(this);
        var animation = $item.data('animate');
        
        $item.on('inview', function (event, isInView) {
          if (isInView) {
            setTimeout(function () {
              $item.addClass('animated ' + animation).removeClass('animate');
            }, index * 100); // 100ms staggered delay
          }
        });
      });
    });

    // ── Hover Light Tracking (Mousemove details for glassmorphic cards) ──────
    $('.project-card, .timeline-card, .publication-card, .skill-category, .contact-detail, .contact-form-box').on('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      this.style.setProperty('--mouse-x', x + 'px');
      this.style.setProperty('--mouse-y', y + 'px');
    });

    // ── Global Mouse Spotlight for Grid ──────────────────────
    $(window).on('mousemove', function (e) {
      document.documentElement.style.setProperty('--window-mouse-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--window-mouse-y', e.clientY + 'px');
    });

  });

})(jQuery, window, document);
