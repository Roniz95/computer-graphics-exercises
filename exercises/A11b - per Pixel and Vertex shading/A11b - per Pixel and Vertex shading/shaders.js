function shaders() {
	// The shader can find the required informations in the following variables:
	
	//uniform vec3 eyePos;				// viewer position
	//uniform vec3 LAPos;				// light position
	//uniform vec4 LAlightColor;		// light color
	//uniform vec4 ambientLightColor;	// ambient light color
	//uniform vec4 diffuseColor;		// diffuse light color
	//uniform vec4 specularColor;		// specular color
	//uniform float SpecShine;			// specular shine
	//uniform vec4 ambientMatColor;		// ambient mat colro
	//uniform vec4 emitColor;			// emit color
	
	
	
	// Per vertex - vertex shader -- already done, for reference
	var V1 = `#version 300 es
	#define POSITION_LOCATION 0
	#define NORMAL_LOCATION 1
	
	layout(location = POSITION_LOCATION) in vec3 in_pos;
	layout(location = NORMAL_LOCATION) in vec3 in_norm;
	
	// uniforms
	uniform vec3 eyePos;
	uniform vec3 LAPos;
	uniform vec4 LAlightColor;
	uniform vec4 ambientLightColor;
	uniform vec4 diffuseColor;
	uniform vec4 specularColor;
	uniform float SpecShine;
	uniform vec4 ambientMatColor;
	uniform vec4 emitColor;
	uniform mat4 pMatrix;
	
	out vec4 finalColor;
	
	void main() {
		vec3 Ldir = normalize(LAPos - in_pos);
		// diffuse
		vec4 diffuse = diffuseColor * max(dot(normalize(in_norm), Ldir), 0.0);
		// specular
		vec3 eyeDir = normalize(eyePos - in_pos);
		vec3 halfVec = normalize(eyeDir + Ldir);
		vec4 specular = specularColor * pow(max(dot(halfVec, in_norm),0.0),SpecShine);
		// ambient
		vec4 ambient = ambientLightColor * ambientMatColor;
		// final
		finalColor = clamp((diffuse + specular) * LAlightColor + ambient + emitColor, 0.0, 1.0);
	
		gl_Position = pMatrix * vec4(in_pos, 1.0);
	}
	`;
	
	// Per pixel - fragment shader -- already done, for reference
	var F1 = `#version 300 es
	precision highp float;
	
	// from the fragment shader
	in vec4 finalColor;
	
	out vec4 color;
	
	void main() {
		color = vec4(finalColor.rgb, 1.0);
	}
	`;
	
	
	
	
	
	
	
	
	
	
	
	// Per pixel - vertex shader -- already done, for reference
	var V2 = `#version 300 es
	#define POSITION_LOCATION 0
	#define NORMAL_LOCATION 1
	
	layout(location = POSITION_LOCATION) in vec3 in_pos;
	layout(location = NORMAL_LOCATION) in vec3 in_norm;
	
	uniform mat4 pMatrix;
	
	out vec3 fs_pos;
	out vec3 fs_norm;
	
	void main() {
		fs_pos = in_pos;
		fs_norm = in_norm;
	
		gl_Position = pMatrix * vec4(in_pos, 1.0);
	}
	`;
	
	// Per pixel - fragment shader -- already done, for reference
	var F2 = `#version 300 es
	precision highp float;
	
	// from the fragment shader
	in vec3 fs_pos;
	in vec3 fs_norm;
	
	// uniforms
	uniform vec3 eyePos;
	uniform vec3 LAPos;
	uniform vec4 LAlightColor;
	uniform vec4 ambientLightColor;
	uniform vec4 diffuseColor;
	uniform vec4 specularColor;
	uniform float SpecShine;
	uniform vec4 ambientMatColor;
	uniform vec4 emitColor;
	
	out vec4 color;
	
	void main() {
		vec3 norm = normalize(fs_norm);
		// light
		vec3 Ldir = normalize(LAPos - fs_pos);
		// diffuse
		vec4 diffuse = diffuseColor * max(dot(normalize(norm), Ldir), 0.0);
		// specular
		vec3 eyeDir = normalize(eyePos - fs_pos);
		vec3 halfVec = normalize(eyeDir + Ldir);
		vec4 specular = specularColor * pow(max(dot(halfVec, norm),0.0),SpecShine);
		// ambient
		vec4 ambient = ambientLightColor * ambientMatColor;
		// final
		vec4 finalColor = clamp((diffuse + specular) * LAlightColor + ambient + emitColor, 0.0, 1.0);
	
		color = vec4(finalColor.rgb, 1.0);
	}
	`;
	
	
	
	
	
	
	
	
	
	
	// Light per vertex, diffuse and specular per pixel - vertex shader -- to do
	var V3 = `#version 300 es
	#define POSITION_LOCATION 0
	#define NORMAL_LOCATION 1
	
	//gets attrib *_LOCATION and puts it into in_*
	layout(location = POSITION_LOCATION) in vec3 in_pos;
	layout(location = NORMAL_LOCATION) in vec3 in_norm;
	
	// uniforms
	uniform vec3 LAPos;
	uniform vec4 LAlightColor;
	uniform vec4 ambientLightColor;
	uniform vec4 ambientMatColor;
	uniform mat4 pMatrix;
	
	//outputs
	out vec3 fs_pos; //position vertex vector
	out vec3 fs_norm; //normal vector transformations
	out vec4 light_ambient;
	out vec3 light_dir;
	
	void main() {
		fs_norm = in_norm; //normal vector to be passed to frag shader
	  fs_pos = in_pos; //vertex position to be passed to frag shader
	
		//light direction
		vec3 Ldir = normalize(LAPos - in_pos);
		light_dir = Ldir;
	
		// ambient
		vec4 ambient = ambientLightColor * ambientMatColor;
		light_ambient = ambient;
	
	
		gl_Position = pMatrix * vec4(in_pos, 1.0); //normal vector transform
	}
	`;
	
	// Light per vertex, diffuse and specular per pixel - fragment shader -- to do
	var F3 = `#version 300 es
	precision highp float;
	
	//inputs
	in vec3 fs_norm;
	in vec3 fs_pos;
	in vec3 light_dir;
	in vec4 light_ambient;
	
	
	// uniforms
	uniform vec3 eyePos;
	uniform vec4 LAlightColor;
	uniform vec4 diffuseColor;
	uniform vec4 specularColor;
	uniform float SpecShine;
	uniform vec4 emitColor;
	
	//outputs
	out vec4 color;
	
	void main() {
	
		//normalized norm vector
		vec3 norm = normalize(fs_norm); //normalized norm vector
	
		// diffuse
		vec4 diffuse = diffuseColor * max(dot(normalize(norm), light_dir), 0.0);
	
		// specular
		vec3 eyeDir = normalize(eyePos - fs_pos);
		vec3 halfVec = normalize(eyeDir + light_dir);
		vec4 specular = specularColor * pow(max(dot(halfVec, norm),0.0),SpecShine);
	
		// final
		vec4 finalColor = clamp((diffuse + specular) * LAlightColor + light_ambient + emitColor, 0.0, 1.0);
	
		color = vec4(finalColor.rgb, 1.0);
	}
	`;
	
	
	
	
	// Light and diffuse per vertex, specular per pixel - vertex shader -- to do
	var V4 = `#version 300 es
	#define POSITION_LOCATION 0
	#define NORMAL_LOCATION 1
	
	layout(location = POSITION_LOCATION) in vec3 in_pos;
	layout(location = NORMAL_LOCATION) in vec3 in_norm;
	
	// uniforms
	uniform vec3 LAPos;
	uniform vec4 LAlightColor;
	uniform vec4 ambientLightColor;
	uniform vec4 diffuseColor;
	uniform vec4 ambientMatColor;
	uniform mat4 pMatrix;
	
	//outputs
	out vec3 fs_pos;
	out vec3 fs_norm;
	out vec3 light_dir;
	out vec4 diffuse_term;
	out vec4 light_ambient;
	
	void main() {
		fs_norm = in_norm;
		fs_pos = in_pos;
	
		//light direction
		vec3 Ldir = normalize(LAPos - in_pos);
		light_dir = Ldir;
	
		//normalized norm vector
		vec3 norm = normalize(in_norm);
	
		// diffuse
		vec4 diffuse = diffuseColor * max(dot(normalize(norm), Ldir), 0.0);
	  diffuse_term = diffuse;
	
		// ambient
		vec4 ambient = ambientLightColor * ambientMatColor;
		light_ambient = ambient;
	
		gl_Position = pMatrix * vec4(in_pos, 1.0);
	}
	`;
	
	// Light and diffuse per vertex, specular per pixel - fragment shader -- to do
	var F4 = `#version 300 es
	precision highp float;
	
	//from vertex shader
	in vec3 fs_pos;
	in vec3 fs_norm;
	in vec3 light_dir;
	in vec4 diffuse_term;
	in vec4 light_ambient;
	
	// uniforms
	uniform vec3 eyePos;
	uniform vec4 LAlightColor;
	uniform vec4 specularColor;
	uniform float SpecShine;
	uniform vec4 emitColor;
	
	
	out vec4 color;
	
	void main() {
	
		//normalized norm vector
		vec3 norm = normalize(fs_norm);
	
		//specular
		vec3 eyeDir = normalize(eyePos - fs_pos);
		vec3 halfVec = normalize(eyeDir + light_dir);
		vec4 specular = specularColor * pow(max(dot(halfVec, norm),0.0),SpecShine);
	
		// final
		vec4 finalColor = clamp((diffuse_term + specular) * LAlightColor + light_ambient + emitColor, 0.0, 1.0);
	
		color = vec4(finalColor.rgb, 1.0);
	}
	`;
	
	
	
		return [V1, F1,  V2, F2,  V3, F3,  V4, F4];
	}
	