
function serializeMesh(mesh){
	vertices = [];
	let vertexCount = mesh.positions.length;
	for(let i = 0; i < vertexCount; i++){
		if(mesh.hasOwnProperty("positions")){
			let pos = mesh.positions[i];
			vertices.push(pos.x, pos.y, pos.z);
		}
		if(mesh.hasOwnProperty("normals")){
			let normal = mesh.normals[i];
			vertices.push(normal.x, normal.y, normal.z);
		}
		if(mesh.hasOwnProperty("texCoords")){
			let texCoord = mesh.texCoords[i];
			vertices.push(texCoord.x, texCoord.y);
		}
	}
	
	indices = [];
	for(let i = 0; i < mesh.faces.length; i++){
		let face = mesh.faces[i];
		indices.push(face[0],face[1],face[2]);
	}
	
	mesh.vertices = new Float32Array(vertices);
	mesh.indices = new Uint16Array(indices);
	return mesh;
}

// replace the vertex positions with spherePoints()
function icosahedronMesh(subdivisions){
	let mesh = {};
	
	mesh.positions = [
		// Top 5 vertices
		spherePoint(0,0), //vec3.create(0, 1, 0),
		spherePoint(0,0), //vec3.create(0, 1, 0),
		spherePoint(0,0), //vec3.create(0, 1, 0),
		spherePoint(0,0), //vec3.create(0, 1, 0),
		spherePoint(0,0), //vec3.create(0, 1, 0),
		
		// Upper layer vertices (6)
		spherePoint(Math.PI*4/5,Math.PI*1/3),
		spherePoint(Math.PI*2/5,Math.PI*1/3),
		spherePoint(Math.PI*0/5,Math.PI*1/3),
		spherePoint(Math.PI*8/5,Math.PI*1/3),
		spherePoint(Math.PI*6/5,Math.PI*1/3),
		spherePoint(Math.PI*4/5,Math.PI*1/3),
		
		// Lower layer vertices (6)
		spherePoint(Math.PI*3/5,Math.PI*2/3),
		spherePoint(Math.PI*1/5,Math.PI*2/3),
		spherePoint(Math.PI*9/5,Math.PI*2/3),
		spherePoint(Math.PI*7/5,Math.PI*2/3),
		spherePoint(Math.PI*5/5,Math.PI*2/3),
		spherePoint(Math.PI*3/5,Math.PI*2/3),
		
		// Bottom 5 vertices
		spherePoint(0,Math.PI), //vec3.create(0, -1, 0),
		spherePoint(0,Math.PI), //vec3.create(0, -1, 0),
		spherePoint(0,Math.PI), //vec3.create(0, -1, 0),
		spherePoint(0,Math.PI), //vec3.create(0, -1, 0),
		spherePoint(0,Math.PI)  //vec3.create(0, -1, 0)
		
	];
	
	mesh.normals = [];
	for(let i = 0; i < mesh.positions.length; i++){
		mesh.normals.push(vec3.normalize(mesh.positions[i]));
	}
	
	mesh.texCoords = [
		//top vertices
		vec2.create(1/11, 0),
		vec2.create(3/11, 0),
		vec2.create(5/11, 0),
		vec2.create(7/11, 0),
		vec2.create(9/11, 0),
		
		//upper layer
		vec2.create(0/11, 1/3),
		vec2.create(2/11, 1/3),
		vec2.create(4/11, 1/3),
		vec2.create(6/11, 1/3),
		vec2.create(8/11, 1/3),
		vec2.create(10/11, 1/3),
		
		//lower layer
		vec2.create(1/11, 2/3),
		vec2.create(3/11, 2/3),
		vec2.create(5/11, 2/3),
		vec2.create(7/11, 2/3),
		vec2.create(9/11, 2/3),
		vec2.create(11/11, 2/3),
		 
		//bottom vertices
		vec2.create(2/11, 1),
		vec2.create(4/11, 1),
		vec2.create(6/11, 1),
		vec2.create(8/11, 1),
		vec2.create(10/11, 1)
	];
		
	// indices of each triangle
	mesh.faces = [
		// top triangles
		[0, 5, 6],
		[1, 6, 7],
		[2, 7, 8],
		[3, 8, 9],
		[4, 9, 10],
		
		// middle triangles (pointing down)
		[11, 6, 5], 
		[12, 7, 6],
		[13, 8, 7],
		[14, 9, 8],
		[15, 10,9],
		
		// middle triangles (pointing up)
		[6, 11, 12],
		[7, 12, 13],
		[8, 13, 14],
		[9, 14, 15],
		[10, 15,16],
		
		// Bottom triangles
		[12, 11, 17],
		[13, 12, 18],
		[14, 13, 19],
		[15, 14, 20],
		[16, 15, 21]
	];
	
	return subdivide(mesh,subdivisions);
}

// Get point on a sphere
// u = [0, 2*Pi]
// v = [0, Pi)
function spherePoint(u,v){
	return {
		x: Math.cos(u)*Math.sin(v),
		y: Math.cos(v),
		z: Math.sin(u)*Math.sin(v)
	};
}

function subdivide(mesh,subdivisions){
	for(let i = 0; i < subdivisions; i++){
		let faces = [];
		let cache = {};
		for(let j = 0; j < mesh.faces.length; j++){
			// The three indices of the triangle
			let index0 = mesh.faces[j][0];
			let index1 = mesh.faces[j][1];
			let index2 = mesh.faces[j][2];
			
			// Add a vertex for each edge in the triangle
			let index3 = addMiddleVertex(mesh, index0, index1, cache);
			let index4 = addMiddleVertex(mesh, index1, index2, cache);
			let index5 = addMiddleVertex(mesh, index2, index0, cache);
			
			//Create 4 triangles for each triangle
			faces.push([index0,index3,index5]); // add triangle 1
			faces.push([index1,index4,index3]); // add triangle 2
			faces.push([index2,index5,index4]); // add triangle 3
			faces.push([index3,index4,index5]); // add triangle 4
		}
		mesh.faces = faces;
	}
	
	return mesh
}

// add a vertex between another 2 vertices (with index0 and index1).
// Cache used to check if a vertex was added already between these two vertices
// Returns the index of the new vertex 
function addMiddleVertex(mesh, index0, index1, cache){
	let key = index0.toString()+"-"+index1.toString();
	if(cache.hasOwnProperty(key))
		return cache[key];
		
	let vert1 = mesh.positions[index0];
	let vert2 = mesh.positions[index1];
	let middle = vec3.normalize(vec3.div(vec3.add(vert1,vert2),2));
	mesh.positions.push(middle);
	
	let norm1 = mesh.normals[index0];
	let norm2 = mesh.normals[index1];
	let middleNormal = vec3.normalize(vec3.div(vec3.add(norm1,norm2),2));
	mesh.normals.push(middleNormal);
	
	let uv1 = mesh.texCoords[index0];
	let uv2 = mesh.texCoords[index1];
	let middleUV = vec2.div(vec2.add(uv1,uv2),2);
	mesh.texCoords.push(middleUV);
	
	let index = mesh.positions.length-1;
	cache[key] = index;
	return index;
}

//nx - number of segments in the knot (each segment is a circle)
//ny - number of points in each segment
function knotMesh(nx, ny) {
	let radius = 0.5; // radius of each segment
	let vertexCount = (nx+1) * (ny+1); // number of vertices
	let faceCount = 2 * nx*ny; // number of faces
	
	let positions = new Array(vertexCount);
	let normals = new Array(vertexCount);
	let texCoords = new Array(vertexCount);
	let faces = new Array(faceCount)
	
	//vertices
	for (let j = 0; j < nx+1; j++) {
		for (let i = 0; i < ny+1; i++) {
			// find the vertex position of the current segment
			let t = j * (2*Math.PI)/nx;
			let pos = trefoilKnotPoint(t);
			
			//calculate normal and tangent vectors
			t += 0.001;
			let next_pos = trefoilKnotPoint(t);
			let tangent = vec3.normalize(vec3.sub(next_pos,pos));
			let normal = vec3.normalize(vec3.cross(pos, next_pos));
			
			//rotate normal around tangent 
			let ang = (i * (2*Math.PI)/ny); // the amount to rotate around the tangent
			normal = vec3.rotate(normal, ang, tangent);
			pos = vec3.add(pos, vec3.mul(normal,radius)); //the actual position of the vertex
			
			//vertex
			let index = j * (ny+1) + i;
			positions[index] = pos;
			normals[index] = normal;
			texCoords[index] = {
				x: 8.0*j/nx, 
				y: 1.0*i/ny };
		}
	}

	// indices
	// create a quad for each vertex
	for (let j = 0; j < nx+1; j++) {
		if (j === nx) continue; // skip the last segment
		for (let i = 0; i < ny+1; i++) {
			// j - current segment
			// i - point of the segment
			if (i === ny) continue; // skip the last point in the segment
			let index = j * ny + i;

			//first triangle
			faces[index * 2 + 0] =  [
				(j + 0) * (ny + 1) + (i + 0),  // index 1
				(j + 0) * (ny + 1) + (i + 1),  // index 2
				(j + 1) * (ny + 1) + (i + 1)]; // index 3

			//second triangle
			faces[index * 2 + 1] = [
				(ny + 1) * (j + 0) + (i + 0),  // index 1
				(ny + 1) * (j + 1) + (i + 1),  // index 2
				(ny + 1) * (j + 1) + (i + 0)]; // index 3
		}
	}
	
	return {
		positions: positions,
		normals: normals,
		texCoords: texCoords,
		faces: faces
	};
}

// get a point on the trefoil knot
function trefoilKnotPoint(t) {
	return {
		x: Math.sin(t) + 2.0 * Math.sin(2.0 * t),
		y: Math.cos(t) - 2.0 * Math.cos(2.0 * t),
		z: -Math.sin(3.0 * t)
	};
}

async function loadOBJ(file){
	let objContent = await loadFile(file);
	if(objContent === null) return null;
	let obj = {
		positions:[],
		normals:[],
		faces:[]
	}
	
	let normals = [];
	let normalIndices = [];
	let positionIndices = [];
	
	let lines = objContent.split('\n');
	
	for(var i = 0; i < lines.length; i++){
		let line = lines[i].trim();
		
		if(line.startsWith("v ")){
			let elements = line.split(/\s+/);
			if(elements.length == 4){
				obj.positions.push({
					x: parseFloat(elements[1]),
					y: parseFloat(elements[2]),
					z: parseFloat(elements[3])
				});
			}
		} else if(line.startsWith("vn ")){
			let elements = line.split(/\s+/);
			if(elements.length == 4){
				normals.push({
					x: parseFloat(elements[1]),
					y: parseFloat(elements[2]),
					z: parseFloat(elements[3])
				});
			}
		} else if(line.startsWith("f ")){
			let elements = line.split(/\s+/);
			if(elements.length == 4){
				let ind0 = elements[1].split('/');
				let ind1 = elements[2].split('/');
				let ind2 = elements[3].split('/');
				
				if(ind0.length > 0){
					let positionIndex0 = ind0[0];
					let positionIndex1 = ind1[0];
					let positionIndex2 = ind2[0];
					positionIndices.push(parseInt(positionIndex0)-1);
					positionIndices.push(parseInt(positionIndex1)-1);
					positionIndices.push(parseInt(positionIndex2)-1);
					obj.faces.push([
						parseInt(positionIndex0)-1,
						parseInt(positionIndex1)-1,
						parseInt(positionIndex2)-1]);
				}
				if(ind0.length == 3){
					let normalIndex0 = ind0[2];
					let normalIndex1 = ind1[2];
					let normalIndex2 = ind2[2];
					normalIndices.push(parseInt(normalIndex0)-1);
					normalIndices.push(parseInt(normalIndex1)-1);
					normalIndices.push(parseInt(normalIndex2)-1);
				}
			}
		}
	}
	
	// re-order the normals to have the same indices as positions
	obj.normals = new Array(obj.positions.length);
	for(let i = 0; i < normalIndices.length; i++){
		let normalIndex = normalIndices[i];
		let positionIndex = positionIndices[i];
		obj.normals[positionIndex] = normals[normalIndex];
	}
	
	return obj;
}

async function loadFile(file){
	return new Promise(function (resolve, reject) {
		let request = new XMLHttpRequest();
		request.open('GET', file);
		request.onload = function () {
			if (request.status === 200) {
				resolve(request.responseText);
			} else {
				console.error("Failed to load file");
				reject(null);
			}
		};
		request.onerror = function () {
			console.error("Failed to load file");
			reject(null);
		};
		request.send();
	});
}