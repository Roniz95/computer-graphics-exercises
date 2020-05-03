// these global variables are used to contain the current angles of the world
// HERE YOU WILL HAVE TO ADD ONE OR MORE GLOBAL VARIABLES TO CONTAIN THE ORIENTATION





// OF THE OBJECT
var x_wing_orientation = new Quaternion();


// this function returns the world matrix with the updated rotations.

// parameters rvx, rvy and rvz contains a value in the -1 .. +1 range that tells the angular velocity of the world.
function updateWorld(rvx, rvy, rvz) {
	// compute the rotation matrix
	var alpha = 3*(rvx / 180 * Math.PI);
	var beta = 3*(rvy / 180 * Math.PI);
	var gamma = 3*(rvz / 180 * Math.PI);

	var x_deltaQ = new Quaternion(Math.cos(alpha / 2), Math.sin(alpha / 2), 0, 0);
	var y_deltaQ = new Quaternion(Math.cos(beta / 2), 0, Math.sin(beta / 2), 0);
	var z_deltaQ = new Quaternion(Math.cos(gamma / 2), 0, 0, Math.sin(gamma / 2));
	
	var rot = y_deltaQ.mul(x_deltaQ).mul(z_deltaQ).mul(x_wing_orientation);
	x_wing_orientation = y_deltaQ.mul(x_deltaQ).mul(z_deltaQ).mul(x_wing_orientation);
	
	return rot.toMatrix4();
}

//We can encode a composition of Rotation as the products of the quaternions representing the rotation 
// R = Ry*Rx*Rz = q1*q2*q3   remember that you need to always multiply on the left so for example
//if q is the starting quaternion and Dq the trasformation, then q' = Dq * q

//to perform a rotation of G degrees around vector direction  q = (x, y, z),
//we encode the quaternion as Dq = cos(G/2) + sin(G/2) * (x, y, z)
//then we perform q' = Dq * q