function perspective(w, h, fov) {

	var half_fov_tan = Math.tan(utils.degToRad(fov/2));
	var n = 0.1;
	var f = 100;
	var a = w/h;

	// Build a perspective projection matrix, for a viewport whose size is determined by parameters w (width) and h (height), and whose fov-y is passed in parameter fov. Near plane is n=0.1, and far plane f=100.
	var out = [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	out[0] = 1 / (a * half_fov_tan);
	out[5] = 1 / half_fov_tan;
	out[10] = (f + n)/(n - f);
	out[11] = (2 * f * n)/(n - f);
	out[14] = -1;
	return out;
}

