var socket = io();
//Setup the canvas with data
function start() {
    canvas = new fabric.StaticCanvas('canvas');
    canvas.isTouchSupported = true;
    //Socket.io to recieve data
    socket.on('guest', function (data) {
            console.log("recieved data: " + data)
        canvas.loadFromJSON(data, function() {
            canvas.renderAll();
        });
            if (data.length == 0) {
                location.reload()
            }
    });
}
//Export canvas to PDF
function exportPDF() {
    var title = document.getElementById("title").value;
    var pdf = new jspdf("l", "mm", "a4");
    var imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'JPEG', 0, 0, 295, 210);
    pdf.save(title + ".pdf");
}

var zoomValue = 1;
var zoomCount = 1;

//zoom in
function zoomIn() {
    if (zoomCount < 0) {
        zoomCount = 0;
    }
    zoomCount++;
    console.log("+" + zoomCount)
    if (zoomCount < 10) {
        zoomValue = "1." + zoomCount;
        console.log("+" + zoomValue);
        canvas.setZoom(zoomValue);
    }
}

//zoom out
function zoomOut() {
    if (zoomCount > 10) {
        zoomCount = 9;
    }
    zoomCount--;
    console.log("-" + zoomCount)
    if (zoomCount >= 0) {
        zoomValue = "1." + zoomCount;
        console.log("-" + zoomValue);
        canvas.setZoom(zoomValue);
    }
}

