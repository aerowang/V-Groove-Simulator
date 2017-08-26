// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
}
// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
}
// Cosecant
Math.csc = function(degrees) {
	return 1 / Math.sin(degrees);
}
// Round with digits' options.
round = function(x, digits){
	return parseFloat(x.toFixed(digits))
}

function drawLine(ctx, p1x, p1y, p2x, p2y, color) {
	ctx.lineWidth = 1;
	ctx.beginPath()
	ctx.moveTo(p1x, p1y);
	ctx.lineTo(p2x, p2y);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function drawRect(ctx, p1x, p1y, p2x, p2y, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(p1x, p1y, p2x-p1x, p2y-p1y);
}

function drawCircle(ctx, cx, cy, r, color) {
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, 2*Math.PI, true);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawTriangle(ctx, p1x, p1y, p2x, p2y, p3x, p3y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(p1x, p1y);
	ctx.lineTo(p2x, p2y);
	ctx.lineTo(p3x, p3y);
	ctx.closePath();
	ctx.fill();
}

function tagLabel(ctx, x, y, text, color) {
	ctx.fillStyle = color;
	ctx.font = "18px Arial";
	ctx.fillText(text, x, y);
}

function cleanCanvas(ctx) {
	var c = ctx.canvas;
	ctx.clearRect(0, 0, c.width, c.height);
	drawRect(ctx, 0, 0, c.width, c.height, "lightyellow");
}

function calculate() {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	cleanCanvas(ctx);
	document.getElementById("txtDepth").innerHTML = "Depth:";
	document.getElementById("txtWidth").innerHTML = "Width:";

	// Get angle, cladding diameter, gap value;
	var angle = Number(document.getElementById("txtAngle").value);
	var cladd = Number(document.getElementById("txtCladD").value);
	var gap_mm = Number(document.getElementById("txtGap").value);

	// Calculation
	var Dscar = cladd/2 * (1 + Math.csc(Math.radians(angle/2))) - gap_mm;
	var Wscar = 2 * Dscar * Math.tan(Math.radians(angle/2));

	// Output width and depth of scar
	document.getElementById("txtDepth").innerHTML 
		= "Depth: " + round(Dscar, 4) + "mm";
	document.getElementById("txtWidth").innerHTML 
		= "Width: " + round(Wscar, 4) + "mm";

	/***************************************
	  * Draw stuff on canvas.
		like glass substrate, scar of v-groove,
		and cladding of fiber, etc.
	***************************************/
	// Draw glass substrate
	var horizon  = 70;          // top of substrate
	var vertical = c.width / 2;  // vertical center line
	var gap_m = Math.round(gap_mm*1000);
	var radius_m = Math.round(cladd/2*1000);
	drawRect(ctx, 0, horizon, c.width, c.height, "lightskyblue");

	// Draw v-groove
	var p1x = vertical - Math.round(Wscar/2*1000);
	var p1y = horizon;
	var p2x = vertical;
	var p2y = horizon  + Math.round(Dscar*1000);
	var p3x = vertical + Math.round(Wscar/2*1000);
	var p3y = horizon;
	drawTriangle(ctx, p1x, p1y, p2x, p2y, p3x, p3y, "lightyellow");

	// Draw cladding
	var cx = vertical;
	var cy = horizon - gap_m + radius_m;
	drawCircle(ctx, cx, cy, radius_m, "orange");

	// Tag labels
	tagLabel(ctx,  10, 290, "Canvas version", "#444");
	tagLabel(ctx, 320, 290, "Unit: mm", "#444");

	// // Testing
	// var Dscar_m = Math.round(Dscar*1000);
	// drawLine(ctx, p1x, p1y+Dscar_m, p3x, p3y+Dscar_m, "red");
	// var www = "Width: " + round(Wscar, 4) + "mm";
	// tagLabel(ctx, 130, 220, www, "red");
	// drawLine(ctx, p1x, p1y, p1x, p1y+Dscar_m, "green");
	// var ddd = "Depth: " + round(Dscar, 4);
	// tagLabel(ctx, 130, 150, ddd, "green");
}