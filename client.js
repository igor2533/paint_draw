
let socket = io();
let brushSize = 5;
let currentColor = '#000000';
let batch = [];
let canvas = new fabric.Canvas('paper');
let line, triangle, origX, origY, isFreeDrawing = true;
let isRectActive = false, isCircleActive = false, isArrowActive = false, activeColor = '#000000';
let isLoadedFromJson = false;
let $canvas = $("#paper");
let w, h;
w = 1200;
h = 600;
$("#select").click(function(){
    canvas.isDrawingMode = false;
});
$("#draw").click(function(){
    canvas.isDrawingMode = true;
});
$("#delete").click(function(){
    canvas.isDrawingMode = false;
    deleteObjects();
});

$("#clear").click(function(){
  canvas.clear();
});
function initCanvas(canvas) {
console.log('process init');
  let aux = canvas;
    let json = aux.toJSON();
    let data = {
        w: w,
        h: h,
        data: json
    };
    socket.emit('drawing', data);
}
socket.on('addClientText', function(){
canvas.isDrawingMode = false;
date = new Date();
myid = date.getMilliseconds();
      var text = new fabric.IText('To do! I will learn js', { 
  left: 40, 
  top: 50,
  id: myid,
  fill:"#FFFFFF",
  backgroundColor:"#cf9c1d",
});
text.hasRotatingPoint = true;
canvas.add(text).setActiveObject(text);
})




socket.on('addClientSimpleText', function(){
  canvas.isDrawingMode = false;
  date = new Date();
  myid = date.getMilliseconds();
        var text = new fabric.IText('Simple Text', { 
    left: 40, 
    top: 50,
    fontSize:24,
    id: myid,
    fill:"#000000",

  });
  text.hasRotatingPoint = true;
  canvas.add(text).setActiveObject(text);
  })









function addT(){
batch = [];
  socket.emit('addServerText');

}

function addText(){
  batch = [];
    socket.emit('addServerSimpleText');
  
  }


function deleteObjects(){
	var activeObject = canvas.getActiveObject();
    //activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        if (confirm('Are you sure?')) {
            canvas.remove(activeObject);
        }
    }
  
}
canvas.on({
 'object:moved': function(i) {
var pointer = canvas.getPointer(event.e);
  var posX = pointer.x;
  var posY = pointer.y;
    myid = canvas.getActiveObject().get('id');
  let segments = [x1 =  posX,  y1 = posY, id = myid];
 socket.emit('moveTextServer',segments);
  },
  'text:changed': function(e) {
    myid = canvas.getActiveObject().get('id');
let segments = [id =  myid,  text = e.target.text];
 socket.emit('editTextServer',segments);
 console.log('changed', e.target.text);
  },
   'object:added': function(i) {
 if(canvas.isDrawingMode == true){
      console.log('dragging');
}
   }
 
});
socket.on('new_user', function(data){
 emitEvent();
    console.log('new client');
 })	
socket.on('moveTextClient', function(data){
      let segments = data;
    console.log(segments[0]+" ___"+segments[1]+"__"+segments[2]);
      canvas.forEachObject(function(obj) {
    if (obj.id && obj.id === segments[2]) {
        obj.set({left:segments[0],top:segments[1]});
    canvas.renderAll();
       }
});
})
socket.on('editTextClient', function(data){
      let segments = data;
    console.log("Text updated on: "+segments[1]+" id: "+segments[0]);
      canvas.forEachObject(function(obj) {
    if (obj.id && obj.id === segments[0]) {
        obj.set({text:segments[1]});
    canvas.renderAll();
      }
});
})








// setInterval(emitEvent, 120);

function emitEvent() {
    let aux = canvas;
    let json = aux.toJSON();
    let data = {
        w: w,
        h: h,
        data: json
    };
    socket.emit('drawing', data);
}





   

    //canvas events

    canvas.on('after:render', function() {

        if (! isLoadedFromJson) {
            emitEvent();
        }
        isLoadedFromJson = false;
        console.log(canvas.toJSON());
    });
socket.on('drawing', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        let ratio = w / obj.w;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
        });

        canvas.loadFromJSON(obj.data);
    });





