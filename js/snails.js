import { createFilmTexture, createAnimatedFilmTexture, applyFlicker, applyScratches } from './filters.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let snails = [];

//let filmLayer = createFilmTexture(canvas.width, canvas.height, 0.05, 0.3);
let { filmCanvas, updateGrain } = createAnimatedFilmTexture(canvas.width, canvas.height);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //filmLayer = createFilmTexture(canvas.width, canvas.height, 0.05, 0.3);
    ({ filmCanvas, updateGrain } = createAnimatedFilmTexture(canvas.width, canvas.height));


    snails.forEach(snail => {
        snail.x = Math.min(snail.x, canvas.width);
        snail.y = Math.min(snail.y, canvas.height);
    });
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function Snail(character, color, x, y, speed, dx, dy) {
    this.character = character;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;

    this.update = function () {
        ctx.fillStyle = this.color;
        ctx.font = "24px 'Space Mono', monospace";

        if (Math.abs(this.dy) > Math.abs(this.dx)) {
            for (let i = 0; i < this.character.length; i++) {
                ctx.fillText(this.character[i], this.x, this.y + i * 24);
            }
        } else {
            ctx.fillText(this.character, this.x, this.y);
        }
    };

    this.walk = function () {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    };

    this.isOffScreen = function () {
        return (
            this.x < -50 ||
            this.x > canvas.width + 50 ||
            this.y < -50 ||
            this.y > canvas.height + 50
        );
    };
}

function createSnail() {
    const speed = 0.5 + Math.random() * 2;

    const edge = Math.floor(Math.random() * 4);

    let x, y, dx, dy;

    switch (edge) {
        case 0: // top
            x = Math.random() * canvas.width;
            y = -24;
            dx = Math.random() * 2 - 1; // -1 to 1
            dy = 0.5 + Math.random();   // down
            break;
        case 1: // right
            x = canvas.width + 24;
            y = Math.random() * canvas.height;
            dx = -0.5 - Math.random();  // left
            dy = Math.random() * 2 - 1;
            break;
        case 2: // bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 24;
            dx = Math.random() * 2 - 1;
            dy = -0.5 - Math.random();  // up
            break;
        case 3: // left
            x = -24;
            y = Math.random() * canvas.height;
            dx = 0.5 + Math.random();   // right
            dy = Math.random() * 2 - 1;
            break;
    }

    const colors = [
        "#2E1916", // Eclipse
        "#57201C",
        //"#BB3524"  // Dark Pastel Red
        //"#BF3A44", // Dull Red
        "#D5B1BD", // Blossom
        "#DFD4C8", // Quill Grey
        "#F5CED7", // Classic Rose
        "#F3EADF", // Dawn Pink
        "#F8EAE0", // Dawn Pink
        "#FDF8EE", // Rose white
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    snails.push(new Snail("蝸牛", color, x, y, speed, dx, dy));
}

function updateArea() {
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--background').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateSnails();

    applyFlicker(ctx, canvas);
    applyScratches(ctx, canvas);

    updateGrain();
    ctx.drawImage(filmCanvas, 0, 0);
    //ctx.drawImage(filmLayer, 0, 0);
}

function updateSnails() {
    for (let i = snails.length - 1; i >= 0; i--) {
        snails[i].walk();
        snails[i].update();
        if (snails[i].isOffScreen()) snails.splice(i, 1);
    }
}

function addSnailsOverTime() {
    setInterval(() => createSnail(), 800);
}

function start() {
    addSnailsOverTime();
    setInterval(updateArea, 20); // 50 FPS
}

start();