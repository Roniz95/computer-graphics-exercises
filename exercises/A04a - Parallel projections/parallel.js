


function parallel() {
	// Build a parallel projection matrix, for a 16/9 viewport, with halfwidt w=40, near plane n=1, and far plane f=101.

	var a = 16/9;
	var w = 40;
	n = 1;
	f = 101;
	
	var out = [1/w,		0.0,		0.0,		0.0,
			   0.0,		a/w,		0.0,		0.0,
			   0.0,		0.0,		-2/(f-2),	-(f+n)/(f-n),
			   0.0,		0.0,		0.0,		1.0];



	return out;
}

