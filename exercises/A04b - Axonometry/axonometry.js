

function axonometry() {
	// Make an isometric view, w = 50, a = 16/9, n = 1, f = 101.
	
	var A1 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Make a dimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var A2 =  [1.0,	    0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Make a trimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis
	var A3 =  [0.05,	0.0,		0.0,		0.0,
			   0.0,		0.05,		0.0,		0.0,
			   0.0,		0.0,		0.05,		0.0,
			   0.0,		0.0,		0.0,		1.0];
			   
	// Make an cavalier projection view, w = 50, a = 16/9, n = 1, f = 101, at 45 degrees
	var O1 =  [0.05,	0.0,		0.0,		0.0,
			   0.0,		0.05,		0.0,		0.0,
			   0.0,		0.0,		0.05,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	// Make a cabinet projection view, w = 50, a = 16/9, n = 1, f = 101, at 60 degrees
	var O2 =  [0.05,	0.0,		0.0,		0.0,
			   0.0,		0.05,		0.0,		0.0,
			   0.0,		0.0,		0.05,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	
	
	
	//basic parallel projection matrix used in all the following
	//compositions
	var P = utils.MakeParallel(50, 16/9, 1, 101);

	//A1 = utils.MakeParallel(50, 16/9, 1, 101);

	//A1 composition, an Isometric projection is obtained by first
	//applying a rot of 45° around y axis followed by a rotation
	// of 35.26° around x axis

	var Ry_1 = utils.MakeRotateYMatrix(45);
	var Rx_1 = utils.MakeRotateXMatrix(35.26);

	

	A1 = chainedDotProduct([P, Rx_1, Ry_1]);
	

	//A2 composition, a dimetric projection is obtained by applying a
	//rotation of +-45° around the y axis followed by an arbitrary rot
	//of alpha around x-axis
	
	var Ry_2 = utils.MakeRotateYMatrix(45);
	var Rx_2 = utils.MakeRotateXMatrix(20);

	A2 = chainedDotProduct([P, Rx_2, Ry_2]);

	//A3 composition, a trimetric projection is obtained by applying a
	// an arbitrary rot of angle beta around the y-axis followed by 
	//an arbitrary rot of angle alpha around x-axis
	
	var Ry_3 = utils.MakeRotateYMatrix(-30);
	var Rx_3 = utils.MakeRotateXMatrix(30);

	A3 = chainedDotProduct([P, Rx_3, Ry_3]);

	//O1 composition, a cavalier projection is obtained by applying a
	//a shear with factor = 1 along the z-axis  before the orthogonal projection
	var cosine_4 = Math.cos(utils.degToRad(45));
	var sine_4 = Math.sin(utils.degToRad(45));

	var Sz_4 = utils.MakeShearZMatrix(cosine_4, sine_4)

	O1 = chainedDotProduct([P, Sz_4]);
	

	//O2 composition, a cabinet projection is obtained by applying a
	//shear along z-axis with factor = 0.5
	
	var cosine_5 = Math.cos(utils.degToRad(60));
	var sine_5 = Math.sin(utils.degToRad(60));

	var Sz_5 = utils.MakeShearZMatrix(cosine_5, sine_5);

	O2 = chainedDotProduct([P, Sz_5]);
	
	return [A1, A2, A3, O1, O2];
	
	
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