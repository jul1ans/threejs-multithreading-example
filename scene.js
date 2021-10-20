import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import {GLTFLoader} from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/loaders/GLTFLoader.js';

const loadFile = (url) => {
    return new Promise((resolve, reject) => {
        // Instantiate a loader
        const loader = new GLTFLoader();

        // Load a glTF resource
        loader.load(
            // resource URL
            url,
            // called when the resource is loaded
            function (gltf) {
                resolve(gltf.scene);
            },
            // called while loading is progressing
            function () {},
            // called when loading has errors
            function (error) {
                console.error('An error happened', error);
                reject();
            }
        );
    });
};

export const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
        -10,
        10,
        10,
        -10,
        1,
        400,
    );
    camera.position.set(
        10,
        10,
        10,
    );
    camera.lookAt(0, 0, 0);
    const light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(light);

    const objects = [];

    loadFile('./Avocado/glTF/Avocado.gltf').then((object) => {
        console.log('Object added', object);
        const scale = 30;

        for (let x = -10; x < 10; x++) {
            for (let y = -10; y < 10; y++) {
                const clone = object.clone(true);
                scene.add(clone);
                clone.position.set(x * 2, -2, y);
                clone.scale.set(scale, scale, scale);
                objects.push(clone);
            }
        }
    });

    return {
        scene,
        objects,
        camera,
    };
}