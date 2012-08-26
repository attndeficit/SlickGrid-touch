

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
        this.$positionElement = null;
        this.$boundingElement = null;
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
                // We also hide the options bar.
                self.hide();
                // And trigger the execution of the command.
                var el = self.getPositionElement();
                el.trigger('command', [{
                    command: command
                }]);
            }
            return false;
        }
    }

  , hide: function () {
        $.fn.tooltip.Constructor.prototype.hide.call(this);
        var el = this.getPositionElement();
        el.trigger('hidemenu', [{
            positionElement: el
        }]);
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
      var content = this.getContent();
      return content && content.length > 0;
    }

  , getContent: function () {
      var content
        , $e = this.getPositionElement().find('.slick-header-menubutton')
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

  , setPositionElement: function (el, /*optional*/ bounding) {
      this.$positionElement = $(el);
      // optionally, a bounding element can be specified.
      this.$boundingElement = $(bounding);
    }

  , getPositionElement: function () {
      return this.$positionElement || this.$element;
    }

  , getPosition: function (inside) {
      var el = this.getPositionElement();
      return $.extend({}, (inside ? {top: 0, left: 0} : el.offset()), {
        width: el[0].offsetWidth
      , height: el[0].offsetHeight
      })
    }

 , show: function () {
     // Override from tooltips, for a better positioning
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        // This is why we forked this method: make sure that the popup will fit.
        // Only horizontal fitting is done here!
        var offset = 0;
        var tipWidth = $tip.width();
        if (this.$boundingElement && this.$boundingElement.length > 0) {
            var left = this.$boundingElement.offset().left;
            var width = this.$boundingElement.width(); 
            if (tp.left < left) {
                offset = left - tp.left;
            } else if (tp.left + tipWidth > left + width) {
                console.log(tp.left, tipWidth, left, width);
                offset = left + width - tp.left - tipWidth;
                console.log(offset);
            }
            
            tp.left += offset;
            // position the tip in case of fitting changed the position.
            // Normally this would be on left: 50%;
            var arrow = $tip.find('.arrow');
            arrow.css('left', '' +  (tipWidth / 2 - offset) + 'px');
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in');

     }
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
