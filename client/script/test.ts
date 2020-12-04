/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

import * as THREE from 'https://cdn.skypack.dev/three?dts';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.Renderer;
let mesh: THREE.Mesh;
let geometry: THREE.BoxGeometry;
let material: THREE.MeshNormalMaterial;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // deno-lint-ignore no-undef
    document.body.appendChild(renderer.domElement);

}

function animate() {

    // deno-lint-ignore no-undef
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}