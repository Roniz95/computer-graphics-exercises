function perspective(w, h, fov) {
	// Build a perspective projection matrix, for a viewport whose size is determined by parameters w (width) and h (height), and whose fov-y is passed in parameter fov. Near plane is n=0.1, and far plane f=100.


	fov = utils.degToRad(fov) // convert fov in radiants
	var a = w / h; // aspect ratio
	var perspectiveMatr = [1 / (a * Math.tan(fov / 2)), 0.0, 0.0, 0.0,
							0.0, 1 / Math.tan(fov / 2), 0.0, 0.0,
							0.0, 0.0, (100 + 0.1) / (0.1 - 100), (2 * 100 * 0.1) / (0.1 - 100),
							0.0, 0.0, -1.0, 0.0];

	return perspectiveMatr;

}
