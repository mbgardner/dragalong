if (Meteor.isClient) {
  var layer;

  Template.canvas.rendered = function () {
    var stage = new Kinetic.Stage({
      container: 'myCanvas',
      width: 578,
      height: 363
    });

    layer = new Kinetic.Layer();
    stage.add(layer);
  }

  Meteor.autosubscribe(function () {
    // clear the canvas
    if (layer) {
      layer.removeChildren();
      layer.clear();
    }
    // populate the canvas with the Shapes collection
    Shapes.find().forEach(function (dbShape) {
      var shape = new Kinetic.RegularPolygon(dbShape);
      // setup the drag event
      shape.on('dragmove', function () {
        // update the shape's record
        Shapes.update(dbShape._id, {$set: {x: shape.attrs.x, y: shape.attrs.y}});
      });
      layer.add(shape);
      layer.draw();
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // populate the Shapes collection
    Shapes.remove({}); // comment this line out to persist the same 10 shapes
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    for(var n = Shapes.find().count(); n < 10; n++) {
      Shapes.insert({
        x: Math.random() * 578,
        y: Math.random() * 363,
        sides: Math.ceil(Math.random() * 5 + 3),
        radius: Math.random() * 100 + 20,
        fill: colors[Math.round(Math.random() * 5)],
        stroke: 'black',
        opacity: Math.random(),
        strokeWidth: 4,
        draggable: true
      });
    }
  });
}