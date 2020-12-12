/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

import * as THREE from "https://cdn.skypack.dev/three?dts";

export class ThreeCode {
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.Renderer;
    texture: THREE.VideoTexture;
    public elems: Record<string, THREE.Mesh| null>;

    constructor() {
        const container = document.getElementById("container");

        this.camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 1100);

        this.scene = new THREE.Scene();

        const s0Geom = new THREE.SphereBufferGeometry(100, 32, 16);
        // invert the geometry on the x-axis so that all of the faces point inward
        s0Geom.scale(-1, 1, 1);
        const s1Geom = new THREE.SphereBufferGeometry(200, 32, 16);
        // invert the geometry on the x-axis so that all of the faces point inward
        s1Geom.scale(-1, 1, 1);

        //const texture = new THREE.TextureLoader().load("/static/pano.jpg");
        const video: HTMLVideoElement = <HTMLVideoElement> document.getElementById(
        "testVid",
        );
        if (!video) {
        throw new Error("NO VIDEO!");
        }
        this.texture = new THREE.VideoTexture(video);
        const material0 = new THREE.MeshBasicMaterial({ map: this.texture });
        const material1 = new THREE.MeshBasicMaterial({ map: this.texture });

        this.elems = {};
        this.elems.s0 = new THREE.Mesh(s0Geom, material0);
        material0.transparent = true;
        this.elems.s1 = new THREE.Mesh(s1Geom, material1);

        this.scene.add(this.elems.s0);
        this.scene.add(this.elems.s1);

        this.renderer = new THREE.WebGLRenderer();
        //renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(1280, 720);
        if (container) {
        //stats = createStats();
        //container.appendChild(stats.domElement);
        container.appendChild(this.renderer.domElement);

        //container.style.touchAction = 'none';
        //container.addEventListener('pointerdown', onPointerDown, false);

        container.onclick = () => {
            video.play();
            container.onclick = () => {
                //this.renderer.domElement.requestFullscreen();
            };
            this.animate();
        };
        }
        {
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
    }

    animate() {

        // deno-lint-ignore no-undef
        requestAnimationFrame(() => {this.animate()});
        //update();
        // The following is here B/C THREE doesn't ask for frames often enough.
        this.texture.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
        //stats.update();
    }
}