function anim() {
	
	var q1 = Quaternion.fromAxisAngle([1,0,0],utils.degToRad(0));

	var q2 = q1.mul(Quaternion.fromAxisAngle([0,1,0],utils.degToRad(90)));

	var q3 = q2.mul(Quaternion.fromAxisAngle([0,0,1],utils.degToRad(90)));

	var q4 = q3.mul(Quaternion.fromAxisAngle([1,0,0],utils.degToRad(90)))
	.mul(Quaternion.fromAxisAngle([0,0,1],utils.degToRad(-90)));

	var q5 = q4.mul(Quaternion.fromAxisAngle([0,1,0],utils.degToRad(90)));

	var q6 = q5.mul(Quaternion.fromAxisAngle([0,0,1],utils.degToRad(-90)));

	return [
		//segment from A to B
 [1.5, [0,0,0],   q1,
 	 [2,0,2],   q1,
 	 [7,0,0],   q2,
 	 [8,0,0],  	q2],
	 //segment from B to C
 [1.5, [8,0,0],   q2,
	 [8,0,0],   q2,
 	 [8,0,-8],  q3,
 	 [8,0,-8],  q3],
	 //segment from C to D
 [1.5, [8,0,-8],  q3,
	 [10,0,-8],  q3,
 	 [8,8,-8],  q4,
 	 [8,8,-8],  q4],
	 //segment from D to E
 [1.5, [8,8,-8],  q4,
	 [6,8,-10],  q4,
 	 [2,8,-8],  q5,
 	 [0,8,-8],  q5],
	 //segment from E to F
 [1.5, [0,8,-8],  q5,
	 [0,8,-4],  q5,
 	 [0,8,0],  q6,
 	 [0,8,0],  q6],
	 //segment from F to A
 [1.5, [0,8,0],  q6,
	 [0,6,0],  q6,
 	 [0,2,0],   q1,
 	 [0,0,0],   q1]
];
}
