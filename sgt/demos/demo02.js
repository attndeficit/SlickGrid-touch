var dataView;
var grid;
var data = [];

var columns = [
    {id:"title", name:"Title", field:"title"},
    {id:"duration", name:"Duration", field:"duration"}
];

var options = {
    asyncEditorLoading: true,
    forceFitColumns: false
};

$(function() {
    // prepare the data
    for (var i = 0; i < 500; i++) {
        var d = (data[i] = {});

        d["id"] = "id_" + i;
        d["title"] = "Task " + i;
        d["duration"] = "5 days";
    }

    dataView = new Slick.Data.DataView();
    grid = new Slick.Grid("#myGrid", dataView, columns, options);

    // initialize the model after all the events have been hooked up
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();
    grid.render();

    $("#myGrid").show();

});
