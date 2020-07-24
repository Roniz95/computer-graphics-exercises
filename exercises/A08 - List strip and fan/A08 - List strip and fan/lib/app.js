var canvas;

var gl = null,
	program = null;
	
var projectionMatrix, 
	perspProjectionMatrix,
	viewMatrix,
	worldMatrix;


//Parameters for Camera
var cx = 4.5;
var cy = 0.0;
var cz = 10.0;
var elevation = 0.0;
var angle = 0.0;

var lookRadius = 10.0;


		
// Vertex shader
var vs = `#version 300 es
#define POSITION_LOCATION 0

layout(location = POSITION_LOCATION) in vec3 in_pos;

uniform mat4 pMatrix;

out vec3 fs_pos;

void main() {
	fs_pos = in_pos;
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;

uniform vec4 lightDir1;
uniform vec4 lightDir2;
uniform vec4 lightDir3;
uniform vec4 matcol;

out vec4 color;

void main() {
	vec3 X = dFdx(fs_pos);
	vec3 Y = dFdy(fs_pos);
	vec3 n_norm = normalize(cross(X,Y));
	vec3 a_norm = -n_norm;
	
	float dimFact = lightDir1.w * clamp(max(dot(n_norm, lightDir1.xyz),dot(a_norm, lightDir1.xyz)),0.0,1.0);
	dimFact += lightDir2.w * clamp(dot(n_norm, lightDir2.xyz),0.0,1.0);
	dimFact += lightDir3.w * clamp(dot(n_norm, lightDir3.xyz),0.0,1.0);
	dimFact = dimFact * matcol.a + (1.0 - matcol.a);
	color = vec4(min(matcol.rgb * dimFact, vec3(1.0, 1.0, 1.0)), 1.0);
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
			angle = angle + 0.5 * dx;
			elevation = elevation + 0.5 * dy;
		}
	}
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/200.0;
	if((nLookRadius > 2.0) && (nLookRadius < 100.0)) {
		lookRadius = nLookRadius;
	}
}
function doResize() {
    // set canvas dimensions
	var canvas = document.getElementById("my-canvas");
    if((window.innerWidth > 40) && (window.innerHeight > 220)) {
		canvas.width  = window.innerWidth-16;
		canvas.height = window.innerHeight-180;
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    }
}

var wireframeMode = false;
var keyFunction =function(e) {
	if (e.keyCode == 32) {	// Space
		wireframeMode = !wireframeMode;
	}	
}
window.addEventListener("keyup", keyFunction, false);


var totMesh = 0;
var startVertex = [0];
var startIndex = [0];
var vertices = [];
var indices = [];
var colors = [];
var mtypes = [];

function addMesh(i_vertices, i_type, i_color) {
	var i;
//console.log(i_vertices);
	for(i = 0; i < i_vertices.length; i++) {
		vertices[(i + startVertex[totMesh]) * 3 + 0 ] = i_vertices[i][0];
		vertices[(i + startVertex[totMesh]) * 3 + 1 ] = i_vertices[i][1];
		vertices[(i + startVertex[totMesh]) * 3 + 2 ] = i_vertices[i][2];
	}
	for(i = 0; i < i_vertices.length; i++) {
		indices[i + startIndex[totMesh]] = startVertex[totMesh] + i;
	}
	colors[totMesh] = i_color;
	mtypes[totMesh] = i_type;

	totMesh ++;	
	
	startVertex[totMesh] = startVertex[totMesh-1] + i_vertices.length;
	startIndex[totMesh] = startIndex[totMesh-1] + i_vertices.length;	
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
	canvas.width  = window.innerWidth-16;
	canvas.height = window.innerHeight-180;

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

		// Creates  geometry
		buildGeometry();
		document.getElementById("myRange").max = totMesh;
//console.log(totMesh);
//console.log(startVertex);
//console.log(startIndex);
//console.log(vertices);
//console.log(indices);
//console.log(colors);
		vertexBuffer = gl.createBuffer();
		vertices = new Float32Array(vertices);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//console.log(vertices.byteLength);
		gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

		indexBuffer = gl.createBuffer();
		indices = new Uint16Array(indices);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//console.log(indices.byteLength);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);	
//		
//		mesh = new OBJ.Mesh(objStr);
//		OBJ.initMeshBuffers(gl, mesh);
		
		// links mesh attributes to shader attributes
		program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
		gl.enableVertexAttribArray(program.vertexPositionAttribute);
		 
		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.lightDir1 = gl.getUniformLocation(program, "lightDir1");
		program.lightDir2 = gl.getUniformLocation(program, "lightDir2");
		program.lightDir3 = gl.getUniformLocation(program, "lightDir3");
		program.matcol = gl.getUniformLocation(program, "matcol");
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// selects the mesh
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);		
		
	 // turn on depth testing and back-face culling
	    gl.enable(gl.DEPTH_TEST);
//		gl.enable(gl.CULL_FACE);
//		gl.cullFace(gl.BACK);

		s45 = 0.707106781186548;
		s30 = 0.5;
		s60 = 0.866025403784439;

		gLightDir1 = [ 0.0, s45, s45, 1.0];
		gLightDir2 = [ s60, s45,-s45*s30, 0.7];
		gLightDir3 = [-s60,-s45,-s45*s30, 0.5];

		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}
}

function drawScene() {
	// update perspective matrix
	var canvas = document.getElementById("my-canvas");
	var slider = document.getElementById("myRange").value - 1;
	perspProjectionMatrix = utils.MakePerspective(65, canvas.width / canvas.height, 0.1, 100.0)

	// update WV matrix
	cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cy = lookRadius * Math.sin(utils.degToRad(-elevation));
	viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
	projectionMatrix = utils.multiplyMatrices(perspProjectionMatrix, viewMatrix);

	// draws the request
	gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(projectionMatrix));
	gl.uniform4f(program.lightDir1, gLightDir1[0], gLightDir1[1], gLightDir1[2], gLightDir1[3]);
	gl.uniform4f(program.lightDir2, gLightDir2[0], gLightDir2[1], gLightDir2[2], gLightDir2[3]);
	gl.uniform4f(program.lightDir3, gLightDir3[0], gLightDir3[1], gLightDir3[2], gLightDir3[3]);

	gl.uniform4f(program.matcol, colors[slider][0], colors[slider][1], colors[slider][2], 1.0);
	switch(mtypes[slider]) {
	  case "L":
	  case "l":
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
		break;
	  case "S":
	  case "s":
		gl.drawElements(gl.TRIANGLE_STRIP, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
		break;
	  case "F":
	  case "f":
		gl.drawElements(gl.TRIANGLE_FAN, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
		break;
	}
	window.requestAnimationFrame(drawScene);		
}