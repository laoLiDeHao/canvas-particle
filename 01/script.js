// setup
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
gradient.addColorStop(0, 'white')
gradient.addColorStop(0.5, 'magenta')
gradient.addColorStop(1, 'blue')
ctx.fillStyle = gradient
ctx.strokeStyle = '#fff'
class Particle {
  constructor(effect) {
    this.effect = effect
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
    this.vx = Math.random() * 4 - 2
    this.vy = Math.random() * 4 - 2
    this.fillStyle = `hsl( ${Math.random()*360},100%,50%)`
    this.strokeStyle = `hsl( ${Math.random()*360},100%,50%)`
    this.radius = Math.random() * 5 + 2

  }
  draw(context) {
    // context.fillStyle = "hsl(" + this.x * 0.5 + ",100%,50%)"
    // context.fillStyle = this.fillStyle
    // context.strokeStyle = this.strokeStyle
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;
    if (this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
  }
  reset() {
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 400
    this.createParticles()
    this.context = context
    window.addEventListener('resize', e => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
    })
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this))
    }
  }
  handleParticles(context) {
    this.particles.forEach(particle => {
      particle.draw(context)
      particle.update()
    })
    this.connectParticles(context)
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
    gradient.addColorStop(0.5, 'magenta')
    gradient.addColorStop(1, 'blue')
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