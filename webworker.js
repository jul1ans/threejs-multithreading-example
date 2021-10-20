import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import {initScene} from './scene.js';

const state = {
    renderer: null,
    width: 300,   // canvas default
    height: 150,  // canvas default
};

const updateSize = () => {
    state.renderer?.setSize(state.width, state.height, false);
}

const init = (data) => {
    console.log('--- INIT WEBWORKER ---', data);
    self.document = {};  // HACK!
    const {
        canvas,
        size,
    } = data;
    const {
        scene,
        objects,
        camera,
    } = initScene();

    state.width = size[0];
    state.height = size[1];

    state.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
    });

    state.renderer.shadowMap.enabled = true;
    state.renderer.setClearColor(0xcccccc, 1);
    updateSize();

    const render = () => {
        state.renderer.render(scene, camera);
        objects.forEach((o) => {
            o.rotation.y += 0.03;
        });

        requestAnimationFrame(render);
    };

    render();
};

const handlers = {
    init,
    updateSize: (data) => {
        const {
            size,
        } = data;
        state.width = size[0];
        state.height = size[1];
        updateSize();
    },
}

self.addEventListener('message', function(e) {
    if (handlers[e.data.type]) {
        handlers[e.data.type](e.data);
    } else {
        console.error('Missing hanlder for: ', e.data.type);
    }
}, false);
