function parallel() {
	// Build a parallel projection matrix, for a 16/9 viewport, with halfwidt w=40, near plane n=1, and far plane f=101.

	var a = 16/9;
	var w = 40;
	var n = 1;
	var f = 101;
	
	var out = [1.0/w,	0.0,		0.0,		0.0,
			   0.0,		a/w,		0.0,		0.0,
			   0.0,		0.0,	   2/(n-f),		(n+f)/(n-f),
			   0.0,		0.0,		0.0,		1.0];

	return out;
}

