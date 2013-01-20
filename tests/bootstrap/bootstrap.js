(function($) {

module("bootstrap support", {
    setup: function () {
        this.sinon = sinon.sandbox.create();
    },
    teardown: function () {
        this.sinon.verify();
        this.sinon.restore();
    }
});

test("can create", function() {
    var sinon = this.sinon;
    var SlickGrid = $.fn.slickgrid.Constructor;
    var mock = sinon.mock(SlickGrid.prototype);
    mock.expects('handleCreate').once().returns();
    var wrapper = new SlickGrid('ELEMENT', {});
});

test("accepts handleCreate option", function() {
    var sinon = this.sinon;
    var SlickGrid = $.fn.slickgrid.Constructor;
    var mock = sinon.mock(SlickGrid.prototype, 'handleCreate');
    var handler = sinon.mock().once();
    var wrapper = new SlickGrid('ELEMENT', {
        handleCreate: handler
    });
});

test("default create handler", function() {
    var sinon = this.sinon;
    var SlickGrid = $.fn.slickgrid.Constructor;
    var wrapper = {
        element: 'ELEMENT',
        wrapperOptions: {}
    };
    var grid = {
        onSort: {
            subscribe: sinon.mock()
        },
        render: sinon.mock()
    };
    var DataView = sinon.spy(function () {
        this.beginUpdate = sinon.mock();
        this.setItems = sinon.mock();
        this.endUpdate = sinon.mock();
    });
    window.Slick = {
        Grid: sinon.stub().returns(grid),
        Data: {
            DataView: DataView
        }
    };
          
    SlickGrid.prototype.handleCreate.call(wrapper);

});



})(window.jQuery);
