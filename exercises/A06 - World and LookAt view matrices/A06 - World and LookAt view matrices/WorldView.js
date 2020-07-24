function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, camdir contains the rotation about the y-axis to orient the car

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.

	var world = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	var view  = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

/* 	COMPUTATION FOR THE VIEW MATRIX */

	var u = [0,1,0];					// up-vector

	var c_minus_a = [(camx-carx),(camy-cary),(camz-carz)];

	var vz = utils.normalizeVector3(c_minus_a);		// vz is the normalized vector c_minus_a
	var vx = utils.normalizeVector3(utils.crossVector(u,vz));	// vx is the normalized cross vector between up_vector and vz
	var vy = utils.crossVector(vz,vx);		// vy is the cross vector between vz and vx

	cameraMatrix = [vx[0], vy[0], vz[0], camx,
			vx[1], vy[1], vz[1], camy,
			vx[2], vy[2], vz[2], camz,
			0,		0,		0,		1
					];
	// as usual, the viewMatrix is the inverse of the cameraMatrix
	viewMatrix = utils.invertMatrix(cameraMatrix);

 /*		COMPUTATION FOR THE WORLD MATRIX */

	// world matrix is computed by translateMatrix * Yaw(y) * Pitch(x) * Roll(z)
	// we only have Yaw, rotation over the Y-axis
	world = utils.multiplyMatrices(utils.MakeTranslateMatrix(carx,cary,carz),utils.MakeRotateYMatrix(cardir));
	return [world, viewMatrix];
}
