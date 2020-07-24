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






	// Draws a Cylinder -- To do for the assignment.

	//bottom circunference vertices
	var vert2 = [[0, 0, 0]];
	for(i = 0; i < 36; i++) {
		vert2[i+1] = [Math.sin(i*10.0/180.0*Math.PI), 0, Math.cos(i*10.0/180.0*Math.PI)];
	}

	//top circunference vertices
	vert2[37] = [0, 2, 0]
	for(i = 37; i < 73 ; i++) {
		vert2[i+1] = [Math.sin(i*10.0/180.0*Math.PI), 2, Math.cos(i*10.0/180.0*Math.PI)];
	}
	

	
	var ind2 = [];
	//bottom circunference indexes
	for(i = 0; i < 36; i++) {
		ind2[j++] = 0;
		ind2[j++] = (i + 1) % 36 + 1;
		ind2[j++] = i + 1;
	}
	
	//top circunferences indexes
	for(i = 37; i < 72  ; i++) {
		ind2[j++] = 37 ;
		ind2[j++] = (i + 1) % 36 + 38;
		ind2[j++] = i + 1;
	}

	
	for(i = 0; i < 36; i++) {
		ind2[j++] = i;
		ind2[j++] = i+1;
		ind2[j++] = i + 37;
		ind2[j++] = i + 37;
		ind2[j++] = i + 38;
		ind2[j++] = i + 2;
	}
	

	console.log(ind2);
	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);






	// Draws a Sphere --- Already done, just for inspiration
	var vert3 = [[0.0, 1.0,0.0]];
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
	vert3[k++] = [0.0,-1.0,0.0];
	
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
	var vert4 = [[-1.0,-1.0,0.0], [1.0,-1.0,0.0], [-1.0,1.0,0.0], [1.0,1.0,0.0]];
	var ind4 = [0, 1, 2,   1, 3, 2];
	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, ind4, color4);
}

