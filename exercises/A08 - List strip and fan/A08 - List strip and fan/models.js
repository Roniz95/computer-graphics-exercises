function buildGeometry() {
	var i;
	
	// Draws a cube (replace the vertices)
	var vert1 = [[0, 0, 0], [2, 0, 0], [0, 2, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], //back face
				 [2, 0, 0], [2, 2, 0], [2, 0, 2], [2, 2, 0], [2, 0, 2], [2, 2, 2],  //right face
				 [0, 2, 0], [2, 2, 0], [0, 2, 2], [0, 2, 2], [2, 2, 0], [2, 2, 2],  //top face
				 [0, 0, 0], [0, 0, 2], [0, 2, 0], [0, 0, 2], [0, 2, 0], [0, 2, 2],  //left face
				 [0, 0, 0], [0, 0, 2], [2, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2],  //down bottom face
				 [0, 0, 2], [2, 0, 2], [0, 2, 2], [0, 2, 2], [2, 2, 2], [2, 0, 2]


				 
			];
	
	

	addMesh(vert1, "L", [0.5, 0.0, 0.7]);


	//Draws a flat L-shaped pattern (replace the vertices)
	var vert2 = [[2, 4, 0], [0, 4, 0], [2, -4, 0], [0, -4, 0], [6, -3, 0], [6, -4, 0], [2, -3, 0], [2, -4, 0] ];

	addMesh(vert2, "S", [0.0, 0.0, 1.0]);


	//Draws a flat hexagon (replace the vertices)
	var vert3 = [[0, 0, 0], [-1, -2, 0], [1, -2, 0], [2, 0, 0], [1, 2, 0], [-1, 2, 0], [-2, 0, 0], [-1, -2, 0]
	];

	addMesh(vert3, "F", [0.0, 1.0, 0.0]);
	
}

