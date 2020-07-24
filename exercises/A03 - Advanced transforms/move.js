function move() {
	// Rotate 45 degrees around an arbitrary axis passing through (1,0,-1). The x-axis can be aligned to the arbitrary axis after a rotation of 30 degrees around the z-axis, and then -60 degrees around the y-axis.
	var R1 =[1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	R1= utils.multiplyMatrices((utils.MakeTranslateMatrix(-1,0,1)),R1);
	R1= utils.multiplyMatrices((utils.invertMatrix(utils.MakeRotateYMatrix(-60))),R1);
	R1= utils.multiplyMatrices((utils.invertMatrix(utils.MakeRotateZMatrix(30))),R1);
	R1= utils.multiplyMatrices((utils.MakeRotateXMatrix(45)),R1);
	R1= utils.multiplyMatrices((utils.MakeRotateZMatrix(30)),R1);
	R1= utils.multiplyMatrices((utils.MakeRotateYMatrix(-60)),R1);
	R1= utils.multiplyMatrices((utils.MakeTranslateMatrix(1,0,-1)),R1);
	// Half the size of an object, using as fixed point (5,0,-2)
	var S1 = [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	S1= utils.multiplyMatrices((utils.invertMatrix(utils.MakeTranslateMatrix(5,0,-2))),S1);
	S1= utils.multiplyMatrices(utils.MakeScaleMatrix(0.5),S1);
	S1= utils.multiplyMatrices((utils.MakeTranslateMatrix(5,0,-2)),S1);

	// Mirror the starship along a plane passing through (1,1,1), and obtained rotating 15 degree around the x axis the xz plane
	var S2 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];

S2= utils.multiplyMatrices(utils.MakeTranslateMatrix(-1,-1,-1),S2);
S2= utils.multiplyMatrices(utils.MakeRotateXMatrix(-15),S2);
S2= utils.multiplyMatrices(utils.MakeScaleNuMatrix(1, -1, 1),S2);		// this is the mirroring
S2= utils.multiplyMatrices(utils.MakeRotateXMatrix(15),S2);
S2= utils.multiplyMatrices((utils.MakeTranslateMatrix(1,1,1)),S2);
	// Apply the inverse of the following sequence of transforms: Translation of (0, 0, 5) then rotation of 30 degree around the Y axis, and finally a uniform scaling of a factor of 3.
	var I1 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	I1 = utils.multiplyMatrices((utils.invertMatrix(utils.MakeScaleMatrix(3))),I1);
	I1 = utils.multiplyMatrices((utils.invertMatrix(utils.MakeRotateYMatrix(30))),I1);
	I1 = utils.multiplyMatrices((utils.invertMatrix(utils.MakeTranslateMatrix(0,0,5))),I1);


	return [R1, S1, S2, I1];
}
