function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

Polymer({

  is: 'login-app',

  properties: {
    username: {
      type: String,
      notify: true,
      readonly: false
    },
    password: {
      type: String,
      notify: true,
      readonly: false
    }
  },

  login: function(e) {
    if (this.$.usernameInput.value == "admin" &&
      this.$.passwordInput.value == "password") {
      createCookie("username", this.$.usernameInput.value, 1);
      window.location.href = "/";
    } else alert("Incorrect username or password!");
  },

  ready: function(e) {
    $("body").css("background-color", "#212121");


    $('input').blur(function() {
      var $this = $(this);
      if ($this.val())
        $this.addClass('used');
      else
        $this.removeClass('used');
    });

    var $ripples = $('.ripples');

    $ripples.on('click.Ripples', function(e) {

      var $this = $(this);
      var $offset = $this.parent().offset();
      var $circle = $this.find('.ripplesCircle');

      var x = e.pageX - $offset.left;
      var y = e.pageY - $offset.top;

      $circle.css({
        top: y + 'px',
        left: x + 'px'
      });

      $this.addClass('is-active');

    });

    $ripples.on(
      'animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd',
      function(e) {
        $(this).removeClass('is-active');
      });
  }
});
