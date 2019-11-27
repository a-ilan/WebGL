
vec3 = {
	sub: function(a,b){
		return {
			x: a.x-b.x, 
			y: a.y-b.y, 
			z: a.z-b.z };
	},

	add: function(a,b,c){
		if(!c) return {
			x: a.x+b.x, 
			y: a.y+b.y, 
			z: a.z+b.z };
		return {
			x: a.x+b.x+c.x, 
			y: a.y+b.y+c.y, 
			z: a.z+b.z+c.z };
	},

	div: function(a,b){
		return {
			x: a.x/b, 
			y: a.y/b, 
			z: a.z/b };
	},

	normalize: function(v){
		var a = v.x, b = v.y, c = v.z; 
		var length=Math.sqrt(a*a+b*b+c*c);
		if(length == 0) length = 1;
		return {x: a/length, y: b/length, z: c/length};
	},

	mul: function(a,b){
		return {
			x: a.x*b , 
			y: a.y*b, 
			z: a.z*b };
	},

	cross: function(a,b){
		return {
			x: a.y * b.z - a.z * b.y,
			y: a.z * b.x - a.x * b.z,
			z: a.x * b.y - a.y * b.x };
	},
	dot: function(a,b){
		return a.x*b.y + a.y*b.y + a.z*b.z;
	},

	rotate: function(v, angle, axis){
		//Rodrigues' rotation formula
		let a = vec3.mul(v,Math.cos(angle));
		let b = vec3.mul(vec3.cross(axis,v),Math.sin(angle));
		let c = vec3.mul(vec3.mul(axis,vec3.dot(axis,v)),1-Math.cos(angle));
		return vec3.add(a,b,c);
	},
	
	serialize: function(arr){
		result = [];
		for(let i = 0; i < arr.length; i++){
			result.push(arr[i].x);
			result.push(arr[i].y);
			result.push(arr[i].z);
		}
		return new Float32Array(result);
	}
};

vec2 = {
	serialize: function(arr){
		result = [];
		for(let i = 0; i < arr.length; i++){
			result.push(arr[i].x);
			result.push(arr[i].y);
		}
		return new Float32Array(result);
	}
};

color = {
	serialize: function(arr){
		result = [];
		for(let i = 0; i < arr.length; i++){
			result.push(arr[i].r*255);
			result.push(arr[i].g*255);
			result.push(arr[i].b*255);
			result.push(arr[i].a*255);
		}
		return new Uint8Array(result);
	}
};

// column-major order
mat4 = {
	transpose: function(matrix){
		return new Float32Array([
			matrix[0], matrix[4], matrix[8], matrix[12],
			matrix[1], matrix[5], matrix[9], matrix[13],
			matrix[2], matrix[6], matrix[10], matrix[14],
			matrix[3], matrix[7], matrix[11], matrix[15]
		]);
	},
	frustum: function(left,right,bottom,top,near,far){
		let width=right-left,height=top-bottom,depth=far-near;
		return mat4.transpose([
			near*2/width, 0, (right+left)/width, 0,
			0, near*2/height, (top+bottom)/height, 0,
			0, 0, -(far+near)/depth, -(far*near*2)/depth,
			0, 0, -1, 0
		]);
	},
	perspective: function(fov,aspect,near,far){
		let top=near*Math.tan(fov*Math.PI/360);
		let right=top*aspect;
		return mat4.frustum(-right,right,-top,top,near,far);
	},
	translate: function(x,y,z){
		return mat4.transpose([
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		]);
	},
	scale: function(value){
		return mat4.transpose([
			value, 0, 0, 0,
			0, value, 0, 0,
			0, 0, value, 0,
			0, 0, 0, 1
		]);
	}
};