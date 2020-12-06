/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

import * as THREE from 'https://cdn.skypack.dev/three?dts';

// deno-lint-ignore no-explicit-any
declare var __THREE_DEVTOOLS__: any;

let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.Renderer;
let sphere1Mesh: THREE.Mesh;
let sphere1Geom: THREE.BufferGeometry;
let material: THREE.Material;

init();
animate();

function init() {
    
    const color = new THREE.Color(0xfffffff);
    scene = new THREE.Scene();
    scene.background = color

    // sphere1Geom = new THREE.SphereBufferGeometry(5, 32, 16);

    // var loader = new THREE.TextureLoader(),
    //     texture = loader.load("/static/pano.jpg");

    // const met = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // material = new THREE.MeshBasicMaterial({
    //     color: 0xffffff,
    //     map: texture,
    //     side: THREE.DoubleSide,
    //     wireframe: true,
    // }); 

    // sphere1Mesh = new THREE.Mesh(sphere1Geom, met);
    // sphere1Mesh.translateZ(-10);
    // scene.add(sphere1Mesh);

    // const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    // scene.add(light);

    const geometry = new THREE.SphereBufferGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10);
    scene.add(camera);
    camera.translateZ(-10)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // deno-lint-ignore no-undef
    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);

    // Observe a scene or a renderer
    if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: scene }));
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: renderer }));
    }
}

function animate() {

    // deno-lint-ignore no-undef
    requestAnimationFrame(animate);

    //sphere1Mesh.rotation.x += 0.01;
    //sphere1Mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}