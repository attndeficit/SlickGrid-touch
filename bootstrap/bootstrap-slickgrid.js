
(function ($) {

    "use strict"; // jshint ;_;

    /*global Slick: true*/

    /* SlickGrid PUBLIC CLASS DEFINITION
     * ================================= */

    var SlickGrid = function ( element, options ) {
        element = $(element);
        var cookedOptions = $.extend(true, {},
            $.fn.slickgrid.defaults, options);
        this.init('slickgrid', element, cookedOptions);
    };

    SlickGrid.prototype = {

        constructor: SlickGrid,

        init: function (type, element, options) {
            var self = this;
            this.element = $(element);
            this.wrapperOptions = options;
            this.postInit();
        },

        postInit: function () {
            // Call the provided hook to post-process.
            var handleCreate = this.wrapperOptions.handleCreate;
            if (handleCreate) {
                handleCreate.apply(this);
            } else {
                this.handleCreate();
            }
        },

        handleCreate: function () {
            // Create a simple grid configuration.
            //
            // This handler will run after the options
            // have been preprocessed. It can be overridden by passing
            // the handleCreate option at creation time.
            //
            // Variables you can access from this handler:
            //
            // this:                  will equal to the SlickGrid object instance
            // this.element:          the element to bind the grid to
            // this.wrapperOptions:   options passed to this object at creation
            //
            var o = this.wrapperOptions;
            var dataView = new Slick.Data.DataView({inlineFilters: true});
            var grid = new Slick.Grid(this.element, dataView,
                o.columns, o.slickgridOptions);

            var sortCol = o.sortCol;
            var sortDir = o.sortDir;
            function comparer(a, b) {
                var x = a[sortCol], y = b[sortCol];
                return (x == y ? 0 : (x > y ? 1 : -1));
            }

            grid.onSort.subscribe(function (e, args) {
                sortDir = args.sortAsc ? 1 : -1;
                sortCol = args.sortCol.field;

                dataView.sort(comparer, args.sortAsc);
            });

            // initialize the model after all the events have been hooked up
            dataView.beginUpdate();
            dataView.setItems(this.wrapperOptions.items);
            dataView.endUpdate();

            grid.render();
        }

    };

    /* SlickGrid PLUGIN DEFINITION */

    $.fn.slickgrid = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('slickgrid'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('slickgrid', (data = new SlickGrid(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.slickgrid.Constructor = SlickGrid;

    $.fn.slickgrid.defaults = {
        slickgridOptions: {},
        columns: [],           // Column meta data in SlickGrid's format.
        sortCol: null,         // the name of the initial sorting column
        sortDir: true,         // sorting direction true = ascending, or false = descending
        handleCreate: null     // This handler is called after the grid is created,
                               // and it can be used to customize the grid.
                    // Variables you can access from this handler:
                    //
                    // this:                  will equal to the SlickGrid object instance
                    // this.element:          the element to bind the grid to
                    // this.wrapperOptions:   options passed to this object at creation
    };

})(window.jQuery);