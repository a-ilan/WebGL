
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
	mul: function(a,b){
		return {
			x: a.x*b, 
			y: a.y*b, 
			z: a.z*b };
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

	cross: function(a,b){
		return {
			x: a.y * b.z - a.z * b.y,
			y: a.z * b.x - a.x * b.z,
			z: a.x * b.y - a.y * b.x };
	},
	dot: function(a,b){
		return a.x*b.x + a.y*b.y + a.z*b.z;
	},

	rotate: function(v, angle, axis){
		//Rodrigues' rotation formula
		let a = vec3.mul(v,Math.cos(angle));
		let b = vec3.mul(vec3.cross(axis,v),Math.sin(angle));
		let c = vec3.mul(vec3.mul(axis,vec3.dot(axis,v)),1-Math.cos(angle));
		return vec3.add(a,b,c);
	},
	
	create: function(x,y,z){
		return {x: x, y: y, z: z};
	},
	
	equals: function(a,b){
		return a.x === b.x && a.y === b.y && a.z === b.z;
	}
};

vec2 = {
	create: function(x,y){
		return {x: x, y: y};
	},
	add: function(a,b,c){
		if(!c) return {
			x: a.x+b.x, 
			y: a.y+b.y};
		return {
			x: a.x+b.x+c.x, 
			y: a.y+b.y+c.y };
	},
	sub: function(a,b){
		return {
			x: a.x-b.x, 
			y: a.y-b.y };
	},
	mul: function(a,b){
		return {
			x: a.x*b, 
			y: a.y*b };
	},
	div: function(a,b){
		return {
			x: a.x/b, 
			y: a.y/b };
	}
};

// column-major order
mat4 = {
	create: function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	transpose: function(matrix){
		return [
			matrix[0], matrix[4], matrix[8], matrix[12],
			matrix[1], matrix[5], matrix[9], matrix[13],
			matrix[2], matrix[6], matrix[10], matrix[14],
			matrix[3], matrix[7], matrix[11], matrix[15]
		];
	},
	frustum: function(left,right,bottom,top,near,far){
		let width=right-left,height=top-bottom,depth=far-near;
		return [
			near*2/width, 0, (right+left)/width, 0,
			0, near*2/height, (top+bottom)/height, 0,
			0, 0, -(far+near)/depth, -(far*near*2)/depth,
			0, 0, -1, 0
		];
	},
	perspective: function(fov,aspect,near,far){
		let top=near*Math.tan(fov*Math.PI/360);
		let right=top*aspect;
		return mat4.frustum(-right,right,-top,top,near,far);
	},
	mul: function(){
		if(arguments.length < 2) return null;
		let result = arguments[0];
		for(let a = 0; a < arguments.length-1; a++){
			let A = result.slice(); // copy
			let B = arguments[a+1];
			
			for(let j = 0; j < 4; j++){ // row
				for(let i = 0; i < 4; i++){ // column
					result[i+j*4] = 0;
					for(let k = 0; k < 4; k++){
						result[i+j*4] += A[k+j*4] *B[i+k*4];
					}
				}
			}
		}
		return result;
	},
	translate: function(x,y,z){
		return [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		];
	},
	scale: function(value){
		return [
			value, 0, 0, 0,
			0, value, 0, 0,
			0, 0, value, 0,
			0, 0, 0, 1
		];
	},
	rotate: function(angle,axis){
		let u = vec3.normalize(axis);
		let x = u.x, y = u.y, z = u.z;
		let c = Math.cos(angle);
		let s = Math.sin(angle);
		let t = 1 - c;
		return [
			t*x*x + c,   t*x*y - z*s, t*x*z + y*s, 0,
			t*x*y + z*s, t*y*y + c,   t*y*z - x*s, 0,
			t*x*z - y*s, t*y*z + x*s, t*z*z + c, 0,
			0,0,0, 1
		];
	}
};