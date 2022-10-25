/**
 * Typewriter
 */

jQuery(document).ready(function($) {

  var instance1 = document.getElementById('typewriter-main-slider');

  var instance1 = new Typewriter(instance1, {
    loop: true,
    delay: 50
  });

  instance1.typeString('Website')
    .pauseFor(4000)
    .deleteChars(7)
    .typeString('Visual')
    .pauseFor(2000)
    .deleteChars(6)
    .typeString('Live')
    .pauseFor(2000)
    .start();

  // ---

  var instance2 = document.getElementById('typewriter-muffin-builder-heading');

  var instance2 = new Typewriter(instance2, {
    loop: true,
    delay: 50
  });

  instance2.typeString('Smart way to build any website in no time')
    .pauseFor(3000)
    .deleteChars(10)
    .typeString('easily')
    .pauseFor(3000)
    .deleteAll()
    .typeString('Design whatever you want, the way you like')
    .pauseFor(3000)
    .start();

    // ---

    var instance3 = document.getElementById('typewriter-main-slogan');

    var instance3 = new Typewriter(instance3, {
      loop: true,
      delay: 50
    });

    instance3.typeString('Work smarter.')
      .pauseFor(3000)
      .deleteAll()
      .typeString('Create better.')
      .pauseFor(3000)
      .deleteAll()
      .typeString('Build faster.')
      .pauseFor(3000)
      .start();

      // ---

      var instance4 = document.getElementById('typewriter-muffin-options-heading');

      var instance4 = new Typewriter(instance4, {
        loop: true,
        delay: 50
      });

      instance4.typeString('Powerful')
        .pauseFor(3000)
        .deleteAll()
        .typeString('Limitless')
        .pauseFor(3000)
        .deleteAll()
        .typeString('The ultimate')
        .pauseFor(3000)
        .start();

    // Form on websites
    $("form").submit(function (event) {

      $(".form-group").removeClass("has-error");
      $(".help-block").remove();

      var formData = {
        message: $("#message").val(),
        sent: true,
      };

      $.ajax({

        type: "POST",
        url: "/betheme/templates/parts/websites-form.php",
        data: formData,
        dataType: "json",
        // encode: true,

      }).done(function (data) {

        console.log(data);

        if (!data.success) {

          if (data.errors.message) {
            $("#message-group").addClass("has-error");
            $("#message-group").append(
              '<div class="help-block">' + data.errors.message + "</div>"
            );
          }

        } else {

          $("form").html(
            '<div class="alert alert-success">' + data.message + "</div>"
          );

        }

      })
      .fail(function (data) {
        $("form").html(
          '<div class="alert alert-danger">Could not reach server, please try again later.</div>'
        );
      });

      event.preventDefault();
    });

    //expand testimonials

    $('.expand-testimonials').on('click', function(e) {
      e.preventDefault();
      $("#testimonials-list .testimonials-list-items .hide").removeClass("hide");
      $(this).remove();
    });

    // add "copy to clipboard" to each <pre>

    $('pre').each(function(){
      $(this).wrap('<div class="pre-with-copy"></div>');
      $(this).after('<a href="#" class="copyButton"><i class="far fa-copy"></i></a>');
    });

    $('body').on('click', '.copyButton', function(e){
      e.preventDefault();

      var $button = $(this);
      var $parent = $(this).closest('.pre-with-copy');
      var $pre = $('pre', $parent);

      var val = $pre.html();
      val = val.replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();

      const textArea = document.createElement('textarea');
      textArea.textContent = val;
      document.body.append(textArea);
      textArea.select();
      document.execCommand("Copy", false, null);
      textArea.remove();

      var text = $(this).text();

      $button.text('Copied');

      setTimeout(function() {
        $button.text(text);
        $button.html('<i class="far fa-copy"></i>');
      }, 1000);

    });

});
