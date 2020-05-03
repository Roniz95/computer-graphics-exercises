var canvas;

var gl = null,
	program = null,
	mesh = null;
	
var projectionMatrix, 
	perspProjectionMatrix,
	viewMatrix,
	worldMatrix;
var ghostVisible = false;


//Parameters for Camera
var cx = 0;
var cy = 0.0;
var cz = 50.0;
var elevation = 0.01;
var angle = 0.01;
var roll = 0.01;
var Oelevation = 0.0;
var Oangle = 0.0;

var lookRadius = 50.0;

var keys = [];
var vx = 0.0;
var vy = 0.0;
var vz = 0.0;
var rvx = 0.0;
var rvy = 0.0;
var rvz = 0.0;

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
  	keys[e.keyCode] = true;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyUp   - Dir LEFT");
		rvy = rvy + 1.0;
		break;
	  case 39:
//console.log("KeyUp   - Dir RIGHT");
		rvy = rvy - 1.0;
		break;
	  case 38:
//console.log("KeyUp   - Dir UP");
		rvx = rvx + 1.0;
		break;
	  case 40:
//console.log("KeyUp   - Dir DOWN");
		rvx = rvx - 1.0;
		break;
	  case 81:
//console.log("KeyUp   - Dir ROLL LEFT");
		rvz = rvz + 1.0;
		break;
	  case 69:
//console.log("KeyUp   - Dir ROLL RIGHT");
		rvz = rvz - 1.0;
		break;
	  case 65:
//console.log("KeyUp   - Pos LEFT");
		vx = vx - 1.0;
		break;
	  case 68:
//console.log("KeyUp   - Pos RIGHT");
		vx = vx + 1.0;
		break;
	  case 82:
//console.log("KeyUp   - Pos UP");
		vy = vy + 1.0;
		break;
	  case 70:
//console.log("KeyUp   - Pos DOWN");
		vy = vy - 1.0;
		break;
	  case 87:
//console.log("KeyUp   - Pos FORWARD");
		vz = vz - 1.0;
		break;
	  case 83:
//console.log("KeyUp   - Pos BACKWARD");
		vz = vz + 1.0;
		break;
	}
//	console.log(vx + " " + vy + " " + vz + " " + rvx + " " + rvy + " " + rvz);
  }
//	console.log(e.keyCode);
}

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
  	keys[e.keyCode] = false;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyDown  - Dir LEFT");
		rvy = rvy - 1.0;
		break;
	  case 39:
//console.log("KeyDown - Dir RIGHT");
		rvy = rvy + 1.0;
		break;
	  case 38:
//console.log("KeyDown - Dir UP");
		rvx = rvx - 1.0;
		break;
	  case 40:
//console.log("KeyDown - Dir DOWN");
		rvx = rvx + 1.0;
		break;
	  case 81:
//console.log("KeyDown - Dir ROLL LEFT");
		rvz = rvz - 1.0;
		break;
	  case 69:
//console.log("KeyDown - Dir ROLL RIGHT");
		rvz = rvz + 1.0;
		break;
	  case 65:
//console.log("KeyDown - Pos LEFT");
		vx = vx + 1.0;
		break;
	  case 68:
//console.log("KeyDown - Pos RIGHT");
		vx = vx - 1.0;
		break;
	  case 82:
//console.log("KeyDown - Pos UP");
		vy = vy - 1.0;
		break;
	  case 70:
//console.log("KeyDown - Pos DOWN");
		vy = vy + 1.0;
		break;
	  case 87:
//console.log("KeyDown - Pos FORWARD");
		vz = vz + 1.0;
		break;
	  case 83:
//console.log("KeyDown - Pos BACKWARD");
		vz = vz - 1.0;
		break;
	  case 32:
//console.log("SPACE   - Ghost on/off");
		ghostVisible = !ghostVisible;
		break;
	}
//	console.log(vx + " " + vy + " " + vz + " " + rvx + " " + rvy + " " + rvz);
  }
//	console.log(e.keyCode);
}
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keyup", keyFunctionUp, false);
window.addEventListener("keydown", keyFunctionDown, false);

		
// Vertex shader
var vs = `#version 300 es
#define POSITION_LOCATION 0
#define NORMAL_LOCATION 1
#define UV_LOCATION 2

layout(location = POSITION_LOCATION) in vec3 in_pos;
layout(location = NORMAL_LOCATION) in vec3 in_norm;
layout(location = UV_LOCATION) in vec2 in_uv;

uniform mat4 pMatrix;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = in_pos;
	fs_norm = in_norm;
	fs_uv = vec2(in_uv.x,1.0-in_uv.y);
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

uniform sampler2D u_texture;

out vec4 color;

void main() {
	color = texture(u_texture, fs_uv);
}`;

// event handler

var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	mouseState = true;
}
function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	mouseState = false;
}
function doMouseMove(event) {
	if(mouseState) {
		var dx = event.pageX - lastMouseX;
		var dy = lastMouseY - event.pageY;
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;
		
		if((dx != 0) || (dy != 0)) {
			Oangle = Oangle + 0.5 * dx;
			Oelevation = Oelevation + 0.5 * dy;
		}
	}
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/200.0;
	if((nLookRadius > 5.0) && (nLookRadius < 100.0)) {
		lookRadius = nLookRadius;
	}
}
function doResize() {
    // set canvas dimensions
	var canvas = document.getElementById("my-canvas");
    if((window.innerWidth > 40) && (window.innerHeight > 300)) {
		canvas.width  = window.innerWidth-430;
		canvas.height = window.innerHeight-32;
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    }
}


// The real app starts here
function main(){

	// setup everything else
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	window.onresize = doResize;
	canvas.width  = window.innerWidth-430;
	canvas.height = window.innerHeight-32;

	try{
		gl= canvas.getContext("webgl2");
	} catch(e){
		console.log(e);
	}
	
	if(gl){
		// Compile and link shaders
		program = gl.createProgram();
		var v1 = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(v1, vs);
		gl.compileShader(v1);
		if (!gl.getShaderParameter(v1, gl.COMPILE_STATUS)) {
			alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(v1));
		}
		var v2 = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(v2, fs)
		gl.compileShader(v2);		
		if (!gl.getShaderParameter(v2, gl.COMPILE_STATUS)) {
			alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(v2));
		}			
		gl.attachShader(program, v1);
		gl.attachShader(program, v2);
		gl.linkProgram(program);				
		
		gl.useProgram(program);

		// Load mesh using the webgl-obj-loader library
		mesh = new OBJ.Mesh(objStr);

		// Create a texture
		imgtx = new Image();
		imgtx.onload = function() {
			var textureId = gl.createTexture();
			gl.activeTexture(gl.TEXTURE0 + 0);
			gl.bindTexture(gl.TEXTURE_2D, textureId);		
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgtx);		
		// set the filtering so we don't need mips
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		imgtx.src = TextureData;
		
		// links mesh attributes to shader attributes
		program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
		gl.enableVertexAttribArray(program.vertexPositionAttribute);
		 
		program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
		gl.enableVertexAttribArray(program.vertexNormalAttribute);
		 
		program.textureCoordAttribute = gl.getAttribLocation(program, "in_uv");
		gl.enableVertexAttribArray(program.textureCoordAttribute);

		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.textureUniform = gl.getUniformLocation(program, "u_texture");
		
		OBJ.initMeshBuffers(gl, mesh);
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// selects the mesh
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
	    gl.vertexAttribPointer(program.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
		gl.vertexAttribPointer(program.vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);		
		
		var textureId = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0 + 0);
		gl.bindTexture(gl.TEXTURE_2D, textureId);		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgtx);		
	// set the filtering so we don't need mips
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	 // turn on depth testing
	    gl.enable(gl.DEPTH_TEST);

		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}
}

function drawScene() {
	// update perspective matrix
	var canvas = document.getElementById("my-canvas");
	var slider = document.getElementById("myRange");
	perspProjectionMatrix = perspective(canvas.width, canvas.height, slider.value);

	viewMatrix = utils.multiplyMatrices(
						utils.MakeRotateZMatrix(-roll),utils.MakeView(cx, cy, cz, elevation, angle));
	viewMatrixR = view(cx, cy, cz, angle, elevation, roll);

	// Magic for moving the ship
	dvecmat = utils.transposeMatrix(viewMatrix); dvecmat[12] = dvecmat[13] = dvecmat[14] = 0.0;
	xaxis = [dvecmat[0],dvecmat[4],dvecmat[8]];
	yaxis = [dvecmat[1],dvecmat[5],dvecmat[9]];
	zaxis = [dvecmat[2],dvecmat[6],dvecmat[10]];
	
	if((rvx != 0) || (rvy != 0) || (rvz != 0)) {
		qx = Quaternion.fromAxisAngle(xaxis, utils.degToRad(rvx * 1));
		qy = Quaternion.fromAxisAngle(yaxis, utils.degToRad(rvy * 1));
		qz = Quaternion.fromAxisAngle(zaxis, utils.degToRad(rvz * 1));
		newDvecmat = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(
			qy.toMatrix4(), qx.toMatrix4()), qz.toMatrix4()), dvecmat);
		R11=newDvecmat[10];R12=newDvecmat[8];R13=newDvecmat[9];
		R21=newDvecmat[2]; R22=newDvecmat[0];R23=newDvecmat[1];
		R31=newDvecmat[6]; R32=newDvecmat[4];R33=newDvecmat[5];
		
		if((R31<1)&&(R31>-1)) {
			theta = -Math.asin(R31);
			phi = Math.atan2(R32/Math.cos(theta), R33/Math.cos(theta));
			psi = Math.atan2(R21/Math.cos(theta), R11/Math.cos(theta));
			
		} else {
			phi = 0;
			if(R31<=-1) {
				theta = Math.PI / 2;
				psi = phi + Math.atan2(R12, R13);
			} else {
				theta = -Math.PI / 2;
				psi = Math.atan2(-R12, -R13) - phi;
			}
		}
		elevation = theta/Math.PI*180;
		roll      = phi/Math.PI*180;
		angle     = psi/Math.PI*180;
	}

	delta = utils.multiplyMatrixVector(dvecmat, [vx, vy, vz, 0.0]);
	cx += delta[0] / 2;
	cy += delta[1] / 2;
	cz += delta[2] / 2;


	//viewMatrix = view(0, 0, 50, 0, 0, 0);
	
	projectionMatrix = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(perspProjectionMatrix, viewMatrixR), utils.MakeRotateXMatrix(-Oelevation)), utils.MakeRotateYMatrix(Oangle)), utils.MakeTranslateMatrix(0, -10, 0));

	// sets the uniforms
	gl.uniform1i(program.textureUniform, 0);

	// draws the request
	gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(projectionMatrix));		
	gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	if(ghostVisible) {
		projectionMatrix = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(utils.MakePerspective(slider.value, canvas.width/canvas.height, 0.1, 100.0), viewMatrix), utils.MakeRotateXMatrix(-Oelevation)), utils.MakeRotateYMatrix(Oangle)), utils.MakeTranslateMatrix(0, -10, 0));
		gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(projectionMatrix));		
		gl.drawElements(gl.LINE_STRIP, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	
	window.requestAnimationFrame(drawScene);		
}