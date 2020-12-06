/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

import * as THREE from 'https://cdn.skypack.dev/three?dts';
import Stats from 'https://cdn.skypack.dev/stats.js?dts';
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.Renderer;
let texture: THREE.VideoTexture;
var stats: typeof Stats;

/*let isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;*/

init();
animate();

function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
}

function init() {

    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 1100);

    scene = new THREE.Scene();

    const geometry = new THREE.SphereBufferGeometry(500, 32, 16);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(- 1, 1, 1);

    //const texture = new THREE.TextureLoader().load("/static/pano.jpg");
    const video: HTMLVideoElement = <HTMLVideoElement>document.getElementById('testVid');
    if(!video){
        throw new Error("NO VIDEO!")
    }
    texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (container) {
        //stats = createStats();
        container.appendChild(stats.domElement);
        container.appendChild(renderer.domElement);
        
        //container.style.touchAction = 'none';
        //container.addEventListener('pointerdown', onPointerDown, false);
        
        container.onclick = () => {
            video.play();
            container.onclick = () => {};
        }
    }

    /*document.addEventListener('wheel', onDocumentMouseWheel, false);

    //

    document.addEventListener('dragover', function (event) {

        event.preventDefault();
        if (event.dataTransfer?.dropEffect)
        event.dataTransfer.dropEffect = 'copy';

    }, false);

    document.addEventListener('dragenter', function () {

        document.body.style.opacity = "0.5";

    }, false);

    document.addEventListener('dragleave', function () {

        document.body.style.opacity = "1";

    }, false);

    document.addEventListener('drop', function (event) {

        event.preventDefault();

        const reader = new FileReader();
        reader.addEventListener('load', function (event) {
            if(material.map && event.target?.result){
                material.map.image.src = event.target.result;
                material.map.needsUpdate = true;
            }

        }, false);
        if(event.dataTransfer?.files)
        reader.readAsDataURL(event.dataTransfer.files[0]);

        document.body.style.opacity = "1";

    }, false);*/

    //

    //window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
/*
function onPointerDown(event: PointerEvent) {
    if (event.isPrimary === false) return;

    isUserInteracting = true;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener('pointermove', onPointerMove, false);
    document.addEventListener('pointerup', onPointerUp, false);

}

function onPointerMove(event: PointerEvent) {

    if (event.isPrimary === false) return;

    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;

}

function onPointerUp(event: PointerEvent) {

    if (event.isPrimary === false) return;

    isUserInteracting = false;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

}

function onDocumentMouseWheel(event: WheelEvent) {

    const fov = camera.fov + event.deltaY * 0.05;

    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

    camera.updateProjectionMatrix();

}*/

function animate() {

    // deno-lint-ignore no-undef
    requestAnimationFrame(animate);
    //update();
    // The following is here B/C THREE doesn't ask for frames often enough.
    texture.needsUpdate = true;
    renderer.render(scene, camera);
    //stats.update();
}
/*
function update() {

    if (isUserInteracting === false) {

        lon += 0.1;

    }

    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(x, y, z);

    renderer.render(scene, camera);

}*/
