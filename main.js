// Example models can be found here: https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/
// Offscreen example https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html

function initCanvas() {
    const canvas = document.getElementById('root-canvas');

    // WEB-WORKER MAGIC
    if (window.Worker && window.ArrayBuffer) {
        const worker = new Worker('./webworker.js', {type: 'module'});
        const offscreen = canvas.transferControlToOffscreen();

        worker.postMessage({
            type: 'init',
            canvas: offscreen,
            size: [window.innerWidth, window.innerHeight],
        }, [offscreen]);

        let resizeTimeout
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                worker.postMessage({
                    type: 'updateSize',
                    size: [window.innerWidth, window.innerHeight],
                }, [offscreen]);
            }, 300);
        });
    }
}

function initExampleOverlay() {
    const overlay = document.getElementById('example-overlay');
    let counter = 100000000;

    const heavyCalculation = () => {
        let c = 0;
        counter += 10;
        for (let i = 0; i < counter; i++) {
            c += i + (i > 1 ? i - 1 : 0);
        }
        return c;
    }

    const calc = () => {
        const t1 = performance.now();
        const v = heavyCalculation();
        overlay.innerText = `${counter} ||| ${v}`;
        const t2 = performance.now();
        console.log(`${Math.round(t2 - t1)}ms`);
        window.requestAnimationFrame(calc);
    };

    calc();
}

initCanvas();
initExampleOverlay();