(function ($) {


  /***
   * A plugin to add drop-down menus to column headers.
   *
   * USAGE:
   *
   * Add the plugin .js & .css files and register it with the grid.
   *
   * To specify a menu in a column header, extend the column definition like so:
   *
   *   var columns = [
   *     {
   *       id: 'myColumn',
   *       name: 'My column',
   *
   *       // This is the relevant part
   *       header: {
   *          menu: {
   *              items: [
   *                {
   *                  // menu item options
   *                },
   *                {
   *                  // menu item options
   *                }
   *              ]
   *          }
   *       }
   *     }
   *   ];
   *
   *
   * Available menu options:
   *    tooltip:      Menu button tooltip.
   *
   *
   * Available menu item options:
   *    title:        Menu item text.
   *    disabled:     Whether the item is disabled.
   *    tooltip:      Item tooltip.
   *    command:      A command identifier to be passed to the onCommand event handlers.
   *    iconCssClass: A CSS class to be added to the menu item icon.
   *    iconImage:    A url to the icon image.
   *
   *
   * The plugin exposes the following events:
   *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
   *        Event args:
   *            grid:     Reference to the grid.
   *            column:   Column definition.
   *            menu:     Menu options.  Note that you can change the menu items here.
   *
   *    onCommand:    Fired on menu item click for buttons with 'command' specified.
   *        Event args:
   *            grid:     Reference to the grid.
   *            column:   Column definition.
   *            command:  Button command identified.
   *            button:   Button options.  Note that you can change the button options in your
   *                      event handler, and the column header will be automatically updated to
   *                      reflect them.  This is useful if you want to implement something like a
   *                      toggle button.
   *
   *
   * @param options {Object} Options:
   *    buttonCssClass:   an extra CSS class to add to the menu button
   *    buttonImage:      a url to the menu button image (default '../images/down.gif')
   * @class Slick.Plugins.HeaderButtons
   * @constructor
   */


  function HeaderOptionsBar(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
      buttonCssClass: null,
      buttonImage: "../../images/down.gif"
    };
    var $menu;
    var $activeHeaderColumn;
    var optionsBar;

    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _handler
        .subscribe(_grid.onHeaderRendered, handleHeaderRendered)
        .subscribe(_grid.onBeforeHeaderDestroy, handleBeforeHeaderDestroy);

      // XXX Is there a better way to get the grid's element?
      var $grid = $(_grid.getHeaderRow()).parent().parent();
      var $header = $grid.find('.slick-header');

      $header.optionsbar({
            content: function () {
                var $menuButton = $(this);
                var buttons = $menuButton.data('buttons');
                return buttons;
            }
      });
      optionsBar = $header.data('optionsbar');

      $header.on('command.headeroptionsbar', $.proxy(handleCommand, this));
      $header.on('hidemenu.headeroptionsbar', $.proxy(handleHideMenu, this));
      $header.on('showmenu.headeroptionsbar', $.proxy(handleShowMenu, this));

      // Force the grid to re-render the header now that the events are hooked up.
      _grid.setColumns(_grid.getColumns());

    }

    function destroy() {
      _handler.unsubscribeAll();
      optionsBar.destroy();
      // XXX Is there a better way to get the grid's element?
      var $grid = $(_grid.getHeaderRow()).parent().parent();
      var $header = $grid.find('.slick-header');
      $header.off('command.headeroptionsbar');
      $header.off('hidemenu.headeroptionsbar');
      $header.off('showmenu.headeroptionsbar');
    }

    function handleCommand(evt, options) {
        var target = $(evt.target);
        var columnDef = target.find('.slick-header-menubutton').data("column");

        _self.onCommand.notify({
            "grid": _grid,
            "column": columnDef,
            "command": options.command
        }, evt, _self);
    }

    function handleHideMenu(evt, options) {
      // Remove markup if the menu is hidden.
      options.positionElement
        .removeClass("slick-header-column-resizing");
    }

    function handleShowMenu(evt, options) {
        var target = $(evt.target);
        var button = target.find('.slick-header-menubutton');
        var columnDef = button.data("column");

        _self.onMenuShow.notify({
            "grid": _grid,
            "column": columnDef
        }, evt, _self);
      
        $activeHeaderColumn
            .addClass("slick-header-column-resizing");
    }

    function handleHeaderRendered(e, args) {
      var column = args.column;
      var buttons = column.optionsbar;
      if (buttons && buttons.length > 0) {
        var $el = $("<div></div>")
          .addClass("slick-header-menubutton")
          .data("column", column)
          .data("buttons", buttons);
        if (options.buttonCssClass) {
          $el.addClass(options.buttonCssClass);
        }
        if (options.buttonImage) {
          $el.css("background-image", "url(" + options.buttonImage + ")");
        }
        $el
          .appendTo(args.headerNode);

        var instance = {};  // to store the state for the dnd
        var headerNode = $(args.headerNode);
        headerNode
            .hammer({
                prevent_default: true
            });
        headerNode.on({

            tap: function (evt) {
                showMenu.call($el[0], evt);
            },

            // Drag the handle in the header to resize a column.

            //dragstart: function (evt) {
                // XXX Why is there no dragstart? Hammer.js problem, or?
                // XXX Beh, anyway...
            //},

            drag: function (evt) {
                var offset = evt.pageX || evt.originalEvent.pageX;
                instance.currentOffset = offset;

                // need to do this because the dragstart event is borken.
                if (! instance.isDragging) {
                    // poor man's dragstart
                    instance.offset = offset;
                    instance.width = $activeHeaderColumn.width();
                    var columnDef = $activeHeaderColumn.data('column');
                    // Calculate a limiting Min Width, use the column's
                    // desired minWidth (if specified), and also limit
                    // with the minimum of the button handle's width.
                    var minWidth = columnDef.minWidth || 0;
                    instance.minWidth = Math.max($el.width(), minWidth); 
                    instance.maxWidth = columnDef.maxWidth;
                    instance.isDragging = true;
                }

                var oldLeft = instance.offset;
                var diff = offset - oldLeft;
                var oldWidth = instance.width;
                var newWidth = oldWidth + diff;
                newWidth = Math.max(newWidth, instance.minWidth);
                if (instance.maxWidth !== undefined) {
                    newWidth = Math.min(newWidth, instance.maxWidth);
                }

                headerNode.width(newWidth);
            },

            dragend: function (evt) {
                instance.isDragging = false;

                // XXX for some reason the offset is missing here...
                // so, we will use the last good one from the drag event.
                //var offset = evt.pageX || evt.originalEvent.pageX;
                var offset = instance.currentOffset;

                var oldLeft = instance.offset;
                var diff = offset - oldLeft;
                var oldWidth = instance.width;
                var newWidth = oldWidth + diff;
                newWidth = Math.max(newWidth, instance.minWidth);
                if (instance.maxWidth !== undefined) {
                    newWidth = Math.min(newWidth, instance.maxWidth);
                }


                var columns = _grid.getColumns(columns);
                var columnIndex = headerNode.index();
                columns[columnIndex].width = newWidth;
                headerNode.width(newWidth);
                log(columnIndex, offset, newWidth);
                _grid.setColumns(columns);
                ////_grid.autosizeColumns();

                // close the menu too
                // XXX Is there a better way to get the grid's element?
                var $grid = $(_grid.getHeaderRow()).parent().parent();
                var $header = $grid.find('.slick-header');
                $header.optionsbar('hide');
            }

        });

        // needed to enable visual sorting directions
        headerNode.append('<span class="slick-sort-indicator"></span>');

      }
    }


    function handleBeforeHeaderDestroy(e, args) {
      var column = args.column;

      if (column.header && column.header.menu) {
        $(args.headerNode).find(".slick-header-menubutton").remove();
      }
    }


    function showMenu(e) {
      var $menuButton = $(this);
      $activeHeaderColumn = $menuButton.closest(".slick-header-column");
      // XXX Is there a better way to get the grid's element?
      var $grid = $(_grid.getHeaderRow()).parent().parent();

      optionsBar.setPositionElement($activeHeaderColumn, $grid);
      optionsBar.show(e);

    }
    
    
    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "showMenu": showMenu,

      "onCommand": new Slick.Event(),
      "onMenuShow": new Slick.Event()
    });
    
  }

  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "HeaderOptionsBar": HeaderOptionsBar
      }
    }
  });


})(jQuery);
