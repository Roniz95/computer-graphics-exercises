function move() {
	// Rotate 45 degrees around an arbitrary axis passing through (1,0,-1). 
	//The x-axis can be aligned to the arbitrary axis after a rotation of 30 
	//degrees around the z-axis, and then -60 degrees around the y-axis.

	var R1 =[1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];					   
	// Half the size of an object, using as fixed point (5,0,-2)
	var S1 = [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Mirror the starship along a plane passing through (1,1,1), and obtained rotating 15 degree around the x axis the xz plane
	var S2 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Apply the inverse of the following sequence of transforms: Translation of (0, 0, 5) then rotation of 30 degree around the Y axis, and finally a uniform scaling of a factor of 3.
	var I1 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
    //R1 transformations
	var T = utils.MakeTranslateMatrix(1, 0, -1);
	var T_inv = utils.invertMatrix(T);

	var Rz = utils.MakeRotateZMatrix(30);
	var Rz_inv = utils.invertMatrix(Rz);

	var Ry = utils.MakeRotateYMatrix(300);
	var Ry_inv = utils.invertMatrix(Ry);

	var Rx = utils.MakeRotateXMatrix(45);

	R1 = chainedDotProduct([T, Ry, Rz, Rx, Rz_inv, Ry_inv, T_inv]);
	

	//S1 transformation
	T_2 = utils.MakeTranslateMatrix(5, 0, 2);
	T_2_inv = utils.invertMatrix(T_2);

	S_2 = utils.MakeScaleMatrix(0.5);



	S1 = chainedDotProduct([T_2,S_2, T_2_inv ]);

	//S2 transformation
	T_3 = utils.MakeTranslateMatrix(1, 1, 1);
	T_3_inv = utils.invertMatrix(T_3);

	S_3 = utils.MakeScaleNuMatrix(1, -1, 1);

	Rx_3 = utils.MakeRotateXMatrix(15);
	Rx_3_inv = utils.invertMatrix(Rx_3);
	S2 = chainedDotProduct([T_3,Rx_3,S_3, Rx_3_inv, T_3_inv]);

	//S3 transformation
	T_4 = utils.MakeTranslateMatrix(0, 0, 5);
	T_4_inv = utils.invertMatrix(T_4);

	Ry_4 = utils.MakeRotateYMatrix(30);
	Ry_4_inv = utils.invertMatrix(Ry_4);

	S_4 = utils.MakeScaleMatrix(3);
	S_4_inv = utils.invertMatrix(S_4);

	I1 = chainedDotProduct([S_4_inv, Ry_4_inv, T_4_inv]);


	return [R1, S1, S2, I1];
}

//calculates the dot product for all the matrixes 4x4
//passed inside transformations, the dot product is applied sequentially.
//returns a composition matrix of 4x4
function chainedDotProduct(transformations) {
	composition = utils.identityMatrix();
	transformations.forEach(transf => {
		composition = utils.multiplyMatrices(composition, transf)
	});

	return composition;
}



