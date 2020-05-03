function perspective() {
	// Build a perspective projection matrix, for a 16/9 viewport, with fov-y=90, near plane n=0.1, and far plane f=100.
//	out = utils.MakePerspective(90, 16/9, 0.001 ,  10000.0);	// not yet Z fighting
	out = utils.MakePerspective(90, 16/9, 0.00001, 1000000.0);	// Z fighting

	return out;
}

