
function view(cx, cy, cz, alpha, beta, rho) {
	// Create a view matrix for a camera in position cx, cy and cz, looking in the direction specified by
	// alpha, beta and rho, as outlined in the course slides.
	var out =  [1.0,	0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,	    -50.0,
			   0.0,		0.0,		0.0,		1.0];

 var cameraMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(cx,cy,cz),utils.multiplyMatrices(utils.MakeRotateYMatrix(alpha),utils.multiplyMatrices(utils.MakeRotateZMatrix(rho),utils.MakeRotateXMatrix(beta))));
 var viewMatrix = utils.invertMatrix(cameraMatrix);
	return viewMatrix;

	// viewMatrix is the inverted cameraMatrix which is TranslateM * RotateX * RotateY * RotateZ
}
