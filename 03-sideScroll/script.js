// setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(ctx);
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'gold');
gradient.addColorStop(1, 'orangered');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 10 + 1);
        this.imageSize = this.radius * 8
        this.halfImageSize = this.imageSize / 2
        this.x = this.imageSize + Math.random() * (this.effect.width + this.effect.maxDistance);
        this.y = this.imageSize + Math.random() * (this.effect.height + this.effect.maxDistance);
        this.vx = -1;
        // this.vy = Math.random() * 1 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.95;
        this.image = document.getElementById('star')

    }
    draw(context) {
        // context.beginPath();
        // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // context.fill();
        context.drawImage(this.image, this.x - this.halfImageSize, this.y - this.halfImageSize, this.imageSize, this.imageSize)
        //context.stroke();
    }
    update() {
        if (this.effect.mouse.pressed) {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = (this.effect.mouse.radius / distance);
            if (distance < this.effect.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                this.pushX += Math.cos(angle) * force;
                this.pushY += Math.sin(angle) * force;
            }
        }

        // whale
        const dwx = this.x -this.effect.whale.x
        const dwy = this.y -this.effect.whale.y
        const distanceWhale = Math.hypot(dwx, dwy);
        const forceWhale = (this.effect.whale.radius / distanceWhale);
        if (distanceWhale < this.effect.whale.radius) {
            const angle = Math.atan2( dwy,dwx);
            this.pushX += Math.cos(angle) * forceWhale;
            this.pushY += Math.sin(angle) * forceWhale;
        }
        
        // const dx = this.x - this.effect.whale.x;
        // const dy = this.y - this.effect.whale.y;
        // const distance = Math.hypot(dx, dy);
        // const force = (this.effect.whale.radius / distance);
        // if (distance < this.effect.whale.radius) {
        //     const angle = Math.atan2(dy, dx);
        //     this.pushX += Math.cos(angle) * force;
        //     this.pushY += Math.sin(angle) * force;
        // }

        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction);

        if (this.x < -this.imageSize - this.effect.maxDistance) {
            this.x = this.effect.width + this.imageSize + this.effect.maxDistance
            this.y = this.imageSize + Math.random() * (this.effect.height + this.effect.maxDistance);
        }
    }
    reset() {
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}
class Whale {
    constructor(effect) {
        this.effect = effect;
        this.x = this.effect.width * 0.5
        this.y = this.effect.height * 0.5
        this.image = document.getElementById('whale2')
        this.angle = 0;
        this.va = 0.01;
        this.curve = this.effect.height * 0.2
        this.spriteWidth = 420;
        this.spriteHeight = 285;
        this.frameX = 0;
        this.maxFrame = 38;
        this.frameTime = 0;
        this.frameInterval = 1000 / 50
        this.radius = 200;
    }
    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(Math.cos(this.angle))
        context.drawImage(this.image,
            this.frameX * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            0 - this.spriteWidth * 0.5, 0 - this.spriteHeight * 0.5,
            this.spriteWidth, this.spriteHeight)
        context.restore()


    }
    update(deltaTime) {

        this.angle += this.va
        this.y = this.effect.height * 0.5 + Math.sin(this.angle) * this.curve
        if (this.angle > Math.PI * 2) this.angle = 0 //I do not know what is than

        // fps
        if (this.frameTime > this.frameInterval) {
            // animate
            this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0
            this.frameTime = 0
        } else {
            this.frameTime += deltaTime
        }
    }
}
class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 500;
        this.maxDistance = 150
        this.createParticles();
        this.whale = new Whale(this);

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context, deltaTime) {
        this.whale.draw(context)
        this.whale.update(deltaTime)
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context) {
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < this.maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / this.maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.whale.x = this.width * 0.5
        this.whale.y = this.height * 0.5
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const effect = new Effect(canvas, ctx);


let lastTime = 0

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime //``16.66
    lastTime = timeStamp

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx,deltaTime);
    requestAnimationFrame(animate );
}
animate(0);