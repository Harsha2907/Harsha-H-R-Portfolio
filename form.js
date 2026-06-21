(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-messages');
  var submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  // Mirror email into hidden _replyto field so Formspree replies go to sender
  var emailField = document.getElementById('email');
  var replyTo = document.getElementById('reply-to-field');
  if (emailField && replyTo) {
    emailField.addEventListener('input', function () {
      replyTo.value = emailField.value;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Disable button during submit
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
    }

    var formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(function (response) {
      if (response.ok) {
        status.innerHTML = 'Success! Your message has been sent. Thank you.';
        status.className = 'form-status success';
        form.reset();
      } else {
        response.json().then(function (data) {
          if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
            status.innerHTML = data['errors'].map(function (error) {
              return error['message'];
            }).join(', ');
          } else {
            status.innerHTML = 'Oops! There was a problem submitting your form.';
          }
          status.className = 'form-status error';
        });
      }
    })
    .catch(function (error) {
      status.innerHTML = 'Oops! An error occurred. Please check your connection and try again.';
      status.className = 'form-status error';
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &nbsp;<i class="fa fa-paper-plane"></i>';
      }
      
      // Auto-hide messages after 6 seconds
      setTimeout(function() {
        status.innerHTML = '';
        status.className = 'form-status';
      }, 6000);
    });
  });

})();
