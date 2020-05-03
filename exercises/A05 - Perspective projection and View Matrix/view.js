
function view(cx, cy, cz, alpha, beta, rho) {
	// Create a view matrix for a camera in position cx, cy and cz, looking in the direction specified by
	// alpha, beta and rho, as outlined in the course slides.
	
	
	var u = [0, 1, 0];
	
	var Vz_norm = norm(cx - alpha, cy - beta, cz - rho);
	console.log(Vz_norm)
	var Vz = [(cx - alpha) / Vz_norm,
			  (cy - beta) / Vz_norm,
			  (cz - rho) / Vz_norm];
	
	var u_x_Vz = crossProduct(u, Vz);
	var u_x_Vz_norm = norm(u_x_Vz);
	var Vx = [u_x_Vz[0] / u_x_Vz_norm[0],
			  u_x_Vz[1] / u_x_Vz_norm[1],
			  u_x_Vz[2] / u_x_Vz_norm[2]];
	
	var Vy = crossProduct(Vz, Vx);
	//console.log(Vz);
	
	var out = 	[	Vx[0], Vy[0], Vz[0], cx,
				 	Vx[1], Vy[1], Vz[1], cy,
					Vx[2], Vy[2], Vz[2], cz,
					  0.0,   0.0,   0.0, 1 ]; 
	
	return out;
	
}
	
function crossProduct(v1, v2) {
	results =  	[v1[1] * v2[2] - v1[2] * v2[1],
				 v1[2] * v2[0] - v1[0] * v2[2],
				 v1[0] * v2[1] - v1[1] * v2[0]];

	return results;
}

function norm(v){
	return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
}
