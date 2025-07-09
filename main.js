import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { FontLoader } from 'https://unpkg.com/three@0.157.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.157.0/examples/jsm/geometries/TextGeometry.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sphere wireframe geometry
const geometry = new THREE.SphereGeometry(50, 8, 8); // increase radius from 1 to 100
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Start the camera farther away
camera.position.z = 100;

// OrbitControls for user interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Add 3D text and image inside the sphere
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.157.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const lines = [
        'Brandon Ng',
        'Engineering @ Disney Streaming',
        'Data and Machine Learning Infrastructure',
    ];
    const lineHeight = .5; // vertical spacing
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // bright white
    const textMeshes = [];
    lines.forEach((line, i) => {
        const textGeometry = new TextGeometry(line, {
            font: font,
            size: 0.3, // larger size for visibility
            height: 0.01,
            curveSegments: 12,
        });
        textGeometry.computeBoundingBox();
        const bbox = textGeometry.boundingBox;
        // Center each line horizontally
        const xOffset = -0.5 * (bbox.max.x - bbox.min.x);
        // Center all lines vertically
        const yOffset = -lineHeight * (i - (lines.length - 1) / 2);
        const mesh = new THREE.Mesh(textGeometry, textMaterial);
        mesh.position.set(xOffset, yOffset, 0);
        scene.add(mesh);
        textMeshes.push(mesh);
    });
    // Add image above the text
    const imgLoader = new THREE.TextureLoader();
    imgLoader.load('./me.webp', function(texture) {
        const imgGeometry = new THREE.PlaneGeometry(2, 2); // Adjust size as needed
        const imgMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const imageMesh = new THREE.Mesh(imgGeometry, imgMaterial);
        imageMesh.position.set(0, lineHeight * (lines.length / 2) + 1, 0); // Position above the text
        scene.add(imageMesh);
    });
}, undefined, function (err) {
    console.error('Font failed to load', err);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
