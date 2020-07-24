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
#define NORMAL_LOCATION 1

layout(location = POSITION_LOCATION) in vec3 in_pos;
layout(location = NORMAL_LOCATION) in vec3 in_norm;

uniform mat4 pMatrix;

out vec3 fs_pos;
out vec3 fs_norm;

void main() {
	fs_pos = in_pos;
	fs_norm = in_norm;
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;

uniform vec4 lightDir1;
uniform vec4 lightDir2;
uniform vec4 lightDir3;
uniform vec4 matcol;
uniform float normvis;

out vec4 color;

void main() {
	vec3 n_norm = normalize(fs_norm);
	
	float dimFact = lightDir1.w * clamp(dot(n_norm, lightDir1.xyz),0.0,1.0);
	dimFact += lightDir2.w * clamp(dot(n_norm, lightDir2.xyz),0.0,1.0) / 2.0;
	dimFact += lightDir3.w * clamp(dot(n_norm, lightDir3.xyz),0.0,1.0) / 3.0;
	dimFact = dimFact * matcol.a + (1.0 - matcol.a);
	color = vec4(min(matcol.rgb * dimFact  * (1.0-normvis) +
					normvis * (fs_norm + vec3(1.0,1.0,1.0)) / 2.0, vec3(1.0, 1.0, 1.0)), 1.0);
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

var wireframeMode = 0;
var keyFunction =function(e) {
	if (e.keyCode == 32) {	// Space
		wireframeMode = (wireframeMode + 1) % 3;
	}	
}
window.addEventListener("keyup", keyFunction, false);


var totMesh = 0;
var startVertex = [0];
var startIndex = [0];
var vertices = [];
var normals = [];
var indices = [];
var colors = [];
var startNormal = [];

function addMesh(i_vertices, i_norm, i_indices, i_color) {
	var i;
//console.log(i_vertices);
	for(i = 0; i < i_vertices.length; i++) {
		vertices[(i + startVertex[totMesh]) * 3 + 0 ] = i_vertices[i][0];
		vertices[(i + startVertex[totMesh]) * 3 + 1 ] = i_vertices[i][1];
		vertices[(i + startVertex[totMesh]) * 3 + 2 ] = i_vertices[i][2];
		normals[ (i + startVertex[totMesh]) * 3 + 0 ] = i_norm[i][0];
		normals[ (i + startVertex[totMesh]) * 3 + 1 ] = i_norm[i][1];
		normals[ (i + startVertex[totMesh]) * 3 + 2 ] = i_norm[i][2];
	}
	for(i = 0; i < i_indices.length; i++) {
		indices[i + startIndex[totMesh]] = startVertex[totMesh] + i_indices[i];
	}
	colors[totMesh] = i_color;

	totMesh ++;	
	
	startVertex[totMesh] = startVertex[totMesh-1] + i_vertices.length;
	startIndex[totMesh] = startIndex[totMesh-1] + i_indices.length;	
}

function buildNormalBuffer() {
	k = startVertex[totMesh] * 3;
	h = startIndex[totMesh];
	for(i = 0; i < totMesh; i++) {
		startNormal[i] = h;
		for(j = startVertex[i] * 3; j < startVertex[i+1] * 3; j+=3) {
		  for(l = 0; l < 3; l++) {
			vertices[k] = vertices[j+l]; normals[k] = normals[j+l]; k++; 
		  }
		  indices[h] = k/3-1; h++;
		  for(l = 0; l < 3; l++) {
			vertices[k] = vertices[j+l] + normals[j+l]/5; normals[k] = normals[j+l]; k++;
		  }
		  indices[h] = k/3-1; h++;
		}
//console.log(i + " " + j + " " + k + " " + h);
	}
	startNormal[i] = h;
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
		buildNormalBuffer();
		
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
		gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

		normalBuffer = gl.createBuffer();
		normals = new Float32Array(normals);
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);

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

		program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
		gl.enableVertexAttribArray(program.vertexNormalAttribute);
		 
		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.lightDir1 = gl.getUniformLocation(program, "lightDir1");
		program.lightDir2 = gl.getUniformLocation(program, "lightDir2");
		program.lightDir3 = gl.getUniformLocation(program, "lightDir3");
		program.matcol = gl.getUniformLocation(program, "matcol");
		program.normvis = gl.getUniformLocation(program, "normvis");
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// selects the mesh
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.vertexAttribPointer(program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);		
		
	 // turn on depth testing and back-face culling
	    gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

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

function drawNormals(slider) {
//	console.log(startNormal[slider+1] + " " + startNormal[slider] + " " + slider);
	gl.drawElements(gl.LINES, startNormal[slider+1] - startNormal[slider], gl.UNSIGNED_SHORT, startNormal[slider]*2);
}

function drawScene() {
		// update perspective matrix
	var canvas = document.getElementById("my-canvas");
	var slider = document.getElementById("myRange").value - 1;
	
	output.innerHTML = (slider+1) + " Vertices: " + (startVertex[slider+1]-startVertex[slider])+
						" Triangles: " + ((startIndex[slider+1]-startIndex[slider])/3);

	
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

	if(wireframeMode == 1) {
		gl.uniform1f(program.normvis, 0.0);
		gl.uniform4f(program.matcol, colors[slider][0]/2, colors[slider][1]/2, colors[slider][2]/2, 0.0);
		for(i = 0; i < (startIndex[slider+1] - startIndex[slider])/3; i++)
			gl.drawElements(gl.LINE_LOOP, 3,
						    gl.UNSIGNED_SHORT, (startIndex[slider]+i*3) * 2);
		drawNormals(slider);
	} else if(wireframeMode == 0) {
		gl.enable(gl.CULL_FACE);
		gl.uniform1f(program.normvis, 0.0);
		gl.uniform4f(program.matcol, colors[slider][0], colors[slider][1], colors[slider][2], 1.0);
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
	} else if(wireframeMode == 2) {
		gl.uniform1f(program.normvis, 1.0);
		gl.disable(gl.CULL_FACE);
		gl.uniform4f(program.matcol, colors[slider][0], colors[slider][1], colors[slider][2], 1.0);
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
		gl.uniform1f(program.normvis, 0.0);
		gl.uniform4f(program.matcol, colors[slider][0]/2, colors[slider][1]/2, colors[slider][2]/2, 0.0);
		drawNormals(slider);
	}
	window.requestAnimationFrame(drawScene);		
}