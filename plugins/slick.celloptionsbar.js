(function ($) {


  /***
   *
   */

  function defer(inner, instance) {
    setTimeout(function () {
        inner();
    }, 10);
  }

  function CellOptionsBar(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
    };

    function init(grid) {
        options = $.extend(true, {}, _defaults, options);
        _grid = grid;
        //_handler
        //  .subscribe(_grid.onHeaderRendered, handleHeaderRendered)
        //  .subscribe(_grid.onBeforeHeaderDestroy, handleBeforeHeaderDestroy);

        // XXX Is there a better way to get the grid's element?
        var $grid = $(_grid.getHeaderRow()).parent().parent();
        var $canvas = $grid.find('.grid-canvas');
        var $viewport = $grid.find('.slick-viewport');

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
        var finishEditBar;
        $canvas.on('command.celloptionsbar', function (evt, options) {
            // Find out the row and column of the cell
            var realEvt = evt.originalEvent || evt;
            var cell = grid.getCellFromEvent(realEvt);
            if (options.command == 'edit') {
                // Set this cell to be the active one. And activate the editor for it.
                grid.setActiveCell(cell.row, cell.cell);
                defer(function () {
                    grid.editActiveCell();
                });
                // Pop up a second toolbar that can be used to cancel the editing.
                finishEditBar.setPositionElement(realEvt.target, $grid);
                finishEditBar.show();

            } else if (options.command == 'delete-row') {
                var dataView = grid.getData();
                var item = dataView.getItem(cell.row);
                var RowID = item.id;
                dataView.deleteItem(RowID);
                grid.invalidate();
                grid.render();
            }
            
        
        });


        // Make sure we have a hammer. One is enough. XXX XXX
        if ($grid.data('hammer') === undefined) {
            $grid.hammer({
                swipe: false,
                drag: false,
                transform: false,
                tap: true,
                tap_double: true,
                hold: false
            });
        }

        var instance = {};    // hold the state of our event workflow.
        $grid.on({

            // Tapping selects the tapped row, and unselects any other row.
            // Tapping a selected row pops the cell options menu buttons,
            // doubletapping has the same effect as selecting and tapping again.
            tap: function (evt) {
                var locate = _self.locateCell(evt);
                if (locate.type == 'cell' && locate.state != 'editing') {
                    // What is the current selection now?
                    var selectedRows = grid.getSelectedRows();
                    var isSameSelection = selectedRows.length == 1 && selectedRows[0] == locate.row;
                    if (isSameSelection) {
                        // If the same row is already selected, then a single tap acts like
                        // a double tap: that is, this is a second tap and doubletap will be in effect.
                        cellOptionsBar.setPositionElement(locate.target, $grid);
                        cellOptionsBar.show();
                    } else {
                        // If we had no selection, or a different selection from this single row in the set:
                        // Then, the current selection is cleared, and a single
                        // row will be selected.
                        selectedRows = [locate.row];
                        grid.setSelectedRows(selectedRows);
                        //
                        // This must cancel the editing too.
                        // save the edited cells
                        if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
                            // ???
                            Slick.GlobalEditorLock.cancelCurrentEdit();
                        }
                    }
                }
            },

            doubletap: function (evt) {
                var locate = locateCell(grid, evt);
                if (locate.type == 'cell' && locate.state != 'editing') {
                    cellOptionsBar.setPositionElement(locate.target, $grid);
                    cellOptionsBar.show();
                }
            }

        });


        // The edit buttons are bound to a separate node then the first (hmmm...)
        $viewport.optionsbar({
            content: [
                {
                    cssClass: 'btn btn-inverse',
                    label: "Cancel",
                    command: "cancel-editing"
                }
            ]
        });
        finishEditBar = $viewport.data('optionsbar');
        $viewport.on('command.celloptionsbar', function (evt, options) {
            // Find out the row and column of the cell
            var realEvt = evt.originalEvent || evt;
            var cell = grid.getCellFromEvent(realEvt);
            if (options.command == 'cancel-editing') {
                Slick.GlobalEditorLock.cancelCurrentEdit();
            }
        });

        grid.onClick.subscribe(function (e, args) {
            // Prevent clicking a cell. This would go to edit which we
            // do not want now.
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        grid.onDblClick.subscribe(function (e, args) {
            // Prevent double clicking a cell. This would go to edit which we
            // do not want now.
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }

    function destroy() {
      _handler.unsubscribeAll();
      // XXX Is there a better way to get the grid's element?
      var $grid = $(_grid.getHeaderRow()).parent().parent();
      var $canvas = $grid.find('.grid-canvas');
      var $viewport = $grid.find('.slick-viewport');
      $canvas.optionsbar('destroy');
      $viewport.optionsbar('destroy');
      $canvas.off('command.celloptionsbar');
      $viewport.off('command.celloptionsbar');
    }

    // Locate which cell was touched, from the touch event.
    // Find a given cell or a given row header.
    function locateCell(evt, /*optional*/ grid) {
        if (grid === undefined) {
            grid = _grid;
        }
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
                var $cell = target.closest('.slick-cell');
                var state = $cell.hasClass('editable') ? 'editing': 'normal';
                res = {
                    target: target,
                    type: 'cell',
                    row: cell.row,
                    column: cell.cell,
                    state: state
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

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      //"onCommand": new Slick.Event(),
      
      "locateCell": locateCell
    });
    
  }

  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "CellOptionsBar": CellOptionsBar
      }
    }
  });


})(jQuery);
