function buildGeometry() {
	var i;

	// Draws a pyramid --- Already done, just for inspiration
	var vert1 = [[0.0,1.0,0.0],[ 1.0,-1.0,-1.0],[-1.0,-1.0,-1.0],
				 [0.0,1.0,0.0],[ 1.0,-1.0, 1.0],[ 1.0,-1.0,-1.0],
				 [0.0,1.0,0.0],[-1.0,-1.0, 1.0],[ 1.0,-1.0, 1.0],
				 [0.0,1.0,0.0],[-1.0,-1.0,-1.0],[-1.0,-1.0, 1.0],
				 [-1.0,-1.0,-1.0],[1.0,-1.0,-1.0], [1.0,-1.0,1.0], [-1.0,-1.0,1.0],
				];
	var norm1 = [[0.0, 0.4472,-0.8944], [0.0, 0.4472,-0.8944], [0.0, 0.4472,-0.8944],
				 [ 0.8944, 0.4472,0.0], [ 0.8944, 0.4472,0.0], [ 0.8944, 0.4472,0.0],
				 [ 0.0, 0.4472,0.8944], [ 0.0, 0.4472,0.8944], [ 0.0, 0.4472,0.8944],
				 [-0.8944, 0.4472,0.0], [-0.8944, 0.4472,0.0], [-0.8944, 0.4472,0.0],
				 [ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0],[ 0.0,-1.0,0.0]
				 ];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	addMesh(vert1, norm1, ind1, color1);

	// Draws a cube -- To do for the assignment.
	var vert2 = [					// Vertex #:
		 [1.0, 1.0,-1.0], 	//  0
		 [1.0,-1.0,-1.0],  //  1
		[-1.0, 1.0,-1.0],  //  2
		 [1.0, 1.0, 1.0],  //  3
		[-1.0, 1.0, 1.0],  //  4
		 [1.0,-1.0, 1.0],  //  5
		 [1.0, 1.0,-1.0],  //  6
		 [1.0, 1.0, 1.0],  //  7
		 [1.0,-1.0,-1.0],  //  8
		 [1.0,-1.0,-1.0],  //  9
		 [1.0,-1.0, 1.0],  // 10
		[-1.0,-1.0,-1.0],  // 11
		[-1.0,-1.0,-1.0],  // 12
		[-1.0,-1.0, 1.0],  // 13
		[-1.0, 1.0,-1.0],  // 14
		 [1.0, 1.0, 1.0],  // 15
		 [1.0, 1.0,-1.0],  // 16
		[-1.0, 1.0, 1.0],  // 17
		[-1.0,-1.0,-1.0],  // 18
		[-1.0,-1.0, 1.0],  // 19
		 [1.0,-1.0, 1.0],  // 20
		[-1.0,-1.0, 1.0],  // 21
		[-1.0, 1.0, 1.0],  // 22
		[-1.0, 1.0,-1.0]   // 23
	];
	var norm2 = [					// Vertex #:
		 [0.0, 0.0, -1.0], 	//  0
		 [0.0,0.0, -1.0],  //  1
		[0.0, 0.0,-1.0],  //  2
		 [0.0, 0.0, 1.0],  //  3
		[0.0, 0.0, 1.0],  //  4
		 [0.0,0.0, 1.0],  //  5
		 [1.0, 0.0, 0.0],  //  6
		 [1.0, 0.0, 0.0],  //  7
		 [1.0,0.0,0.0],  //  8
		 [0.0,-1.0,0.0],  //  9
		 [0.0,-1.0, 0.0],  // 10
		[0.0,-1.0,0.0],  // 11
		[-1.0,0.0, 0.0],  // 12
		[-1.0,0.0, 0.0],  // 13
		[-1.0, 0.0,0.0],  // 14
		 [0.0, 1.0, 0.0],  // 15
		 [0.0, 1.0, 0.0],  // 16
		[0.0, 1.0, 0.0],  // 17
		[0.0,0.0,-1.0],  // 18
		[0.0,0.0, 1.0],  // 19
		 [1.0, 0.0, 0.0],  // 20
		[0.0,-1.0, 0.0],  // 21
		[-1.0, 0.0, 0.0],  // 22
		[0.0, 1.0,0.0]   // 23
	];
	var ind2 = [ 	// Face #:
			//f1 (z norm)
		  0,  1,  2,	//  0
		  1, 18,  2,    //  1
			//-------
			//f3 (z norm)
			3,  4,  5,    //  2
		  4, 19,  5,    //  3
			//-------
			//f2 (x norm)
		  6,  7,  8,    //  4
		  7, 20,  8,    //  5
			//-------
			//f4 (y norm)
		  9, 10, 11,    //  6
		 10, 21, 11,    //  7
		 //--------
		 //f5 (x norm)
		 12, 13, 14,    //  8
		 13, 22, 14,    //  9
		 //------------
		 // f6 (y norm)
		 15, 16, 17,    // 10
		 16, 23, 17     // 11
	];
	var color2 = [0.0, 1.0, 1.0];
	addMesh(vert2, norm2, ind2, color2);

	// Draws a Cylinder --- Already done, just for inspiration
	///// Creates vertices
	var vert3 = [[0.0, 1.0, 0.0]];
	var norm3 = [[0.0, 1.0, 0.0]];
	for(i = 0; i < 36; i++) {
		vert3[i+1] = [Math.sin(i*10.0/180.0*Math.PI), 1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+1] = [0.0, 1.0, 0.0];
		vert3[i+37] = [Math.sin(i*10.0/180.0*Math.PI), 1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+37] = [Math.sin(i*10.0/180.0*Math.PI), 0.0, Math.cos(i*10.0/180.0*Math.PI)];
		vert3[i+73] = [Math.sin(i*10.0/180.0*Math.PI),-1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+73] = [Math.sin(i*10.0/180.0*Math.PI), 0.0, Math.cos(i*10.0/180.0*Math.PI)];
		vert3[i+109] = [Math.sin(i*10.0/180.0*Math.PI),-1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm3[i+109] = [0.0, -1.0, 0.0];
	}
	vert3[145] = [0.0, -1.0, 0.0];
	norm3[145] = [0.0, -1.0, 0.0];
	////// Creates indices
	var ind3 = [];
	//////// Upper part
	j = 0;
	for(i = 0; i < 36; i++) {
		ind3[j++] = 0;
		ind3[j++] = i + 1;
		ind3[j++] = (i + 1) % 36 + 1;
	}
	//////// Lower part
	for(i = 0; i < 36; i++) {
		ind3[j++] = 145;
		ind3[j++] = (i + 1) % 36 + 109;
		ind3[j++] = i + 109;
	}
	//////// Mid part
	for(i = 0; i < 36; i++) {
		ind3[j++] = i + 73;
		ind3[j++] = (i + 1) % 36 + 37;
		ind3[j++] = i + 37;

		ind3[j++] = (i + 1) % 36 + 37;
		ind3[j++] = i + 73;
		ind3[j++] = (i + 1) % 36 + 73;
	}
	var color3 = [1.0, 0.0, 1.0];
	addMesh(vert3, norm3, ind3, color3);


	// Draws a Cone -- To do for the assignment.
	var vert4 = [];
	var norm4 = [];

	for(i = 0; i < 36; i++) {
		//tip replicas for each normals to lateral surfaces
		vert4[i] = [0.0, 1.0, 0.0];
		norm4[i] = [Math.sin(i*10.0/180.0*Math.PI), Math.sin(Math.PI/3), Math.cos(i*10.0/180.0*Math.PI)];
		//bottom circle vertices and lateral surfaces norm
		vert4[i+36] = [Math.sin(i*10.0/180.0*Math.PI), -1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm4[i+36] = [Math.sin(i*10.0/180.0*Math.PI), Math.sin(Math.PI/3), Math.cos(i*10.0/180.0*Math.PI)];
		// bottom circle vertices replica for normals to bottom surface
		vert4[i+72] = [Math.sin(i*10.0/180.0*Math.PI), -1.0, Math.cos(i*10.0/180.0*Math.PI)];
		norm4[i+72] = [0.0, -1.0, 0.0];
	}

	vert4[108] = [0.0, -1.0, 0.0]; //bottom circle's center
	norm4[108] =[0.0,-1.0,0.0];
	////// Creates indices
	var ind4 = [];
	//////// Upper part
	j = 0;
	for(i = 0; i < 36; i++) {
		ind4[j++] = 0;
		ind4[j++] = i + 36;
		ind4[j++] = (i + 1) % 36 + 36; // back to vert4[36]
	}
	//////// Lower part
	for(i = 0; i < 36; i++) {
		ind4[j++] = 108;
		ind4[j++] = (i + 1) % 36 + 72; // back to vert4[72]
		ind4[j++] = i + 72;
	}

	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, norm4, ind4, color4);

	// Draws a Sphere --- Already done, just for inspiration
	var vert5 = [[0.0, 1.0,0.0]];
	var norm5 = [[0.0, 1.0,0.0]];
	///// Creates vertices
	k = 1;
	for(j = 1; j < 18; j++) {
		for(i = 0; i < 36; i++) {
			x = Math.sin(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			y = Math.cos(j*10.0/180.0*Math.PI);
			z = Math.cos(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			norm5[k] = [x, y, z];
			vert5[k++] = [x, y, z];
		}
	}
	lastVert = k;
	norm5[k] = [0.0,-1.0,0.0];
	vert5[k++] = [0.0,-1.0,0.0];

	////// Creates indices
	var ind5 = [];
	k = 0;
	///////// Lateral part
	for(i = 0; i < 36; i++) {
		for(j = 1; j < 17; j++) {
			ind5[k++] = i + (j-1) * 36 + 1;
			ind5[k++] = i + j * 36 + 1;
			ind5[k++] = (i + 1) % 36 + (j-1) * 36 + 1;

			ind5[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
			ind5[k++] = i + j * 36 + 1;
			ind5[k++] = (i + 1) % 36 + j * 36 + 1;
		}
	}
	//////// Upper Cap
	for(i = 0; i < 36; i++) {
		ind5[k++] = 0;
		ind5[k++] = i + 1;
		ind5[k++] = (i + 1) % 36 + 1;
	}
	//////// Lower Cap
	for(i = 0; i < 36; i++) {
		ind5[k++] = lastVert;
		ind5[k++] = (i + 1) % 36 + 541;
		ind5[k++] = i + 541;
	}
	var color5 = [0.4, 0.2, 0.0];
	addMesh(vert5, norm5, ind5, color5);

	// Draws a Torus -- To do for the assignment.
	var vert6 = [[0.0,0.0,0.0]]; // centro del toroide
	var norm6 = [[0.0,0.0,0.0]];

	///// Creates vertices
	k = 1;
	for(j = 0; j < 36; j++) {
		for(i = 0; i < 36; i++) {
			// torus equation, YZX order
			z = (1 + 0.4*Math.cos(j*10.0/180.0*Math.PI)) * Math.cos(i*10.0/180.0*Math.PI);
			x = (1 + 0.4*Math.cos(j*10.0/180.0*Math.PI)) * Math.sin(i*10.0/180.0*Math.PI);
			y = 0.4*Math.sin(j*10.0/180.0*Math.PI);
			//torus normals equation
			norm6[k] = [Math.cos(j*10.0/180.0*Math.PI)* Math.sin(i*10.0/180.0*Math.PI), Math.sin(j*10.0/180.0*Math.PI), Math.cos(j*10.0/180.0*Math.PI)*Math.cos(i*10.0/180.0*Math.PI)];
			vert6[k++] = [x, y, z];
		}
	}

	////// Creates indices
	var ind6 = [];
	k = 0;
	/// frontside of the torus
	for(i = 0; i < 36; i++) {
		for(j = 0; j < 36; j++) {
			if (j==0) {	// connects properly points belonging to the first horizontal ring to the last horizontal ring
				ind6[k++] = i + j * 36 + 1;
				ind6[k++] = i + (35) * 36 + 1;
				ind6[k++] = (i + 1) % 36 + (35) * 36 + 1;

				ind6[k++] = i + j * 36 + 1;
				ind6[k++] = (i + 1) % 36 + (35) * 36 + 1;
				ind6[k++] = (i + 1) % 36 + j * 36 + 1;

			}
			else{
			ind6[k++] = i + j * 36 + 1;
			ind6[k++] = i + (j-1) * 36 + 1;
			ind6[k++] = (i + 1) % 36 + (j-1) * 36 + 1;

			ind6[k++] = i + j * 36 + 1;
			ind6[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
			ind6[k++] = (i + 1) % 36 + j * 36 + 1;
			}
		}
	}
	var color6 = [0.2, 0.3, 0.7];
	addMesh(vert6, norm6, ind6, color6);
}
