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

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

Polymer({

  is: 'main-app',

  properties: {

    recipes: Object,

    auth: {
      type: Boolean,
      value: getCookie("username") != "",
      notify: true
    },

    watching: Object,

    _route: Object,

    _subRoute: Object,

    _pageData: {
      type: Object,
      observer: '_pageDataChanged'
    },

    _selectedPage: String,

    _idData: Object,

    _scrollPositionMap: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },

  watch: function(recipe) {
    var newWatching = []
    if (this.watching)
      newWatching = this.watching.slice();
    newWatching.push(recipe);
    this.set('watching', newWatching);
  },

  unwatch: function(recipe) {
    if (!this.watching) return
    var newWatching = this.watching.slice();
    var index;
    for (var i = 0; i < newWatching.length; ++i) {
      var r = newWatching[i];
      if (r.id === recipe.id) {
        index = i;
        break;
      }
    }
    newWatching.splice(index, 1);
    this.set('watching', newWatching);
  },

  attached: function() {
    this.set('_selectedPage', "map");
    this.async(function() {
      if (!this._route.path) {
        this.set('_route.path', '/map');
      }
    });
  },

  logout: function(e) {
    if (e) {
      createCookie("username", "", 1);
      window.location.href = "/";
    }
  },

  _getRecipe: function() {
    if (this.recipes && this._idData && this._idData.id) {
      for (var i = 0; i < this.recipes.length; ++i) {
        var r = this.recipes[i];
        if (r.id === this._idData.id) {
          return r;
        }
      }
    }
    return null;
  },

  _drawerSelected: function() {
    if (!this.$.drawer.persistent) this.$.drawer.close();
  },

  /**
   * Preserves the document scroll position, so
   * it can be restored when returning to a page.
   */
  _pageDataChanged: function(pageData, oldPageData) {
    var map = this._scrollPositionMap;

    if (oldPageData != null && oldPageData.page != null) {
      map[oldPageData.page] = window.pageYOffset;
    }
    this._selectedPage = pageData.page;
    if (map[pageData.page] != null) {
      Polymer.AppLayout.scroll({
        top: map[pageData.page],
        behavior: 'silent'
      });
    } else if (this.isAttached) {
      Polymer.AppLayout.scroll({
        top: 0,
        behavior: 'silent'
      });
    }
  }

});
