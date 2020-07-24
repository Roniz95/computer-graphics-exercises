function shaders() {
// The shader can find the required informations in the following variables:

//vec3 fs_pos;			// Position of the point in 3D space
//
//vec3 LAPos;			// Position of first (or single) light
//vec3 LADir;			// Direction of first (or single) light
//float LAConeOut;		// Outer cone (in degree) of the light (if spot)
//float LAConeIn;		// Inner cone (in percentage of the outher cone) of the light (if spot)
//float LADecay;		// Decay factor (0, 1 or 2)
//float LATarget;		// Target distance
//vec4 LAlightColor;	// color of the first light
//		
//vec3 LBPos;			// Same as above, but for the second light
//vec3 LBDir;
//float LBConeOut;
//float LBConeIn;
//float LBDecay;
//float LBTarget;
//vec4 LBlightColor;
//
//vec3 LCPos;			// Same as above, but for the third one
//vec3 LCDir;
//float LCConeOut;
//float LCConeIn;
//float LCDecay;
//float LCTarget;
//vec4 LClightColor;
//
//vec4 ambientLightColor;		// Ambient light color. For hemispheric, this is the color on the top
//vec4 ambientLightLowColor;	// For hemispheric ambient, this is the bottom color
//vec3 ADir;					// For hemispheric ambient, this is the up direction
//
//vec3 normalVec;				// direction of the normal vector to the surface
//
//
// Final direction and colors are returned into:
//vec3 lightDirA;
//vec3 lightDirB;
//vec3 lightDirC;
//
//and intensity is returned into:
//
//vec4 lightColorA;
//vec4 lightColorB;
//vec4 lightColorC;
//
// Ambient light contribution is returned into
//
// vec4 ambientColor;

// Single directional light
var S1 = `
	lightDirA = LADir;
	lightColorA = LAlightColor;
`;

// Single point light without decay
var S2 = `
	lightDirA = normalize(LAPos - fs_pos);
	lightColorA = LAlightColor;
`;

// Single directional light, constant ambient
var S3 = `
	lightDirA   = LADir;
	lightColorA = LAlightColor;
	ambientColor = ambientLightColor;
`;

// Single point light with decay
var S4 = `
	lightDirA   = normalize(LAPos - fs_pos);
	lightColorA = LAlightColor * pow(LATarget/length(LAPos - fs_pos),LADecay);
`;

// Single spot light (with decay)
var S5 = `
	lightDirA   = normalize(LAPos - fs_pos);
	lightColorA = LAlightColor * pow(LATarget/length(LAPos - fs_pos),LADecay) * clamp((dot(lightDirA,LADir)-cos(radians(LAConeOut)))/((cos(radians(LAConeIn*LAConeOut)))-(cos(radians(LAConeOut)))),0.0,1.0);
`;

// Single directional light, hemispheric ambient 
var S6 = `
	lightDirA   = LADir;
	lightColorA = LAlightColor;
	ambientColor = (((dot(ADir,normalVec)+1.0)/2.0 * ambientLightColor) + ((1.0-dot(ADir,normalVec))/2.0 * ambientLightLowColor));
`;

// Three lights: a directional, a point and a spot
var S7 = `
	lightDirA   = LADir;
	lightColorA = LAlightColor;

	lightDirB = normalize(LBPos - fs_pos);
	lightColorB = LBlightColor * pow(LBTarget/length(LBPos - fs_pos),LBDecay);

	lightDirC   = normalize(LCPos - fs_pos);
	lightColorC = LClightColor * pow(LCTarget/length(LCPos - fs_pos),LCDecay) * clamp((dot(lightDirC,LCDir)-cos(radians(LCConeOut)))/((cos(radians(LCConeIn*LCConeOut)))-(cos(radians(LCConeOut)))),0.0,1.0);
`;
	return [S1, S2, S3, S4, S5, S6, S7];
}

