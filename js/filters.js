export function createFilmTexture(width, height, grainAlpha = 0.05, vignetteAlpha = 0.3) {
    const filmCanvas = document.createElement("canvas");
    filmCanvas.width = width;
    filmCanvas.height = height;
    const ctx = filmCanvas.getContext("2d");

    const imageData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imageData.data.buffer);
    for (let i = 0; i < buffer.length; i++) {
        const shade = Math.random() * 255 | 0;
        buffer[i] = (shade << 16) | (shade << 8) | shade | (grainAlpha * 255 << 24);
    }
    ctx.putImageData(imageData, 0, 0);

    const gradient = ctx.createRadialGradient(
        width / 2, height / 2, width / 4,
        width / 2, height / 2, width / 2
    );
    gradient.addColorStop(0, `rgba(0,0,0,0)`);
    gradient.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return filmCanvas;
}

export function createAnimatedFilmTexture(width, height, grainAlpha = 0.07, vignetteAlpha = 0.3) {
    const filmCanvas = document.createElement("canvas");
    filmCanvas.width = width;
    filmCanvas.height = height;
    const ctx = filmCanvas.getContext("2d");

    function updateGrain() {
        const imageData = ctx.createImageData(width, height);
        const buffer = new Uint32Array(imageData.data.buffer);
        for (let i = 0; i < buffer.length; i++) {
            const shade = Math.random() * 255 | 0;
            buffer[i] = (shade << 16) | (shade << 8) | shade | (grainAlpha * 255 << 24);
        }
        ctx.putImageData(imageData, 0, 0);

        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, width / 4,
            width / 2, height / 2, width / 2
        );
        gradient.addColorStop(0, `rgba(0,0,0,0)`);
        gradient.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    return { filmCanvas, updateGrain };
}

export function applyFlicker(ctx, canvas) {
    let flickerAlpha = 0.02;
    let flickerNextChange = 0;

    const timestamp = performance.now();
    if (timestamp > flickerNextChange) {
        flickerAlpha = 0.01 + Math.random() * 0.03;
        flickerNextChange = timestamp + 500 + Math.random() * 2000;
    }

    ctx.fillStyle = "#2E1916";
    ctx.globalAlpha = flickerAlpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
}

export function applyScratches(ctx, canvas) {
    const scratchColor = "#2E1916";

    const lineCount = 5 + Math.random() * 5;
    for (let i = 0; i < lineCount; i++) {
        const x = Math.random() * canvas.width;
        const w = 1 + Math.random() * 2;
        ctx.fillStyle = scratchColor;
        ctx.globalAlpha = 0.08 + Math.random() * 0.05;
        ctx.fillRect(x, 0, w, canvas.height);
    }

    for (let i = 0; i < 3; i++) {
        const y = Math.random() * canvas.height;
        const h = 1;
        ctx.fillStyle = scratchColor;
        ctx.globalAlpha = 0.04 + Math.random() * 0.03;
        ctx.fillRect(0, y, canvas.width, h);
    }

    ctx.globalAlpha = 1;
}
