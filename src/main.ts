import { Application, Container, Graphics, Rectangle, Text } from 'pixi.js'
import { Character } from './character'
import { createRoom, WORLD_W, WORLD_H, HIT, SEAT, DESK_CENTER } from './scene'

const app = new Application()
await app.init({
  width: WORLD_W,
  height: WORLD_H,
  backgroundColor: 0x14131a,
  antialias: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  autoDensity: true,
})
document.getElementById('app')!.appendChild(app.canvas)

const room = createRoom()
app.stage.addChild(room.world)

const character = new Character('boy')
character.view.position.set(512, 570)
room.world.addChild(character.view)

// Laptop zoom overlay (screen-space, not affected by world zoom)
const laptopOverlay = new Container()
const panel = new Graphics()
panel.roundRect(212, 120, 600, 400, 12).fill(0x1b1b24)
panel.roundRect(212, 120, 600, 400, 12).stroke({ width: 2, color: 0x6c5ce7 })
laptopOverlay.addChild(panel)

const title = new Text({
  text: 'Study Room OS',
  style: { fontFamily: 'monospace', fontSize: 26, fontWeight: 'bold', fill: 0xa29bff },
})
title.position.set(246, 156)
laptopOverlay.addChild(title)

const lines = new Text({
  text: '> ready to study_\n> timer   : 25:00\n> tasks   : 0\n> focus   : on\n\n(click Close to return to the room)',
  style: { fontFamily: 'monospace', fontSize: 17, fill: 0xd8d3ff, lineHeight: 28 },
})
lines.position.set(246, 210)
laptopOverlay.addChild(lines)
laptopOverlay.visible = false
app.stage.addChild(laptopOverlay)

const closeBtn = document.getElementById('closeZoom')!
const boyBtn = document.getElementById('boyBtn')!
const girlBtn = document.getElementById('girlBtn')!

let zoomed = false
let targetScale = 1
let targetX = 0
let targetY = 0
let coffeeFull = true
let windowOpen = true
let steamPhase = 0

function zoomTo(scale: number, cx: number, cy: number): void {
  targetScale = scale
  targetX = WORLD_W / 2 - cx * scale
  targetY = WORLD_H / 2 - cy * scale
}

function resetZoom(): void {
  targetScale = 1
  targetX = 0
  targetY = 0
}

room.world.eventMode = 'static'
room.world.hitArea = new Rectangle(0, 0, WORLD_W, WORLD_H)
room.world.on('pointerdown', (e) => {
  if (zoomed) return
  const p = e.getLocalPosition(room.world)

  if (HIT.laptop.contains(p.x, p.y)) {
    zoomed = true
    zoomTo(1.9, DESK_CENTER.x, DESK_CENTER.y)
    laptopOverlay.visible = true
    closeBtn.classList.remove('hidden')
    return
  }
  if (HIT.chair.contains(p.x, p.y)) {
    character.sitAt(SEAT.x, SEAT.y)
    return
  }
  if (HIT.coffee.contains(p.x, p.y)) {
    coffeeFull = !coffeeFull
    room.coffeeLiquid.visible = coffeeFull
    return
  }
  if (HIT.window.contains(p.x, p.y)) {
    windowOpen = !windowOpen
    room.windowGlass.tint = windowOpen ? 0xffffff : 0x8899aa
    return
  }
  if (p.y > 390) {
    character.walkTo(p.x, Math.min(p.y, 612))
  }
})

closeBtn.addEventListener('click', () => {
  zoomed = false
  resetZoom()
  laptopOverlay.visible = false
  closeBtn.classList.add('hidden')
})

boyBtn.addEventListener('click', () => {
  character.setGender('boy')
  boyBtn.classList.add('active')
  girlBtn.classList.remove('active')
})

girlBtn.addEventListener('click', () => {
  character.setGender('girl')
  girlBtn.classList.add('active')
  boyBtn.classList.remove('active')
})

function updateClock(): void {
  const d = new Date()
  room.clockText.text = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
updateClock()
window.setInterval(updateClock, 1000)

app.ticker.add((ticker) => {
  const dt = ticker.deltaTime

  character.update(dt)

  const k = Math.min(1, 0.14 * dt)
  room.world.scale.x += (targetScale - room.world.scale.x) * k
  room.world.scale.y = room.world.scale.x
  room.world.x += (targetX - room.world.x) * k
  room.world.y += (targetY - room.world.y) * k

  room.steam.clear()
  if (coffeeFull) {
    steamPhase += 0.05 * dt
    for (let i = 0; i < 3; i++) {
      const t = (steamPhase + i / 3) % 1
      const sx = 630 + Math.sin(t * 6 + i) * 4
      const sy = 268 - t * 26
      room.steam.circle(sx, sy, 2 + t * 2).fill({ color: 0xffffff, alpha: (1 - t) * 0.4 })
    }
  }
})
