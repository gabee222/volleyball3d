import './style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('black')
const canvas = document.querySelector('#scene-canvas')
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas})

camera.position.set(11, 6, -6)

// Match the drawing buffer to the canvas's displayed size × device pixel ratio.
// Returns true when a resize actually happened. Capping DPR at 2 keeps it
// sharp on Retina/HiDPI without rendering absurd pixel counts on 3x phones.
function resizeRendererToDisplaySize() {
    const dpr = Math.min(window.devicePixelRatio, 2)
    const width = Math.round(canvas.clientWidth * dpr)
    const height = Math.round(canvas.clientHeight * dpr)
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        // false = set the buffer directly, don't touch the canvas's CSS size
        renderer.setSize(width, height, false)
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }
    return needResize
}

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

const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function animate() {
    requestAnimationFrame(animate)

    resizeRendererToDisplaySize()
    controls.update()
    renderer.render(scene, camera)
}
animate();