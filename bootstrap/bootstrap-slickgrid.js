

!function ($) {

  "use strict"; // jshint ;_;


  function findDefaultOptions(element, options) {
    // Fetch the configuration if we have any.
    // We walk up the DOM from element, and use 
    // the first existing data attribute with the key configName.
    // This will serve as default options, that overrides
    // the static defaults defined by this class.
    var configName = options.configName;
    var config;
    if (configName) {
        var $el = element;
        while ($el.length > 0) {
            config = $el.data(configName);
            if (config) {
                break;
            }
            $el = $el.parent();
        }
    }
    return config || {};
  }


 /* SlickGrid PUBLIC CLASS DEFINITION
  * ================================= */

  var SlickGrid = function ( element, options ) {
    element = $(element);
    // More default options can be added as DOM data attribute
    // allowing a global config, with non-marshallable objects possible in it
    var moreDefaultOptions = findDefaultOptions(element, options);
    var cookedOptions = $.extend(true, {}, 
        $.fn.slickgrid.defaults, moreDefaultOptions, options);
    this.init('slickgrid', element, cookedOptions);
  }


  SlickGrid.prototype = {

    constructor: SlickGrid


  , processColumns: function () {
        var self = this;
        var results = [];
        var options = this.options;
        $.each(this.options.columns, function(index, columnDef) {
            var defaults = {};
            // id defaults to columnDef.field
            defaults.id = columnDef.field;
            // resolve formatter from map
            defaults.formatter = options.formatters[columnDef.formatterName];
            // resolve validator from map
            defaults.validator = options.validators[columnDef.validatorName];
            // resolve editor from map
            defaults.editor = options.editors[columnDef.editorName];
            // store it
            var newColumnDef = $.extend({}, defaults, columnDef);
            results.push(newColumnDef);
        });
        return results;
    }

  , createDataView: function () {
        // Create a data view, if the options.data is not specified.
        if (this.options.dataView !== undefined) {
            this.dataView = this.options.dataView;
        } else {
            this.dataView = new Slick.Data.DataView({inlineFilters: true});
        }
    }
        
  , createGrid: function () {
        this.grid = new Slick.Grid(this.element, this.dataView, this.columns, this.options.slickgridOptions);
    }

  , init: function (type, element, options) {
        var self = this;
        this.element = $(element);
        this.options = options;

        // Resolve non-JSON marshallable functions
        this.columns = this.processColumns();
        // Save original column defs, too.
        this.origColumns = this.columns.slice();

        // Create the data view.
        this.createDataView();
        // Create the grid.
        this.createGrid();
        // Call the provided hook to post-process.
        var handleCreate = this.options.handleCreate;
        if (handleCreate !== undefined) {
            handleCreate.apply(this);
        }
    }

  };


 /* SlickGrid PLUGIN DEFINITION */

  $.fn.slickgrid = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('slickgrid')
        , options = typeof option == 'object' && option
      if (!data) $this.data('slickgrid', (data = new SlickGrid(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.slickgrid.Constructor = SlickGrid;

  $.fn.slickgrid.defaults = {
      slickgridOptions: {},
      columns: [],
      //configName: null     // allows more default options, registered as DOM data with this key. (...)
      formatters: {},
      validators: {},
      editors: {}
      // handleCreate: function() {}; -- This is called after the grid is created,
      //                                 and can be used to customize the grid.
      //                                 The function can access this.grid, this.dataView, ...
      // dataView: null  -- if this is not specified, we will create one
      //                    and store it in this.dataView.
  }

}(window.jQuery);

