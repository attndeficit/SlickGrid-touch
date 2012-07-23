var grid;
var data = [];
var columns = [
    {
        id: "name",
        name: "Name",
        field: "name",
        width: 500
    }
];

var options = {
    enableCellNavigation: false,
    forceFitColumns: true,
    autoEdit: false
};


$(function () {
    // prepare the data
    for (var i = 0; i < 500; i++) {
        var d = (data[i] = {});

        d["id"] = "id_" + i;
        d["name"] = "Task " + i;
    }

    grid = new Slick.Grid("#myGrid", data, columns, options);
});