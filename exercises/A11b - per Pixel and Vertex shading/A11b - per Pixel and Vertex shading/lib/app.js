var canvas;

var gl = null,
	program = null,
	worldMesh = null,
	skybox = null,
	imgtx = null,
	skyboxLattx = null,
	skyboxTbtx = null;
	
var projectionMatrix, 
	perspectiveMatrix,
	viewMatrix,
	worldMatrix,
	gLightDir;

var worldScale;


//Parameters for Camera
var cx = 0.0;
var cy = 0.0;
var cz = 6.5;
var elevation = 0.01;
var angle = 0.01;
var roll = 0.01;

var lookRadius = 10.0;


var keys = [];
var rvx = 0.0;
var rvy = 0.0;
var rvz = 0.0;

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
  	keys[e.keyCode] = true;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyUp   - Dir LEFT");
		rvy = rvy - 1.0;
		break;
	  case 39:
//console.log("KeyUp   - Dir RIGHT");
		rvy = rvy + 1.0;
		break;
	  case 38:
//console.log("KeyUp   - Dir UP");
		rvx = rvx + 1.0;
		break;
	  case 40:
//console.log("KeyUp   - Dir DOWN");
		rvx = rvx - 1.0;
		break;
	}
  }
}

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
  	keys[e.keyCode] = false;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyDown  - Dir LEFT");
		rvy = rvy + 1.0;
		break;
	  case 39:
//console.log("KeyDown - Dir RIGHT");
		rvy = rvy - 1.0;
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
	}
  }
}
function doResize() {
    // set canvas dimensions
	var canvas = document.getElementById("my-canvas");
    if((window.innerWidth > 40) && (window.innerHeight > 340)) {
		canvas.width  = window.innerWidth-16;
		canvas.height = window.innerHeight-280;
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		perspectiveMatrix = utils.MakePerspective(60, w/h, 0.1, 1000.0);

    }
}


var reqData = [
	{text: "Per vertex",
	 sel: {	ambientType: "ambient",
			diffuseType: "lambert",
			specularType: "blinn",
			LAlightType: "point",
			LBlightType: "none",
			LClightType: "none",
			emissionType: "Yes"
	 } },
	{text: "Per pixel",
	 sel: {	ambientType: "ambient",
			diffuseType: "lambert",
			specularType: "blinn",
			LAlightType: "point",
			LBlightType: "none",
			LClightType: "none",
			emissionType: "Yes"
	 } },
	{text: "Light per vertex, diffuse and specular per pixel",
	 sel: {	ambientType: "ambient",
			diffuseType: "lambert",
			specularType: "blinn",
			LAlightType: "point",
			LBlightType: "none",
			LClightType: "none",
			emissionType: "Yes"
	 } },
	{text: "Light and diffuse per vertex, specular per pixel",
	 sel: {	ambientType: "ambient",
			diffuseType: "lambert",
			specularType: "blinn",
			LAlightType: "point",
			LBlightType: "none",
			LClightType: "none",
			emissionType: "Yes"
	 } }
];


var curr_Shader = 0;

function ChangeShader(delta) {
	curr_Shader = (curr_Shader + delta) % reqData.length;

	if(curr_Shader == 0) {
		document.getElementById("nextButton").style.display = "";
		document.getElementById("prevButton").style.display = "none";
	} else if(curr_Shader == reqData.length - 1) {
		document.getElementById("nextButton").style.display = "none";
		document.getElementById("prevButton").style.display = "";
	} else {
		document.getElementById("nextButton").style.display = "";
		document.getElementById("prevButton").style.display = "";
	}
	
	document.getElementById("p1").innerHTML = reqData[curr_Shader].text;

	for(var name in reqData[curr_Shader].sel) {
		value = reqData[curr_Shader].sel[name];
		document.getElementById(name).value = value;
		showHideUI(name, value);
	}

	setShader();
}		

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
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 2.0) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
}


// UI helper arrays

UIonOff = {
	LAlightType:{
		none:{
			LA13:false, LA14:false,
			LA21:false, LA22:false, LA23:false, LA24:false,
			LA31:false, LA32:false, LA33:false, LA34:false,
			LA41:false, LA42:false, LA43:false, LA44:false,
			LA51:false, LA52:false, LA53:false, LA54:false,
			LA61:false, LA62:false
		},
		direct:{
			LA13:true, LA14:true,
			LA21:false, LA22:false, LA23:false, LA24:false,
			LA31:false, LA32:false, LA33:false, LA34:false,
			LA41:false, LA42:false, LA43:false, LA44:false,
			LA51:true, LA52:true, LA53:false, LA54:false,
			LA61:true, LA62:true
		},
		point:{
			LA13:true, LA14:true,
			LA21:true, LA22:true, LA23:false, LA24:false,
			LA31:true, LA32:true, LA33:false, LA34:false,
			LA41:true, LA42:true, LA43:false, LA44:false,
			LA51:false, LA52:false, LA53:false, LA54:false,
			LA61:false, LA62:false
		},
		spot:{
			LA13:true, LA14:true,
			LA21:true, LA22:true, LA23:true, LA24:true,
			LA31:true, LA32:true, LA33:true, LA34:true,
			LA41:true, LA42:true, LA43:true, LA44:true,
			LA51:true, LA52:true, LA53:true, LA54:true,
			LA61:true, LA62:true
		}
	},
	LBlightType:{
		none:{
			LB13:false, LB14:false,
			LB21:false, LB22:false, LB23:false, LB24:false,
			LB31:false, LB32:false, LB33:false, LB34:false,
			LB41:false, LB42:false, LB43:false, LB44:false,
			LB51:false, LB52:false, LB53:false, LB54:false,
			LB61:false, LB62:false
		},
		direct:{
			LB13:true, LB14:true,
			LB21:false, LB22:false, LB23:false, LB24:false,
			LB31:false, LB32:false, LB33:false, LB34:false,
			LB41:false, LB42:false, LB43:false, LB44:false,
			LB51:true, LB52:true, LB53:false, LB54:false,
			LB61:true, LB62:true
		},
		point:{
			LB13:true, LB14:true,
			LB21:true, LB22:true, LB23:false, LB24:false,
			LB31:true, LB32:true, LB33:false, LB34:false,
			LB41:true, LB42:true, LB43:false, LB44:false,
			LB51:false, LB52:false, LB53:false, LB54:false,
			LB61:false, LB62:false
		},
		spot:{
			LB13:true, LB14:true,
			LB21:true, LB22:true, LB23:true, LB24:true,
			LB31:true, LB32:true, LB33:true, LB34:true,
			LB41:true, LB42:true, LB43:true, LB44:true,
			LB51:true, LB52:true, LB53:true, LB54:true,
			LB61:true, LB62:true
		}
	},
	LClightType:{
		none:{
			LC13:false, LC14:false,
			LC21:false, LC22:false, LC23:false, LC24:false,
			LC31:false, LC32:false, LC33:false, LC34:false,
			LC41:false, LC42:false, LC43:false, LC44:false,
			LC51:false, LC52:false, LC53:false, LC54:false,
			LC61:false, LC62:false
		},
		direct:{
			LC13:true, LC14:true,
			LC21:false, LC22:false, LC23:false, LC24:false,
			LC31:false, LC32:false, LC33:false, LC34:false,
			LC41:false, LC42:false, LC43:false, LC44:false,
			LC51:true, LC52:true, LC53:false, LC54:false,
			LC61:true, LC62:true
		},
		point:{
			LC13:true, LC14:true,
			LC21:true, LC22:true, LC23:true, LC24:true,
			LC31:true, LC32:true, LC33:true, LC34:true,
			LC41:true, LC42:true, LC43:false, LC44:false,
			LC51:false, LC52:false, LC53:false, LC54:false,
			LC61:false, LC62:false
		},
		spot:{
			LC13:true, LC14:true,
			LC21:true, LC22:true, LC23:true, LC24:true,
			LC31:true, LC32:true, LC33:true, LC34:true,
			LC41:true, LC42:true, LC43:true, LC44:true,
			LC51:true, LC52:true, LC53:true, LC54:true,
			LC61:true, LC62:true
		}
	},
	ambientType:{
		none:{
			A20:false, A21:false, A22:false,
			A31:false, A32:false,
			A41:false, A42:false,
			A51:false, A52:false,
			MA0:false, MA1:false, MA2:false
		},
		ambient:{
			A20:false, A21:true, A22:true,
			A31:false, A32:false,
			A41:false, A42:false,
			A51:false, A52:false,
			MA0:true, MA1:true, MA2:true
		},
		hemispheric:{
			A20:true, A21:false, A22:true,
			A31:true, A32:true,
			A41:true, A42:true,
			A51:true, A52:true,
			MA0:true, MA1:true, MA2:true
		}
	},
	diffuseType:{
		none:{
			D21:false, D22:false,
			D41:false, D42:false
		},
		lambert:{
			D21:true,  D22:true,
			D41:false, D42:false
		},
		toon:{
			D21:true,  D22:true,
			D41:true, D42:true
		}
	},
	specularType:{
		none:{
			S21:false, S22:false,
			S31:false, S32:false,
			S41:false, S42:false
		},
		phong:{
			S21:true, S22:true,
			S31:true, S32:true,
			S41:false, S42:false
		},
		blinn:{
			S21:true, S22:true,
			S31:true, S32:true,
			S41:false, S42:false
		},
		toonP:{
			S21:true, S22:true,
			S31:false, S32:false,
			S41:true, S42:true
		},
		toonB:{
			S21:true, S22:true,
			S31:false, S32:false,
			S41:true, S42:true
		}
	}, 
	emissionType:{
		Yes: {ME1:true,  ME2:true},
		No:  {ME1:false, ME2:false}
	}
}


function showHideUI(tag, sel) {
	for(var name in UIonOff[tag][sel]) {
		document.getElementById(name).style.display = UIonOff[tag][sel][name] ? "block" : "none";
	}
}

function showLight(sel) {
	document.getElementById("LA").style.display = (sel == "LA") ? "block" : "none";
	document.getElementById("LB").style.display = (sel == "LB") ? "block" : "none";
	document.getElementById("LC").style.display = (sel == "LC") ? "block" : "none";
}

defShaderParams = {
	ambientLightColor: "#222222",
	diffuseColor: "#00ffff",
	specularColor: "#ffffff",
	ambientMatColor: "#ffffff",
	emitColor: "#000000",

	LAlightColor: "#ffffff",
	LAPosX: 20,
	LAPosY: 250,
	LAPosZ: 50,

	SpecShine: 100
}

function resetShaderParams() {
	for(var name in defShaderParams) {
		value = defShaderParams[name];
		document.getElementById(name).value = value;
		if(document.getElementById(name).type == "select-one") {
			showHideUI(name, value);
		}
	}
	
	cx = 0.0;
	cy = 0.0;
	cz = 6.5;
	elevation = 0.01;
	angle = 0.01;
	roll = 0.01;
	lookRadius = 10.0;
	
	if(gl) {
		setWorldMesh();
	}
}

function unifPar(pHTML, pGLSL, type) {
	this.pHTML = pHTML;
	this.pGLSL = pGLSL;
	this.type = type;
}

function noAutoSet(gl) {
}

function val(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value);
}

function valD10(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value / 10);
}

function valD100(gl) {
	gl.uniform1f(program[this.pGLSL+"Uniform"], document.getElementById(this.pHTML).value / 100);
}

function valCol(gl) {
	col = document.getElementById(this.pHTML).value.substring(1,7);
    R = parseInt(col.substring(0,2) ,16) / 255;
    G = parseInt(col.substring(2,4) ,16) / 255;
    B = parseInt(col.substring(4,6) ,16) / 255;
	gl.uniform4f(program[this.pGLSL+"Uniform"], R, G, B, 1);
}

function valVec3(gl) {
	gl.uniform3f(program[this.pGLSL+"Uniform"],
				 document.getElementById(this.pHTML+"X").value / 10,
				 document.getElementById(this.pHTML+"Y").value / 10,
				 document.getElementById(this.pHTML+"Z").value / 10);
}

function valDir(gl) {
	var t = utils.degToRad(document.getElementById(this.pHTML+"Theta").value);
	var p = utils.degToRad(document.getElementById(this.pHTML+"Phi").value);
	gl.uniform3f(program[this.pGLSL+"Uniform"],Math.sin(t)*Math.sin(p), Math.cos(t), Math.sin(t)*Math.cos(p));
}

valTypeDecoder = {
	LAlightType:{
		none: [0,0,0,0],
		direct: [1,0,0,0],
		point: [0,1,0,0],
		spot: [0,0,1,0]
	},
	LBlightType:{
		none: [0,0,0,0],
		direct: [1,0,0,0],
		point: [0,1,0,0],
		spot: [0,0,1,0]
	},
	LClightType:{
		none: [0,0,0,0],
		direct: [1,0,0,0],
		point: [0,1,0,0],
		spot: [0,0,1,0]
	},
	ambientType:{
		none: [0,0,0,0],
		ambient: [1,0,0,0],
		hemispheric: [0,1,0,0]
	},
	diffuseType:{
		none: [0,0,0,0],
		lambert: [1,0,0,0],
		toon: [0,1,0,0]
	},
	specularType:{
		none: [0,0,0,0],
		phong: [1,0,0,0],
		blinn: [0,1,0,0],
		toonP: [0,0,1,0],
		toonB: [0,0,0,1]
	}
}

function valType(gl) {
	var v = valTypeDecoder[this.pHTML][document.getElementById(this.pHTML).value];
	gl.uniform4f(program[this.pGLSL+"Uniform"], v[0], v[1], v[2], v[3]);
}


unifParArray =[
	new unifPar("LAlightColor","LAlightColor", valCol),
	new unifPar("LAPos","LAPos", valVec3),

	new unifPar("ambientLightColor","ambientLightColor", valCol),
	new unifPar("diffuseColor","diffuseColor", valCol),
	new unifPar("specularColor","specularColor", valCol),
	new unifPar("SpecShine","SpecShine", val),
	new unifPar("ambientMatColor","ambientMatColor", valCol),
	new unifPar("emitColor","emitColor", valCol),

	new unifPar("","pMatrix", noAutoSet),
	new unifPar("","wMatrix", noAutoSet),
	new unifPar("","eyePos", noAutoSet)
];

function setXwingMesh() {
	// Load mesh using the webgl-obj-loader library
	worldMesh = new OBJ.Mesh(xwingObjStr);
	
	// Create the textures
	imgtx = new Image();
	
	worldScale = 1.0;

	OBJ.initMeshBuffers(gl, worldMesh);
	
	document.getElementById("diffuseColor").value = "#dddd88";
	document.getElementById("ambientMatColor").value = "#dddd88";
	document.getElementById("my-canvas").style.backgroundColor = "#000033";
}

function setWorldMesh() {
	// Load mesh using the webgl-obj-loader library
	worldMesh = new OBJ.Mesh(worldObjStr);
	
	// Create the textures
	imgtx = new Image();
	
	worldScale = 1.0;

	OBJ.initMeshBuffers(gl, worldMesh);
	document.getElementById("diffuseColor").value = "#00ffff";
	document.getElementById("ambientMatColor").value = "#00ffff";
	document.getElementById("my-canvas").style.backgroundColor = "#000000";
}

function setHouseMesh() {
	// Load mesh using the webgl-obj-loader library
	worldMesh = new OBJ.Mesh(houseObjStr);
	
	// Create the textures
	imgtx = new Image();
	
	worldScale = 0.3;

	OBJ.initMeshBuffers(gl, worldMesh);
	document.getElementById("diffuseColor").value = "#ffffff";
	document.getElementById("ambientMatColor").value = "#ffffff";
	document.getElementById("my-canvas").style.backgroundColor = "#00aaaa";
}



// texture loader callback
//var textureLoaderCallback = function() {
//	var textureId = gl.createTexture();
//	gl.activeTexture(gl.TEXTURE0 + this.txNum);
//	gl.bindTexture(gl.TEXTURE_2D, textureId);		
//	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);		
//
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
//}

function setShader() {
	// Compile and link shaders
	program = gl.createProgram();
	var v1 = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(v1, ShadersCode[curr_Shader * 2]);
	gl.compileShader(v1);
	if (!gl.getShaderParameter(v1, gl.COMPILE_STATUS)) {
		alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(v1));
	}
//console.log(fs1 + ShadersCode[curr_Shader] + fs2);
	var v2 = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(v2, ShadersCode[curr_Shader * 2 + 1])
	gl.compileShader(v2);		
	if (!gl.getShaderParameter(v2, gl.COMPILE_STATUS)) {
		alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(v2));
	}			
	gl.attachShader(program, v1);
	gl.attachShader(program, v2);
	gl.linkProgram(program);				
	
	gl.useProgram(program);
	
	// links mesh attributes to shader attributes
	program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);
	 
	program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
	gl.enableVertexAttribArray(program.vertexNormalAttribute);
	 
//	program.textureCoordAttribute = gl.getAttribLocation(program, "in_uv");
//	gl.enableVertexAttribArray(program.textureCoordAttribute);

	for(var i = 0; i < unifParArray.length; i++) {
		program[unifParArray[i].pGLSL+"Uniform"] = gl.getUniformLocation(program, unifParArray[i].pGLSL);
	}
}

// The real app starts here
function main(){
	ShadersCode = shaders();
	resetShaderParams();
	
	// setup everything else
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	window.addEventListener("keyup", keyFunctionUp, false);
	window.addEventListener("keydown", keyFunctionDown, false);
	window.onresize = doResize;
	canvas.width  = window.innerWidth-16;
	canvas.height = window.innerHeight-280;
	
	try{
		gl= canvas.getContext("webgl2");
	} catch(e){
		console.log(e);
	}
	
		
	if(gl){
		curr_Shader = -1;
		ChangeShader(1);

		setWorldMesh();
						
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		perspectiveMatrix = utils.MakePerspective(60, w/h, 0.1, 1000.0);
		
	 // turn on depth testing
	    gl.enable(gl.DEPTH_TEST);
	
	
		// algin the skybox with the light
		gLightDir = [-1.0, 0.0, 0.0, 0.0];
		skyboxWM = utils.MakeRotateYMatrix(135);
		gLightDir = utils.multiplyMatrixVector(skyboxWM, gLightDir);
	
		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}
}

function drawScene() {
	// update WV matrix
	
	angle = angle + rvy;
	elevation = elevation + rvx;
	
	cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cy = lookRadius * Math.sin(utils.degToRad(-elevation));
	viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);

		// Magic for moving the car
		worldMatrix = utils.MakeScaleMatrix(worldScale);

		projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);		

		
		// draws the request
		gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, worldMesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
//	    gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.textureBuffer);
//	    gl.vertexAttribPointer(program.textureCoordAttribute, worldMesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.normalBuffer);
		gl.vertexAttribPointer(program.vertexNormalAttribute, worldMesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldMesh.indexBuffer);		

//		gl.uniform1i(program.u_textureUniform, 0);
		gl.uniform3f(program.eyePosUniform, cx, cy, cz);
		WVPmatrix = utils.multiplyMatrices(projectionMatrix, worldMatrix);
		gl.uniformMatrix4fv(program.pMatrixUniform, gl.FALSE, utils.transposeMatrix(WVPmatrix));
		gl.uniformMatrix4fv(program.wMatrixUniform, gl.FALSE, utils.transposeMatrix(worldMatrix));
		
		for(var i = 0; i < unifParArray.length; i++) {
			unifParArray[i].type(gl);
		}

		
		gl.drawElements(gl.TRIANGLES, worldMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		window.requestAnimationFrame(drawScene);		
}