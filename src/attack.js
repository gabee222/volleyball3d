import './style.css'

import PickHelper from './pickhelper.js';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('black')
const canvas = document.querySelector('#scene-canvas')
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});

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
await loader.load(
    "/src/court.glb",
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        loadPlayers();
    },
    undefined,
    (error) => {
        console.error("Load failed:", error)
    }
)

// Add Players to Player class
const foundObjects = [];

// 2. Traverse the scene and check your custom userData property
function loadPlayers(){
    scene.traverse((child) => {
        // Check if the object has your custom property and matches the value
        if (child.userData && child.userData['Player'] === true) {
            foundObjects.push(child);
        }
    });
    console.log('Scene Information: ', scene.children);
    console.log(foundObjects);
}

// console.log(foundObjects)

// Add grids for scale
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(gridHelper)

// Add Mouse movements to control 3d model
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const pickedPosition = {x: 0, y: 0}
clearPickPosition();

function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
}

function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickedPosition.x = (pos.x / canvas.width ) * 2 - 1;
    pickedPosition.y = (pos.y / canvas.height) * -2 + 1;
}
function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickedPosition.x = -100000;
  pickedPosition.y = -100000;
}

canvas.addEventListener('mousemove', setPickPosition);
canvas.addEventListener('mouseout', clearPickPosition);
canvas.addEventListener('mouseleave', clearPickPosition);


// Add Text to integrate with 3d model
const pickHelper = new PickHelper();

function animate() {
    updateBox();
    requestAnimationFrame(animate).toString();
    resizeCanvasToDisplaySize();
    controls.update()
    renderer.render(scene, camera)
}

function updateBox(){
    var infoBox = document.getElementById("five-one-box");
    var playerInfo = infoBox.innerText;
    playerInfo = pickHelper.pick(pickedPosition, scene, camera);
    infoBox.innerText = playerInfo;
    if (playerInfo === ""){
        infoBox.style.display = "none";
    } else {
        infoBox.style.display = "";
    }
}
animate();