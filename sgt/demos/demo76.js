
/*jslint undef: true, newcap: true, nomen: false, white: true, regexp: true */
/*jslint plusplus: false, bitwise: true, maxerr: 50, maxlen: 110, indent: 4 */
/*jslint sub: true */
/*globals window navigator document console */
/*globals setTimeout clearTimeout setInterval */ 
/*globals Slick alert */ 


(function ($) {

    function _safeConvert(obj) {
        var type = $.type(obj);
        if (type == 'object' && $(obj).parent().length > 0) {
            obj = "DOM #" + $(obj).attr('id');
        } else if (type == 'array' || type == 'object') {
            var res;
            if (type == 'array') {
                res = [];
            } else {
                res = {};
            }
            $.each(obj, function (key, value) {
                res[key] = _safeConvert(value);
            });
            obj = res;
        }
        return obj;
    }

    function log() {
        var args = [new Date()];
        var i;
        for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        args = _safeConvert(args);
        var repr = JSON.stringify(args);
        $('#logger').prepend('<code>' + repr + '</code><br>');
    }

    window.log = log;

    function requiredFieldValidator(value) {
        if (value === null || value === undefined || !value.length) {
            return {valid: false, msg: "This is a required field"};
        }
        else {
            return {valid: true, msg: null};
        }
    }


    function locateCell(grid, evt) {
        // There is something strange going on with the event targets here. We would like
        // to get the target (typically a <div class="slick-cell" />), but that does not seem
        // to be correct. Using originalEvent is good though.
        var realEvt = evt.originalEvent || evt;
        var target = $(realEvt.target);
        var res;
        if (target.parent().is('.slick-header-columns')) {
            var column = target.index();
            res = {
                target: target,
                type: 'header',
                column: column
            };
        } else {
            // Find out the row and column of the cell
            var cell = grid.getCellFromEvent(realEvt);
            if (cell !== null) {
                // We are in the canvas.
                res = {
                    target: target,
                    type: 'cell',
                    row: cell.row,
                    column: cell.cell
                };
            } else {
                // We are not in the canvas.
                res = {
                    type: 'outside'
                };
            }
        }
        return res;
    }

    var dataView;
    var grid;
    var data = [];
    var columns = [
        {id: "sel", name: "#", field: "num", behavior: "select",
            cssClass: "cell-selection", width: 40, cannotTriggerInsert: true,
            resizable: false, selectable: false},
        {id: "title", name: "Title", field: "title", width: 120, minWidth: 120,
            cssClass: "cell-title", editor: Slick.Editors.Text,
            validator: requiredFieldValidator, sortable: true},
        {id: "duration", name: "Duration", field: "duration",
            editor: Slick.Editors.Text, sortable: true},
        {id: "start", name: "Start", field: "start", minWidth: 60,
            editor: Slick.Editors.Date, sortable: true},
        {id: "finish", name: "Finish", field: "finish", minWidth: 60,
            editor: Slick.Editors.Date, sortable: true}
    ];

    var i;
    for (i = 0; i < columns.length; i++) {
        // it seems that sortable=false must be used. Otherwise the
        // traditional sorting kicks in and shadows the menu headers.
        // We remove sortable for this reason and add the menu items if needed.
        var sortable = columns[i].sortable;
        columns[i].sortable = false;
        columns[i].optionsbar = [
            {
                cssClass: 'btn btn-inverse',
                label: '<i class="caret upsidedown"></i>',
                command: "sort-asc",
                disabled: ! sortable
            },
            {
                cssClass: 'btn btn-inverse',
                label: '<i class="caret"></i>',
                command: "sort-desc",
                disabled: ! sortable
            },
            {
                cssClass: 'btn btn-inverse',
                label: "Resize",
                command: "resize",
                disabled: true
            }
        ];
    }


    var origColumns = columns.slice();

    var options = {
        editable: false,
        enableAddRow: true,
        enableCellNavigation: true,
        asyncEditorLoading: true,
        forceFitColumns: false,
        enableColumnReorder: false
    };

    var sortcol = "title";
    var sortdir = 1;
    var searchString = "";
    function myFilter(item, args) {
        if (args.searchString !== "" &&
                item["title"].indexOf(args.searchString) == -1) {
            return false;
        }

        return true;
    }


    function comparer(a, b) {
        var x = a[sortcol], y = b[sortcol];
        return (x == y ? 0 : (x > y ? 1 : -1));
    }

    function toggleFilterRow() {
        if ($(grid.getTopPanel()).is(":visible")) {
            grid.hideTopPanel();
        } else {
            grid.showTopPanel();
        }
    }


    //$(".grid-header .ui-icon")
    //    .addClass("ui-state-default ui-corner-all")
    //    .mouseover(function (e) {
    //        $(e.target).addClass("ui-state-hover");
    //    })
    //    .mouseout(function (e) {
    //        $(e.target).removeClass("ui-state-hover");
    //    });

    $(function () {

        // prepare the data
        var i;
        for (i = 0; i < 5000; i++) {
            var d = (data[i] = {});

            d["id"] = "id_" + i;
            d["num"] = i;
            d["title"] = "Task " + i;
            d["duration"] = "5 days";
            d["start"] = "01/01/2009";
            d["finish"] = "01/05/2009";
        }


        dataView = new Slick.Data.DataView({inlineFilters: true});
        grid = new Slick.Grid("#myGrid", dataView, columns, options);
        grid.setSelectionModel(new Slick.RowSelectionModel());

        //var columnpicker = new Slick.Controls.ColumnPicker(
        //        columns, grid, options);


        // move the filter panel defined in a hidden div into grid top panel
        $("#inlineFilterPanel")
            .appendTo(grid.getTopPanel())
            .show();

        grid.onCellChange.subscribe(function (e, args) {
            dataView.updateItem(args.item.id, args.item);
        });

        grid.onAddNewRow.subscribe(function (e, args) {
            var item = {
                "num": data.length, 
                "id": "new_" + (Math.round(Math.random() * 10000)),
                "title": "New task",
                "duration": "1 day",
                "start": "01/01/2009",
                "finish": "01/01/2009"
            };
            $.extend(item, args.item);
            dataView.addItem(item);
        });

        grid.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            var i;
            for (i = 0; i < dataView.getLength(); i++) {
                rows.push(i);
            }

            grid.setSelectedRows(rows);
            e.preventDefault();
        });

        grid.onSort.subscribe(function (e, args) {
            sortdir = args.sortAsc ? 1 : -1;
            sortcol = args.sortCol.field;
            log('onSort', sortdir, sortcol);

            dataView.sort(comparer, args.sortAsc);
        });

        // wire up model events to drive the grid
        dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
        });

        dataView.onRowsChanged.subscribe(function (e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
        });

        var h_runfilters = null;

        function updateFilter() {
            dataView.setFilterArgs({
                searchString: searchString
            });
            dataView.refresh();
        }


        // wire up the search textbox to apply the filter to the model
        $("#txtSearch,#txtSearch2").keyup(function (e) {
            Slick.GlobalEditorLock.cancelCurrentEdit();

            // clear on Esc
            if (e.which == 27) {
                this.value = "";
            }

            searchString = this.value;
            updateFilter();
        });

        $("#btnSelectRows").click(function () {
            if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
                return;
            }

            var rows = [];
            var i;
            for (i = 0; i < 10 && i < dataView.getLength(); i++) {
                rows.push(i);
            }

            grid.setSelectedRows(rows);
        });


        // initialize the model after all the events have been hooked up
        dataView.beginUpdate();
        dataView.setItems(data);
        dataView.setFilterArgs({
            searchString: searchString
        });
        dataView.setFilter(myFilter);
        dataView.endUpdate();

        // autosize first
        grid.autosizeColumns();


        // header menus
        var headerOptionsPlugin = new Slick.Plugins.HeaderOptionsBar({
        });
        // hook up the sorting menu commands into the grid's sorting mechanism.
        headerOptionsPlugin.onCommand.subscribe(function (e, args) {
            if (args.command.substr(0, 5) == 'sort-') {
                var sortAsc = args.command.substr(5) == 'asc';
                args.grid.onSort.notify({
                    grid: args.grid,
                    multiColumnSort: false,
                    sortCol: args.column,
                    sortAsc: sortAsc
                }, e, args.grid);
                // Visually mark the sorted column header with the up / down chevron.
                args.grid.setSortColumns([{columnId: args.column.id, sortAsc: sortAsc}]);
            }
        });
        grid.registerPlugin(headerOptionsPlugin); 


        var $grid = $('#myGrid');
        // Enable event translation for both the canvas (cells), and the headers.
        // It seems the only way to run this is prevent_default = true.
        // But this means that we need to wire all touch events we want.
        $grid.hammer({
            prevent_default: true
        });
        
        // Help debugging by logging all the possible events with the cell information.
        $grid.on('hold tap doubletap transformstart transform transformend' +
                    'dragstart drag dragend swipe release', function (evt) {
            var locate = locateCell(grid, evt);
            if (locate.type == 'header') {
                log('Touch event (header):', evt.type, locate.column);
            } else if (locate.type == 'cell') {
                log('Touch event (cell):', evt.type, locate.row, locate.column);
            } else {
                log('Touch event (outside):', evt.type);
            }
        });

        // Cell button bar

        var $canvas = $grid.find('.grid-canvas');

        $canvas.optionsbar({
            content: [
                {
                    cssClass: 'btn btn-inverse',
                    label: "Edit",
                    command: "edit"
                },
                {
                    cssClass: 'btn btn-inverse',
                    label: "Delete Row",
                    command: "delete-row"
                }
            ]
        });
        var cellOptionsBar = $canvas.data('optionsbar');
        $canvas.on('command.demo76', function (evt, options) {
            // Find out the row and column of the cell
            var realEvt = evt.originalEvent || evt;
            var cell = grid.getCellFromEvent(realEvt);
            log('Cell command:', options.command, cell);
            if (options.command == 'edit') {
                alert('Edit cell!');
            } else if (options.command == 'delete-row') {
                var item = dataView.getItem(cell.row);
                var RowID = item.id;
                dataView.deleteItem(RowID);
                grid.invalidate();
                grid.render();
            }
            
        
        });



        var instance = {};    // hold the state of our event workflow.
        $grid.on({

            transformstart: function (evt) {
                // Find out the row and column of the cell
                var target = evt.originalEvent.target;
                var cell = grid.getCellFromEvent(evt.originalEvent);
                // Let's lock the column for the duration of the entire transform.
                instance.columnIndex = cell.cell;
                var cHeaders = $('#myGrid .slick-header .slick-header-column');
                instance.columnHeader = cHeaders.eq(instance.columnIndex);
                // Start the transform.
                var column = instance.columnHeader;
                instance.oldColor = column.css('color');
                instance.oldWidth = column.width();
                column.css('color', 'red');
                return false;
            },
            transform: function (evt) {
                var scale = evt.scale;
                if (scale === 0) {
                    // why?
                    return false;
                }
                var column = instance.columnHeader;
                column.width(instance.oldWidth * scale);
                return false;
            },
            transformend: function (evt) {
                var scale = evt.scale;
                if (scale === 0) {
                    // why?
                    return false;
                }
                var column = instance.columnHeader;
                var newWidth = instance.oldWidth * scale;
                column.width(newWidth);
                column.css('color', instance.oldColor);
                columns[instance.columnIndex].width = newWidth;
                grid.setColumns(columns);
                grid.autosizeColumns();
                return false;
            },

            doubletap: function (evt) {
                var locate = locateCell(grid, evt);
                if (locate.type == 'cell') {
                    cellOptionsBar.setPositionElement(locate.target, $grid);
                    cellOptionsBar.show();
                }
            }

        });


        // autoresize columns
        var timer;
        $(window).resize(function (evt) {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                var width = $(window).width();
                var wide = (width > 768); // ipad orientation narrow / wide
                // Hide or show the last two columns, based on the layout.
                // XXX this is a little rough... we'd need to be smarter here
                // to conserve our current columns sizes and order.
                if (wide) {
                    if (columns.length < 5) {
                        columns.push(origColumns[3]);
                        columns.push(origColumns[4]);
                    }
                } else {
                    if (columns.length > 3) {
                        columns = origColumns.slice(0, 3);
                    }
                }

                // and resize.
                grid.setColumns(columns);
                grid.autosizeColumns();
                timer = null;
            }, 400);
        });

    });

})(window.jQuery);
