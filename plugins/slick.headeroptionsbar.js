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
      buttonImage: "../images/down.gif"
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

      $(_grid).optionsbar({
            content: function () {
                var $menuButton = $(this);
                var buttons = $menuButton.data('buttons');
                return buttons;
            }
      });
      optionsBar = $(_grid).data('optionsbar');

      // Force the grid to re-render the header now that the events are hooked up.
      _grid.setColumns(_grid.getColumns());

      // Hide the menu on outside click.
      //$(document.body).bind("mousedown", handleBodyMouseDown);


    }


    function destroy() {
      _handler.unsubscribeAll();
      //$(document.body).unbind("mousedown", handleBodyMouseDown);

      optionsBar.destroy();

    }


    function handleBodyMouseDown(e) {
      if ($menu && !$.contains($menu[0], e.target)) {
        hideMenu();
      }
    }


    function hideMenu() {
      if ($menu) {
        $menu.remove();
        $menu = null;
        $activeHeaderColumn
          .removeClass("slick-header-column-active");
      }
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

        $(args.headerNode)
            .hammer({
                prevent_default: true
            });
        $(args.headerNode).on({
            tap: function (evt) {
                return showMenu.call($el[0], evt);
            }
        });
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
      //var columnDef = $menuButton.data("column");
      optionsBar.setElement($menuButton);
      optionsBar.show();

      // Mark the header as active to keep the highlighting.
      $activeHeaderColumn = $menuButton.closest(".slick-header-column");
      $activeHeaderColumn
        .addClass("slick-header-column-active");

    }
    
    
    /*
      // Position the menu.
      // Do not let it go out of the grid area.
      var $header = $menuButton.closest('.slick-header');
      var menuRight = $(this).offset().left + $menu.width();
      var headerRight = $header.offset().left + $header.width();
      var offset = 0;
      if (menuRight > headerRight) {
          offset = headerRight - menuRight;
      }
      $menu
        .css("top", $(this).offset().top + $(this).height())
        .css("left", $(this).offset().left + offset);

    */


    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "showMenu": showMenu,
      "hideMenu": hideMenu,

      "onBeforeMenuShow": new Slick.Event(),
      "onCommand": new Slick.Event()
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
