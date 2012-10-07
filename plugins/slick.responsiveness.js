(function ($) {

  /***
   *
   */

  function Responsiveness(options) {
    var _grid;
    var _self = this;
    var _defaults = {
        delay: 400         // delay of processing in ms
    };
    var _options;
    var _timer;

    function init(grid) {
        _options = $.extend(true, {}, _defaults, options);
        _grid = grid;
        $(window).on('resize.responsiveness', handleResize);
    }

    function destroy() {
        $(window).off('resize.responsiveness');
        clearTimeout(_timer);
    }

    function handleResize(evt) {
        if (_timer !== null) {
            clearTimeout(_timer);
        }
        _timer = setTimeout(timeoutResize, _options.delay);
    }

    function timeoutResize() {
        var width = $(window).width();

        // Let the caller do something, like hide and show columns.
        _self.onResize.notify({
            "grid": _grid,
            "width": width
        }, null, _self);

        // and resize.
        _grid.autosizeColumns();
        timer = null;

    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onResize": new Slick.Event()
    });
    
  }

  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "Responsiveness": Responsiveness
      }
    }
  });

})(jQuery);
