function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, cardir contains the rotation about the y-axis to orient the car

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.
	var view  = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	var world = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

//view Matrix
	//Vz
	var k = [camx - carx, camy - cary, camz - carz] //c-a
	var Vz = utils.normalizeVector3(k)

	//Vx
	var u = [0, 1, 0]
	var k2= utils.crossVector(u, Vz)
	var Vx = utils.normalizeVector3(k2)

	//Vy
	var Vy = utils.crossVector(Vz, Vx)
	

	//camera matrix (Mc) and view matrix (Mv)
	var Mc = []
	var c = [camx, camy, camz]
	for(i = 0; i < 3; i++) {
		Mc = Mc.concat([Vx[i], Vy[i], Vz[i], c[i]])
	}
	Mc = Mc.concat([0, 0, 0, 1])
	var view = utils.invertMatrix(Mc)
	
	//world matrix
	var Ry = utils.MakeRotateYMatrix(cardir)
	var Tr = utils.MakeTranslateMatrix(carx, cary, carz)

	
	
	world = utils.multiplyMatrices(Tr, Ry)
	
	
	

	return [world, view];
}

function crossProduct(v1, v2) {
	var results =  	[v1[1] * v2[2] - v1[2] * v2[1],
				 v1[2] * v2[0] - v1[0] * v2[2],
				 v1[0] * v2[1] - v1[1] * v2[0]];

	return results;
}

function chainedDotProduct(transformations) {
	composition = utils.identityMatrix();
	transformations.forEach(transf => {
		composition = utils.multiplyMatrices(composition, transf)
	});

	return composition;
}

function vectorDiff(v1, v2) {
	var result = [];
	for (i = 0; i < v1.length; i++) {
		result[i] = v1[i] - v2[i]
	}
	return result
}

function vectorDivConst(v1, k) {
	var result = []
	for (i = 0; i < v1.length; i++) {
		result[i] = v1[i] / k
	}
	return result 
}
