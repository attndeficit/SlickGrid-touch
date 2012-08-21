

!function ($) {

  "use strict"; // jshint ;_;


 /* OptionsBar PUBLIC CLASS DEFINITION
  * =============================== */

  var OptionsBar = function ( element, options ) {
    this.init('optionsbar', element, options)
  }


  /* NOTE: OptionsBar EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  OptionsBar.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: OptionsBar

  , init: function (type, element, options) {
        var self = this;
        $.fn.tooltip.Constructor.prototype.init.call(this, type, element, options);
        $('body')
            .hammer({
                prevent_default: true
            });
        $('body').on('tap', $.proxy(this.handleTap, this));       
    }

  , handleTap: function (evt) {
        var self = this;
        var realEvt = evt.originalEvent || evt;
        var target = $(realEvt.target);
        var tappedInside = this.tip().has(target).length > 0;
        if (! tappedInside) {
            self.hide();
        } else {
            // Let's find the command that needs to execute.
            if (target.is('button')) {
                var command = target.data('command');
                this.$element.trigger('command', [{
                    command: command
                }]);
                // We also hide the options bar.
                self.hide();
            }
            return false;
        }
    }

  , setContent: function () {
      var $tip = this.tip()
        , content = this.getContent()

      ;

      var inner = $tip.find('.optionsbar-inner');
      var defaults = {
          label: '',
          cssClass: 'btn'
      };
      
      inner.empty();
      $.each(content, function (index, value) {
          value = $.extend(true, {}, defaults, value); 
          $('<button></button>')
            .text(value.label)
            .attr('class', value.cssClass)
            .attr('disabled', value.disabled)
            .attr('data-command', value.command)
            .appendTo(inner);
      });

            //.bind('click', $.proxy(this.handleButtonTap, this))
      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , setElement: function (el) {
      this.$element = $(el);
    }

  })


 /* OptionsBar PLUGIN DEFINITION
  * ======================= */

  $.fn.optionsbar = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('optionsbar')
        , options = typeof option == 'object' && option
      if (!data) $this.data('optionsbar', (data = new OptionsBar(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.optionsbar.Constructor = OptionsBar

  $.fn.optionsbar.defaults = $.extend({} , $.fn.tooltip.defaults, {
    trigger: 'manual'
  , placement: 'bottom'
  , content: []
  , template: '<div class="optionsbar"><div class="arrow"></div><div class="optionsbar-inner btn-group"></div></div>'
  })

}(window.jQuery);
