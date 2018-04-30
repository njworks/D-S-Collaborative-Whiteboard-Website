var rect;       //Rectangles
var circle;     //Circle
var triangle;   //Triangle
var text;       //text
var note;       //sticky note
var socket = io();

var fill = false;
var stroke = true;


var saves;
var user;

/*
-Description : Sets up fabric.js on HTML canvas and start socket.io to
 send and retrieve canvas data and chat messages.
*/
function start() {
    var c = document.querySelector('canvas');
    c.height = window.innerHeight - 100;
    c.width = window.innerWidth - 100;

    canvas = new fabric.Canvas('canvas');

    var bg = new fabric.Rect({width: canvas.width, height: canvas.height, fill: '', selectable: false});
    // bg.fill = new fabric.Pattern({source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAASElEQVQ4y2NkYGD4z0A6+M3AwMBKrGJWBgYGZiibEQ0zIInDaCaoelYyHYcX/GeitomjBo4aOGrgQBj4b7RwGFwGsjAwMDAAAD2/BjgezgsZAAAAAElFTkSuQmCC'},
    bg.fill = new fabric.Pattern({source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAVklEQVR42mNgGAWUg1kPn1bOfPDswawHz17OfPD02IxHz+yI1jzz/rOXQI3/YRhowH7ibX7w7A+yZhAmRfMFNJvPE6/58TPPmQgDLkx99Nx0NCVQAQAA/BRP9JpR3cUAAAAASUVORK5CYII='},
        function () {
            bg.dirty = true;
        });
    canvas.add(bg);

    canvas.isDrawingMode = true;
    canvas.isTouchSupported = true;

    /*
    -Description : Receives JSON data of whiteboard and is loaded to canvas.
    */
    socket.on('draw', function (json) {
        // canvas.clear();
        canvas.loadFromJSON(json, function() {
            canvas.renderAll();
        });
    });

    // socket.on('draw', function (canvasobj) {
    //     var current = JSON.stringify(canvas);
    //     console.log("socket " + canvasobj)
    //     // console.log("client " + current.length)
    //     // console.log("if " + (canvasobj.length != current.length))
    //     // if (canvasobj.length === 0){}else {
    //     // if ((canvasobj.length != current.length) && (canvasobj.length > current.length)) {
    //     // if ((canvasobj.length != current.length)) {
    //     // try {
    //     // console.log(canvasobj)
    //     // canvas.clear();
    //     canvas.loadFromJSON(canvasobj, canvas.renderAll.bind(canvas));
    //     // canvas.loadFromJSON(canvasobj);
    //     // canvas.renderAll();
    //     // } catch (err) {
    //     //     console.log(err)
    //     // }
    //     // }
    //     // console.log(canvasobj)
    // });

    /*
    -Description : Send JSON of canvas to server
    */
    canvas.on('mouse:up', function () {
        //     var canvasStr = JSON.stringify(canvas);
        saves = JSON.stringify(canvas);
        socket.emit('draw', saves);
    });

    /*
    -Description : Send JSON of canvas to server
    */
    canvas.on('mouse:move', function () {
        saves = JSON.stringify(canvas);
        socket.emit('draw', saves);
    });

    /*
    -Description : Receive text message and add to list
    */
    socket.on('chat message', function (msg) {
        var line = document.createElement("li");
        document.getElementById('messages').appendChild(line);
        line.innerHTML = msg;
    })
}
/*
-Description : Creates the URL for sharing the whiteboard.
*/
function share() {
    var creator = document.getElementById('p2').innerHTML;
    var id = document.getElementById('p3').innerHTML;

    if (creator === 'true') {
        prompt("Copy the URL and Share it", "http://localhost:3000/share/" + id)
    }
}

/*
-Description : Show and close video sidebar.
*/
function videosideOpen() {
    document.getElementById("showURLs").style.display = "none";
    document.getElementById("showVideos").style.display = "block";
}
function videosideClose() {
    document.getElementById("showVideos").style.display = "none";
}

/*
-Description : Show and close URL sidebar.
*/
function urlsideOpen() {
    document.getElementById("showVideos").style.display = "none";
    document.getElementById("showURLs").style.display = "block";
}
function urlsideClose() {
    document.getElementById("showURLs").style.display = "none";
}

/*
-Description : Key press to activate keyboard presses.
*/
var keyHold = [];
window.onkeyup = function (ev) {
    var key = ev.key || ev.which || ev.keyCode;
    if (key === "Shift") {
        keyHold[0] = "Shift"
    }
    if ((keyHold.length === 1) && (key !== "Shift")) {
        keyHold.push(key);
    }

    if ((keyHold[0] === "Shift") && (keyHold[1] === "p" || keyHold[1] === "p")) {
        pencil();
        keyHold = [];
    }
    if ((keyHold[0] === "Shift") && (keyHold[1] === "S" || keyHold[1] === "s")) {
        addRectangle();
        keyHold = [];
    }
    if ((keyHold[0] === "Shift") && (keyHold[1] === "C" || keyHold[1] === "c")) {
        addCircle();
        keyHold = [];
    }
    if ((keyHold[0] === "Shift") && (keyHold[1] === "T" || keyHold[1] === "t")) {
        addText();
        keyHold = [];
    }
    if (keyHold.length == 2) {
        keyHold = [];
    }
};
/*
-Description : Hide or show chat box.
*/
function hideshowChat() {
    var div = document.getElementById('chatbox');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
}

/*
-Description : Adding new text chat to the chat box.
*/
function chat(value) {
    user = document.getElementById("p1").innerHTML;
    if (value === '') {
    } else {
        var userAdd = user + ": " + value;
        //Send message to server
        socket.emit('chat message', userAdd);
        var line = document.createElement("li");
        document.getElementById('messages').appendChild(line);
        line.innerHTML = userAdd;
        document.getElementById("chatMessage").reset();
    }
}

/*
-Description : PDF export canvas.
*/
function exportPDF() {
    var t = document.getElementById("bTitle").innerHTML;
    var pdf = new jspdf("l", "mm", "a4");
    var imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'JPEG', 0, 0, 295, 210);
    pdf.save(t + ".pdf");
}

var zoomValue = 1;
var zoomCount = 1;

/*
-Description : Zoom in to the canvas.
*/
function zoomIn() {
    if (zoomCount < 0) {
        zoomCount = 0;
    }
    zoomCount++;
    if (zoomCount < 10) {
        zoomValue = "1." + zoomCount;
        canvas.setZoom(zoomValue);
    }
}

/*
-Description : Zoom out of the canvas.
*/
function zoomOut() {
    if (zoomCount > 10) {
        zoomCount = 9;
    }
    zoomCount--;
    if (zoomCount >= 0) {
        zoomValue = "1." + zoomCount;
        canvas.setZoom(zoomValue);
    }
}

/*
-Description : Select font for text on canvas
*/
function selectFont(chosen) {
    try {
        canvas.getActiveObject().set("fontFamily", chosen);
        canvas.renderAll();
    } catch (err) {
    }
}

/*
-Description : Remove selected object on canvas.
*/
function removeObject() {
    try {
        canvas.remove(canvas.getActiveObject());
    } catch (err) {
    }
}

/*
-Description : Select chosen colour.
*/
function colourChoice(col) {
    console.log(col);
    try {
        if (stroke) {
            canvas.getActiveObject().set('stroke', col);
        }
        if (fill) {
            canvas.getActiveObject().set('fill', col);
        }
        canvas.renderAll();
    } catch (err) {
    }
}

/*
-Description : Select fill colour.
*/
var fillCount = 0;
function fillShape() {
    fillCount++;
    if (fillCount % 2 == 0) {
        console.log("FILL ON")
        fill = true;
    } else {
        console.log("FILL OFF")
        fill = false;
    }
}

/*
-Description : Select stroke colour.
*/
var strokeCount = 0;
function stokeShape() {
    strokeCount++;
    if (strokeCount % 2 == 0) {
        console.log("Stroke ON")
        stroke = false;
    } else {
        console.log("Stroke OFF")
        stroke = true;
    }
}

/*
-Description : Add rectangle to canvas on button press.
*/
function addRectangle() {
    rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: null,
        strokeWidth: 3,
        stroke: 'black',
        width: 100,
        height: 80
    });
    canvas.add(rect);
}

/*
-Description : Add circle to canvas on button press.
*/
function addCircle() {
    circle = new fabric.Circle({
        left: 200,
        top: 100,
        fill: 'blue',
        radius: 40
    });
    canvas.add(circle);
}

/*
-Description : Add triangle to canvas on button press.
*/
function addTriangle() {
    triangle = new fabric.Triangle({
        left: 300,
        top: 100,
        fill: 'green',
        width: 90,
        height: 80
    });
    canvas.add(triangle);
}

/*
-Description : Drawing on canvas enable/disable button.
*/
var count = 0;
function pencil() {
    count++;
    if (count % 2 == 0) {
        canvas.isDrawingMode = true;
    } else {
        canvas.isDrawingMode = false;
    }
}

/*
-Description : Add text box to canvas.
*/
function addText() {
    text = new fabric.IText("Text", {left: 100, top: 100});
    canvas.add(text);
}

/*
-Description : Add yellow sticky note to canvas.
*/
function yNotes() {
    note = new fabric.Textbox('Enter text', {
        width: 200,
        height: 200,
        backgroundColor: 'yellow',
        left: 200,
        top: 150,
        fontSize: 22,
        textAlign: 'center'
    });
    canvas.add(note);
}

/*
-Description : Upload and add image to canvas.
*/
function addImages() {
    document.getElementById('file').addEventListener("change", function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var data = event.target.result;
            fabric.Image.fromURL(data, function (img) {
                var oImg = img.set(
                    {left: 100, top: 100, width: 100, height: 100});
                canvas.add(oImg);
            });
        };
        reader.readAsDataURL(file);
    });
}
/*
-Description : Add dashed line to canvas.
*/
function addDashLine() {
    var dline = new fabric.Line([50, 20, 200, 20], {
        strokeDashArray: [5, 10],
        stroke: 'black',
        strokeWidth: 5
    });
    canvas.add(dline);
}
/*
-Description : Add straight line to canvas.
*/
function addLine() {
    var line = new fabric.Line([250, 125, 250, 175], {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 5
    });
    canvas.add(line);
}
/*
-Description : Add arrow to canvas.
*/
function addArrow() {
    var atriangle = new fabric.Triangle({
        width: 20, height: 30, fill: 'black', left: 240, top: 95
    });
    var aLine = new fabric.Line([250, 125, 250, 175], {
        stroke: 'black',
        strokeWidth: 2
    });

    var group = new fabric.Group([atriangle, aLine], {
        left: 150,
        top: 100
    });
    canvas.add(group)
}