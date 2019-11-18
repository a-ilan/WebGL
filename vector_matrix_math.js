function vec2_set(array,index,vec){
	array[index*2+0] = vec[0];
	array[index*2+1] = vec[1];
}

function vec3_set(array,index,vec){
	array[index*3+0] = vec[0];
	array[index*3+1] = vec[1];
	array[index*3+2] = vec[2];
}

function vec3_sub(a,b){
	return [a[0]-b[0], a[1]-b[1], a[2]-b[2] ];
}

function vec3_add(a,b,c){
	if(!c) return [a[0]+b[0], a[1]+b[1], a[2]+b[2] ];
	return [a[0]+b[0]+c[0], a[1]+b[1]+c[1], a[2]+b[2]+c[2] ];
}

function vec3_div(a,b){
	return [a[0]/b , a[1]/b, a[2]/b ];
}

function vec3_normalize(v){
	var a = v[0], b = v[1], c = v[2]; 
	var length=Math.sqrt(a*a+b*b+c*c);
	if(length == 0) length = 1;
	return [a/length, b/length, c/length];
}

function vec3_mul(a,b){
	return [a[0]*b , a[1]*b, a[2]*b ];
}

function vec3_cross(a,b){
	return [a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0] ];
}
function vec3_dot(a,b){
	return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
}

function vec3_rotate(v, angle, axis){
	//Rodrigues' rotation formula
	let a = vec3_mul(v,Math.cos(angle));
	let b = vec3_mul(vec3_cross(axis,v),Math.sin(angle));
	let c = vec3_mul(vec3_mul(axis,vec3_dot(axis,v)),1-Math.cos(angle));
	return vec3_add(a,b,c);
}

function transform(scale,x,y,z){
	return [
		scale, 0, 0, x,
		0, scale, 0, y,
		0, 0, scale, z,
		0, 0, 0, 1
	];
}

function frustum(left,right,bottom,top,near,far){
	let width=right-left,height=top-bottom,depth=far-near;
	return [
		near*2/width, 0, (right+left)/width, 0,
		0, near*2/height, (top+bottom)/height, 0,
		0, 0, -(far+near)/depth, -(far*near*2)/depth,
		0, 0, -1, 0
	];
}

function perspective(fov,aspect,near,far){
	let top=near*Math.tan(fov*Math.PI/360);
	let right=top*aspect;
	return frustum(-right,right,-top,top,near,far);
};

function transpose(matrix){
	return [
		matrix[0], matrix[4], matrix[8], matrix[12],
		matrix[1], matrix[5], matrix[9], matrix[13],
		matrix[2], matrix[6], matrix[10], matrix[14],
		matrix[3], matrix[7], matrix[11], matrix[15]
	];
}