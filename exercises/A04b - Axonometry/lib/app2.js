var canvas;

var gl = null,
	program = null,
	mesh = null;
	
var projectionMatrix, 
	viewMatrix,
	worldMatrix;


//Parameters for Camera
var elevation = 0.0;
var angle = 0.0;


// For the exercise
var tTransform;
var sTransform = [];
var sTransformText = [];

var curr_tTransform = 0;
var curr_sTransform = 0;
var changeT = true;

function InitTransforms() {
	vi = [utils.MakeScaleMatrix(0.05)];
	tTransform = vi.concat(axonometry());

	sTransformText[0] = "Make an isometric view, w = 50, a = 16/9, n = 1, f = 101";
	sTransform[0] = utils.multiplyMatrices(utils.multiplyMatrices(utils.MakeParallel(50.0,16/9,1,101),utils.MakeRotateXMatrix(35.26)),utils.MakeRotateYMatrix(45));
//	sTransform[0] = utils.MakeParallel(40.0,16/9,1,101);
		
	sTransformText[1] = "Make a dimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis";
	sTransform[1] = utils.multiplyMatrices(utils.multiplyMatrices(utils.MakeParallel(50.0,16/9,1,101),utils.MakeRotateXMatrix(20)),utils.MakeRotateYMatrix(45));


	
	sTransformText[2] = "Make a trimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis";
	sTransform[2] = utils.multiplyMatrices(utils.multiplyMatrices(utils.MakeParallel(50.0,16/9,1,101),utils.MakeRotateXMatrix(-30)),utils.MakeRotateYMatrix(30));
;

	
	sTransformText[3] = "Make a cavalier projection view, w = 50, a = 16/9, n = 1, f = 101, at 45 degrees";
	sTransform[3] = utils.multiplyMatrices(utils.MakeParallel(50.0,16/9,1,101),utils.MakeShearZMatrix(-Math.cos(utils.degToRad(45)),-Math.sin(utils.degToRad(45))));
	       	       
	sTransformText[4] = "Make a cabinet projection view, w = 50, a = 16/9, n = 1, f = 101, at 60 degrees";
	sTransform[4] = utils.multiplyMatrices(utils.MakeParallel(50.0,16/9,1,101),utils.MakeShearZMatrix(-0.5*Math.cos(utils.degToRad(60)),-0.5*Math.sin(utils.degToRad(60))));
	       	       
	document.getElementById("p1").innerHTML = sTransformText[0];
}

function NextEx() {
	if(curr_tTransform == tTransform.length-1) {
		curr_tTransform = 0;
		curr_sTransform = 0;
		changeT = true;
		document.getElementById("p1").innerHTML = sTransformText[0];
		
		return;
	}
	if(changeT) {
		curr_tTransform = (curr_tTransform + 1) % tTransform.length;
		changeT = false;
	} else {
		curr_sTransform = (curr_sTransform + 1) % sTransform.length;
		changeT = true;
	}
	document.getElementById("p1").innerHTML = (!changeT ? "<B>" : "") + sTransformText[curr_sTransform] + (!changeT ? "</B>" : "");
}

var keyFunction =function(e) {
	if (e.keyCode == 32) {	// Space
		NextEx();
	}	
}
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keyup", keyFunction, false);

		
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
			angle = angle + 0.25 * dx;
			elevation = elevation + 0.25 * dy;
		}
	}
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 2.0) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
}


// The real app starts here
function main(){
	// for excercise
	InitTransforms();

	// setup everything else
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	
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
		// update WV matrix
		cx = Math.sin(utils.degToRad(angle));
		cy = Math.sin(utils.degToRad(elevation));
		viewMatrix = utils.MakeTranslateMatrix(cx, cy, 0.5);

		// sets the uniforms
		gl.uniform1i(program.textureUniform, 0);

		// draws the request
		var preScale = 8.0;
		WVPmatrix = utils.multiplyMatrices(utils.multiplyMatrices(viewMatrix, sTransform[curr_sTransform]), utils.MakeScaleMatrix(preScale));
		gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(WVPmatrix));		
		gl.drawElements(gl.LINE_STRIP, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);		
		
		// draws the answer
		if(!changeT) {
			WVPmatrix = utils.multiplyMatrices(utils.multiplyMatrices(viewMatrix, tTransform[curr_tTransform]), utils.MakeScaleMatrix(preScale));
			gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(WVPmatrix));		
			gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}

		
		window.requestAnimationFrame(drawScene);		
}