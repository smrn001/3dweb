// Import the necessary modules
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2.5, -2, 3);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("hero-model").appendChild(renderer.domElement);

// Load the .glb model
let model;
const loader = new GLTFLoader();
loader.load(
  "./assets/a_horror_monster.glb",
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, -1, 0); // Adjust model position
    scene.add(model);
  },
  undefined,
  (error) => console.error(error)
);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the model (if it is loaded)
  if (model) {
    model.rotation.y += 0.001; // Adjust the rotation speed (radians per frame)
  }

  renderer.render(scene, camera);
}
animate();
