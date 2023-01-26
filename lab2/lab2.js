var container;
var camera, scene, renderer;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// Object3D ("Group") nodes and Mesh nodes
var sceneRoot = new THREE.Group();

var sunSpin = new THREE.Group();

var earthOrbit = new THREE.Group();
var earthSpin = new THREE.Group();
var earthTrans = new THREE.Group();

var moonOrbit = new THREE.Group();
var moonSpin = new THREE.Group();
var moonTrans = new THREE.Group();

var marsOrbit = new THREE.Group();
var marsSpin = new THREE.Group();
var marsTrans = new THREE.Group();

var saturnOrbit = new THREE.Group();
var saturnSpin = new THREE.Group();
var saturnTrans = new THREE.Group();

// Mesh
var earthMesh, moonMesh, sunMesh, marsMesh, saturnMesh;

const light = new THREE.PointLight(0xffffff, 1, 100 );
const amLight = new THREE.AmbientLight( 0x202020 );

var animation = true;

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    // mouseX, mouseY are in the range [-1, 1]
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}

function createSceneGraph() {
    scene = new THREE.Scene();

    // Top-level node
    scene.add(sceneRoot);

    // Light branch
    scene.add(light);
    scene.add(amLight);

    // Sun branch
    sceneRoot.add(sunSpin);
    sunSpin.add(sunMesh);

    // Earth branch
    sceneRoot.add(earthOrbit);
    earthOrbit.add(earthTrans)
    earthTrans.add(earthSpin);
    earthSpin.add(earthMesh);

    // Moon branch
    earthTrans.add(moonOrbit);
    moonOrbit.add(moonTrans);
    moonTrans.add(moonSpin);
    moonSpin.add(moonMesh);

    // Mars branch
    sceneRoot.add(marsOrbit);
    marsOrbit.add(marsTrans);
    marsTrans.add(marsSpin);
    marsSpin.add(marsMesh);

    // Saturn branch
    sceneRoot.add(saturnOrbit);
    saturnOrbit.add(saturnTrans);
    saturnTrans.add(saturnSpin);
    saturnSpin.add(saturnMesh);

}

function init() {
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;
    
    light.position.set(0,0,0);
    light.castShadow = true;

    var texloader = new THREE.TextureLoader();

    // Sun Mesh
    var geometrySun = new THREE.SphereGeometry(1, 24 , 24); // (Width, widthSegments, heightSegments)
    var materialSun = new THREE.MeshBasicMaterial();
    // var materialSun = new THREE.MeshLambertMaterial();
    
    // Earth Mesh
	var geometryEarth = new THREE.SphereGeometry(1, 24 , 24); // (Width, widthSegments, heightSegments)
    // var materialEarth = new THREE.MeshBasicMaterial();
    var materialEarth = new THREE.MeshLambertMaterial();
    
    materialEarth.combine = 0;
    materialEarth.needsUpdate = true;
    materialEarth.wireframe = false;    
    
    // Moon Mesh
    var geometryMoon = new THREE.SphereGeometry(1, 24 , 24); // (Width, widthSegments, heightSegments)
    // var materialMoon = new THREE.MeshBasicMaterial();
    var materialMoon = new THREE.MeshLambertMaterial();

    // Mars Mesh
    var geometryMars = new THREE.SphereGeometry(1, 24 , 24); // (Width, widthSegments, heightSegments)
    // var materialMars = new THREE.MeshBasicMaterial();
    var materialMars = new THREE.MeshLambertMaterial();

    // Saturn Mesh
    var geometrySaturn = new THREE.SphereGeometry(1, 24 , 24); // (Width, widthSegments, heightSegments)
    // var materialSaturn = new THREE.MeshBasicMaterial();
    var materialSaturn = new THREE.MeshLambertMaterial();
    
    // TEXTURES
    const sunTexture = texloader.load('tex/2k_sun.jpg');
    materialSun.map = sunTexture;

	const earthTexture = texloader.load('tex/2k_earth_daymap.jpg');
    materialEarth.map = earthTexture;

    const moonTexture = texloader.load('tex/2k_moon.jpg');
    materialMoon.map = moonTexture;
    
    const marsTexture = texloader.load('tex/2k_mars.jpg');
    materialMars.map = marsTexture;

    const saturnTexture = texloader.load('tex/2k_saturn.jpg');
    materialSaturn.map = saturnTexture;

    // Task 7: material using custom Vertex Shader and Fragment Shader
    
    var uniforms = THREE.UniformsUtils.merge( [
	    { 
	    	colorTexture : { value : new THREE.Texture() },
	    	specularMap : { value : new THREE.Texture() }
    	},
	    THREE.UniformsLib[ "lights" ]
	] );

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : document.getElementById('vertexShader').textContent.trim(),
		fragmentShader : document.getElementById('fragmentShader').textContent.trim(),
		lights : true
	});
	
    shaderMaterial.uniforms.colorTexture.value = earthTexture;

	const specularMap = texloader.load('tex/2k_earth_specular_map.jpg');
	shaderMaterial.uniforms.specularMap.value = specularMap;
    // MESH
    sunMesh = new THREE.Mesh(geometrySun, materialSun);
    
    earthMesh = new THREE.Mesh(geometryEarth, shaderMaterial);
    earthMesh.scale.set(0.6, 0.6, 0.6);

    moonMesh = new THREE.Mesh(geometryMoon, materialMoon);
    moonMesh.scale.set(0.2, 0.2, 0.2);

    marsMesh = new THREE.Mesh(geometryMars, materialMars);
    marsMesh.scale.set(0.45, 0.45, 0.45);

    saturnMesh = new THREE.Mesh(geometrySaturn, materialSaturn);
    saturnMesh.scale.set(0.8, 0.8, 0.8);

    createSceneGraph();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    var checkBoxAnim = document.getElementById('animation');
    animation = checkBoxAnim.checked;
    checkBoxAnim.addEventListener('change', (event) => {
    	animation = event.target.checked;
    });

	var checkBoxWireframe = document.getElementById('wireframe');
    earthMesh.material.wireframe = checkBoxWireframe.checked;
    checkBoxWireframe.addEventListener('change', (event) => {
    	earthMesh.material.wireframe = event.target.checked;
    });
}

function render() {
    // Set up the camera
    camera.position.x = mouseX * 20;
    camera.position.y = -mouseY * 20;
    camera.lookAt(scene.position);

    // Perform animations
    if (animation) {
        // Sun
        sunSpin.rotation.y += 0.1/25;                   // sun spin (once/25sec)

    	// Earth
        earthTrans.position.x = 4;                          // Earth position
        earthOrbit.rotation.y += 0.1/365;                   // Orbit around sun
        earthSpin.rotation.y += 0.01;                       // Earth spin (once/sec)
        earthTrans.rotation.z = 23.44 * Math.PI / 180.0;    // Earth tilt

        // Moon
        moonTrans.position.x = 1.5;
        moonOrbit.rotation.y += 0.1/27.3;               // Orbiting Earth (once/27 sec)
        moonSpin.rotation.z = 5.15 * Math.PI / 180.0;   // Moon tilt

        // Mars
        marsTrans.position.x = 7;                       
        marsOrbit.rotation.y += 0.1/75;               // Orbiting Sun (once/27 sec)
        
         // Saturn
         saturnTrans.position.x = 9;                       
         saturnOrbit.rotation.y += 0.1/100;               // Orbiting Sun (once/27 sec)
     
    }

    // Render the scene
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate); // Request to be called again for next frame
    render();
}

init(); // Set up the scene
animate(); // Enter an infinite loop
