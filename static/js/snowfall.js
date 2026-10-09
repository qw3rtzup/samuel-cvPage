document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("snowfall-background");
    if (!container) return;

    // Nastavenia animácie (zodpovedajú pôvodným presetom)
    const config = {
        count: 27,
        wind: 0,
        windVariation: 3.4,
        sizeMin: 1,
        sizeMax: 4,
        speedMin: 0.6,
        speedMax: 2.4,
        opacityMin: 30,
        opacityMax: 46,
        direction: "up", // "up" alebo "down"
        color: "#ffffff"
    };

    // Vytvorenie Canvasu vnútri #snowfall-background
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let flakes = [];

    const rand = (a, b) => a + Math.random() * (b - a);
    const dirSign = config.direction === "up" ? -1 : 1;
    const oLo = Math.min(config.opacityMin, config.opacityMax) / 100;
    const oHi = Math.max(config.opacityMin, config.opacityMax) / 100;

    function build() {
        W = container.clientWidth || window.innerWidth;
        H = container.clientHeight || window.innerHeight;
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        flakes = new Array(config.count);
        for (let i = 0; i < config.count; i++) {
            flakes[i] = {
                x: Math.random() * W,
                y: Math.random() * H,
                r: rand(config.sizeMin, config.sizeMax),
                vy: rand(config.speedMin, config.speedMax),
                vx: rand(-1, 1),
                phase: Math.random() * Math.PI * 2,
                sway: rand(0.2, 0.9),
                alpha: rand(oLo, oHi)
            };
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = config.color;
        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            ctx.globalAlpha = f.alpha;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function loop(t) {
        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            f.y += f.vy * dirSign;
            f.x += config.wind + f.vx * config.windVariation + Math.sin(t * 0.0012 + f.phase) * f.sway;

            if (dirSign > 0 && f.y - f.r > H) {
                f.y = -f.r;
                f.x = Math.random() * W;
            } else if (dirSign < 0 && f.y + f.r < 0) {
                f.y = H + f.r;
                f.x = Math.random() * W;
            }
            if (f.x < -f.r) f.x = W + f.r;
            else if (f.x > W + f.r) f.x = -f.r;
        }
        draw();
        requestAnimationFrame(loop);
    }

    build();
    window.addEventListener("resize", build);
    requestAnimationFrame(loop);
});