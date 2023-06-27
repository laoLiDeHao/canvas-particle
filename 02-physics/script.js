// setup
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
gradient.addColorStop(0, 'white')
gradient.addColorStop(0.5, 'gold')
gradient.addColorStop(1, 'orangered')
ctx.fillStyle = gradient
ctx.strokeStyle = '#fff'
class Particle {
  constructor(effect) {
    this.effect = effect
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
    this.vx = Math.random() * 4 - 2
    this.vy = Math.random() * 4 - 2
    this.pushX = 0;
    this.pushY = 0;
    this.fillStyle = `hsl( ${Math.random()*360},100%,50%)`
    this.strokeStyle = `hsl( ${Math.random()*360},100%,50%)`
    this.radius = Math.random() * 20 + 5
    this.friction = 0.5

  }
  draw(context) {
    // context.fillStyle = "hsl(" + this.x * 0.5 + ",100%,50%)"
    // context.fillStyle = this.fillStyle
    // context.strokeStyle = this.strokeStyle
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
    // context.stroke()
  }
  update() {

    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x
      const dy = this.y - this.effect.mouse.y
      const distance = Math.hypot(dx, dy)
      if (distance < this.effect.mouse.radius) {
        // console.log('crush');
        const angle = Math.atan2(dy, dx)
        this.pushX += Math.cos(angle) * this.effect.mouse.pressForce
        this.pushY += Math.sin(angle) * this.effect.mouse.pressForce
      }
    }
    this.x += this.vx + (this.pushX *= this.friction)
    this.y += this.vy + (this.pushY *= this.friction)



    if (this.x < this.radius) {
      this.x = this.radius
      this.vx *= -1
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius
      this.vx *= -1
    }
    if (this.y < this.radius) {
      this.y = this.radius
      this.vy *= -1
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius
      this.vy *= -1
    }



  }
  reset() {
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 800
    this.createParticles()


    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      pressForce: 25,
      radius: 200,

    }
    window.addEventListener('resize', e => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
    })
    window.addEventListener('mousemove', (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x
        this.mouse.y = e.y
      }
    })
    window.addEventListener('mousedown', (e) => {
      this.mouse.pressed = true
      this.mouse.x = e.x
      this.mouse.y = e.y
    })
    window.addEventListener('mouseup', (e) => {
      this.mouse.pressed = false
    })
    // window.addEventListener()
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this))
    }
  }
  handleParticles(context) {
    this.connectParticles(context)
    this.particles.forEach(particle => {
      particle.draw(context)
      particle.update()
    })

  }
  connectParticles(context) {
    const maxDistance = 100;
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = 0; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x
        const dy = this.particles[a].y - this.particles[b].y
        const distance = Math.hypot(dx, dy)
        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          context.globalAlpha = opacity
          context.beginPath()
          context.moveTo(this.particles[a].x, this.particles[a].y)
          context.lineTo(this.particles[b].x, this.particles[b].y)
          context.stroke()
        }
      }
    }

  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height
    this.context.fillStyle
    const gradient = this.context.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(0.5, 'gold')
    gradient.addColorStop(1, 'orangered')
    this.context.fillStyle = gradient
    this.context.strokeStyle = '#fff'
    this.particles.forEach(particle => {
      particle.reset()
    })
  }
}
const effect = new Effect(canvas, ctx)


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.handleParticles(ctx)
  requestAnimationFrame(animate)
}
animate()










// window.addEventListener('resize', () => {
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
// })