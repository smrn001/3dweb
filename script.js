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
let model, mixer;
const loader = new GLTFLoader();
loader.load(
  "./assets/earth_hologram.glb",
  (gltf) => {
    model = gltf.scene;
    model.position.set(-1, -1, -2); // Adjust model position
    scene.add(model);

    // Set up animation mixer if there are animations
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  },
  undefined,
  (error) => console.error(error)
);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Variables for mouse interaction
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse event listeners
renderer.domElement.addEventListener("mousedown", (event) => {
  isDragging = true;
});

renderer.domElement.addEventListener("mouseup", () => {
  isDragging = false;
});

renderer.domElement.addEventListener("mousemove", (event) => {
  if (isDragging && model) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Rotate the model based on mouse movement
    model.rotation.y += deltaX * 0.005; // Adjust rotation sensitivity
    model.rotation.x += deltaY * 0.005; // Adjust rotation sensitivity

    // Keep the rotation within limits
    model.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, model.rotation.x)
    );
  }

  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Update animation mixer if exists
  if (mixer) {
    mixer.update(0.01); // Adjust the speed of the animation
  }

  renderer.render(scene, camera);
}
animate();
