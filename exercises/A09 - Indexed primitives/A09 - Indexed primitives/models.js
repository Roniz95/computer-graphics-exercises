function buildGeometry() {
	var i;

	// Draws a Cone --- Already done, just for inspiration
	///// Creates vertices
	var vert1 = [[0.0, 1.0, 0.0]];
	for(i = 0; i < 36; i++) {
		vert1[i+1] = [Math.sin(i*10.0/180.0*Math.PI), -1.0, Math.cos(i*10.0/180.0*Math.PI)];
	}
	vert1[37] = [0.0, -1.0, 0.0]
	////// Creates indices
	var ind1 = [];
	//////// Upper part
	j = 0;
	for(i = 0; i < 36; i++) {
		ind1[j++] = 0;
		ind1[j++] = i + 1;
		ind1[j++] = (i + 1) % 36 + 1;
	}
	//////// Lower part
	for(i = 0; i < 36; i++) {
		ind1[j++] = 37;
		ind1[j++] = (i + 1) % 36 + 1;
		ind1[j++] = i + 1;
	}

	var color1 = [1.0, 0.0, 0.0];
	addMesh(vert1, ind1, color1);

//-----------------------------------------------------------------------

	// Draws a Cylinder -- To do for the assignment.

	///// Creates vertices
	var vert2 = [[0.0, 1.0, 0.0]];  // center of upper disk

	//lower circle vertices
	for(i = 0; i < 36; i++) {
		vert2[i+1] = [Math.sin(i*10.0/180.0*Math.PI), -1.0, Math.cos(i*10.0/180.0*Math.PI)];
	}

	vert2[37] = [0.0, -1.0, 0.0];  // center of lower disk

	//upper circle vertices
	vert2[37] = [0.0, -1.0, 0.0]
	for(i = 37; i < 73; i++) {
		vert2[i+1] = [Math.sin(i*10.0/180.0*Math.PI), 1.0, Math.cos(i*10.0/180.0*Math.PI)];
	}

	////// Creates indices
	var ind2 = [];
	j = 0;

	// ------------   Cylinder border
	// for each point of the upper disk, take two point of the lower disk
	for(i = 0; i < 36; i++) {
		ind2[j++] = (i + 1) % 36 + 1; // lower disk next point
		ind2[j++] = (i%36 + 38)  ; // upper disk
		ind2[j++] = (i%36 + 1); // lower disk point
	}

	// for each point of the lower disk, take two points of the upper disk
	for(i = 0; i < 36; i++) {
		ind2[j++] = (i%36 + 38) ; // upper disk current point
		ind2[j++] = (i + 1) % 36 + 1; // lower disk current point
		ind2[j++] = (i + 1) % 36 + 38; // upper disk next point
	}
	// ------------

	// Top circle
	for(i = 0; i < 36; i++) {
		ind2[j++] = 0; // (0,1,0) center of upper disk
		ind2[j++] = (i + 38) ; // upper disk
		ind2[j++] = (i + 1) % 36 + 38 ; // next upper disk point
	}

	// Lower circle
	for(i = 0; i < 36; i++) {
		ind2[j++] = (i + 1); //  upper disk point
		ind2[j++] = 37; // (0,-1,0) center of lower disk
		ind2[j++] = (i + 1) % 36 + 1; // next upper disk point
	}


	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);

//-------------------------------------------------------------------------------------

	// Draws a Sphere --- Already done, just for inspiration
	var vert3 = [[0.0, 1.0,0.0]];  // center of the upper circle on top
	///// Creates vertices
	k = 1;
	for(j = 1; j < 18; j++) {
		for(i = 0; i < 36; i++) {
			x = Math.sin(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			y = Math.cos(j*10.0/180.0*Math.PI);
			z = Math.cos(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
			vert3[k++] = [x, y, z];
		}
	}

	vert3[k++] = [0.0,-1.0,0.0]; // center of the lower circle on bottom

	////// Creates indices
	var ind3 = [];
	k = 0;
	///////// Lateral part
	for(i = 0; i < 36; i++) {
		for(j = 1; j < 17; j++) {
			ind3[k++] = i + (j-1) * 36 + 1;
			ind3[k++] = i + j * 36 + 1;
			ind3[k++] = (i + 1) % 36 + (j-1) * 36 + 1;

			ind3[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
			ind3[k++] = i + j * 36 + 1;
			ind3[k++] = (i + 1) % 36 + j * 36 + 1;
		}
	}
	//////// Upper Cap
	for(i = 0; i < 36; i++) {
		ind3[k++] = 0;
		ind3[k++] = i + 1;
		ind3[k++] = (i + 1) % 36 + 1;
	}
	//////// Lower Cap
	for(i = 0; i < 36; i++) {
		ind3[k++] = 577;
		ind3[k++] = (i + 1) % 36 + 540;
		ind3[k++] = i + 540;
	}

	var color3 = [0.0, 1.0, 0.0];
	addMesh(vert3, ind3, color3);


	// Draws a Torus -- To do for the assignment
	var vert4 = [[0.0, 0.0, 0.0]];  // center of the torus

	// 1 = distance of the tube's center from the torus center
	// 0.4 = radius of the tube

	///// Creates vertices
	k = 1;
	for(j = 0; j < 36; j++) {
		for(i = 0; i < 36; i++) {
			// torus equation, YZX order
			z = (1 + 0.4*Math.cos(j*10.0/180.0*Math.PI)) * Math.cos(i*10.0/180.0*Math.PI);
			x = (1 + 0.4*Math.cos(j*10.0/180.0*Math.PI)) * Math.sin(i*10.0/180.0*Math.PI);
			y = 0.4*Math.sin(j*10.0/180.0*Math.PI);
			vert4[k++] = [x, y, z];
		}
	}
	////// Creates indices
	var ind4 = [];
	k = 0;

	/// frontside of the torus
	for(i = 0; i < 36; i++) {
		for(j = 0; j < 36; j++) {
			if (j==0) {	// connects properly points belonging to the first horizontal ring to the last horizontal ring
				ind4[k++] = i + j * 36 + 1;
				ind4[k++] = i + (35) * 36 + 1;
				ind4[k++] = (i + 1) % 36 + (35) * 36 + 1;

				ind4[k++] = i + j * 36 + 1;
				ind4[k++] = (i + 1) % 36 + (35) * 36 + 1;
				ind4[k++] = (i + 1) % 36 + j * 36 + 1;

			}
			else{


			ind4[k++] = i + j * 36 + 1;
			ind4[k++] = i + (j-1) * 36 + 1;
			ind4[k++] = (i + 1) % 36 + (j-1) * 36 + 1;

			ind4[k++] = i + j * 36 + 1;
			ind4[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
			ind4[k++] = (i + 1) % 36 + j * 36 + 1;
			}
		}
	}

	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, ind4, color4);
}
