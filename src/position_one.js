import './style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('black')
const canvas = document.querySelector('#scene-canvas')
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize(canvas.innerWidth, canvas.innerHeight);
camera.position.set(11, 6, -6)

// This function ensures the render output matches
// the actual size of the canvas on the page if it
// ever resizes from how it was on initial loadup
function resizeCanvasToDisplaySize()
{
	const rend = renderer.domElement;
	const width = canvas.parentElement.clientWidth;
	const height = canvas.parentElement.clientHeight;
	
	if (rend.width !== width || rend.height !== height)
	{
		// you must pass false here or three.js sadly fights the browser
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}


// Add Elements
scene.add(new THREE.AmbientLight(0xffffff, 1))
const sun = new THREE.DirectionalLight(0xffffff, 2.2)
sun.position.set(10, 10, 10)
scene.add(sun)

let model;
const loader = new GLTFLoader();
loader.load(
    "/src/court.glb",
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error("Load failed:", error)
    }
)

// Add grids for scale
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

// Add Mouse movements to control 3d model
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Add Text to integrate with 3d model
const textBox = "BOOM"
document.getElementById("five-one-box").innerText = textBox;
function animate() {
    requestAnimationFrame(animate)
    resizeCanvasToDisplaySize();
    controls.update()
    renderer.render(scene, camera)
}

animate();