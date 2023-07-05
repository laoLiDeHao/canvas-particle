const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight



ctx.fillStyle = "white"
ctx.strokeStyle = 'white'
ctx.lineWidth = 1
// ctx.arc(100,100,50,0,Math.PI*2);
// ctx.fill()
// ctx.lineCap = 'round'
// ctx.beginPath()
// ctx.moveTo(100,200)
// ctx.lineTo(400,500)
// ctx.stroke()
class Particle {
  constructor(effect) {
    this.effect = effect
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.speedX
    this.speedY
    this.speedModifier = Math.floor(Math.random() * 5 + 1)
    this.history = [{
      x: this.x,
      y: this.y
    }]
    this.maxLength = Math.floor(Math.random() * 200 + 10)
    this.angle = 0
    this.timer = this.maxLength * 2
    this.colors = ['#8504bf', '#ff0055', '#ff7300', '#d4ff00', '#00ff7b', '#8afffd', '#8aa3ff']
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
  }
  draw(context) {



    // create particles
    // context.fillRect(this.x, this.y, 10, 10)
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y)
    }
    context.strokeStyle = this.color
    context.lineWidth = 0.3
    context.stroke()
  }
  update() {
    this.timer--
    if (this.timer >= 1) {

      let x = Math.floor(this.x / this.effect.cellSize)
      let y = Math.floor(this.y / this.effect.cellSize)

      let index = y * this.effect.cols + x;
      this.angle = this.effect.flowField[index]

      this.speedX = Math.cos(this.angle)
      this.speedY = Math.sin(this.angle)

      this.x += this.speedX * this.speedModifier
      this.y += this.speedY * this.speedModifier




      this.history.push({
        x: this.x,
        y: this.y
      })
      if (this.history.length > this.maxLength) {
        this.history.shift()
      }

    } else if (this.history.length > 1) {
      this.history.shift()
    } else {
      this.reset()
    }

  }

  reset() {
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.history = [{
      x: this.x,
      y: this.y
    }]
    this.timer = this.maxLength * 2
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfparticles = 3000
    this.cellSize = 20
    this.rows;
    this.cols;
    this.flowField = []
    //  20 7 .5
    this.curve = 7 //线条离散度
    this.zoom = .5 //线条卷曲度
    this.debug = true
    this.init()

    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug
    })
    window.addEventListener('resize', e => {
      this.resize(e.target.innerWidth, e.target.innerHeight)
    })

  }

  init() {
    // create flow field
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.flowField = []
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve
        this.flowField.push(angle)
      }
    }
    // create particles
    this.particles = []
    for (let i = 0; i < this.numberOfparticles; i++)
      this.particles.push(new Particle(this))
  }
  drawGrid(context) {
    context.save()
    context.strokeStyle = 'white'
    context.lineWidth = 0.2
    for (let c = 0; c < this.cols; c++) {
      context.beginPath()
      context.moveTo(this.cellSize * c, 0)
      context.lineTo(this.cellSize * c, this.height)
      context.stroke()
    }
    for (let r = 0; r < this.rows; r++) {
      context.beginPath();
      context.moveTo(0, this.cellSize * r)
      context.lineTo(this.width, this.cellSize * r)
      context.stroke()
    }
    context.restore()
  }
  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.init()
  }
  render(context) {
    this.debug && this.drawGrid(context)
    this.particles.forEach(particle => {
      particle.draw(context)
      particle.update()
    })
  }
}

const effect = new Effect(canvas)





function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.render(ctx)

  requestAnimationFrame(animate)
}
animate()