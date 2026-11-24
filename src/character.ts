import { Container, Graphics } from 'pixi.js'

export type Gender = 'boy' | 'girl'
export type Pose = 'idle' | 'walk' | 'sit'

interface Palette {
  hair: number
  hairLight: number
  skin: number
  skinShade: number
  top: number
  topDark: number
  topLight: number
  bottom: number
  bottomLight: number
  shoe: number
  sole: number
  iris: number
  blush: number
}

const PALETTES: Record<Gender, Palette> = {
  boy: {
    hair: 0x2b1d12, hairLight: 0x513725, skin: 0xffd7b0, skinShade: 0xf0bf98,
    top: 0x3b82f6, topDark: 0x2563eb, topLight: 0x60a5fa,
    bottom: 0x27354d, bottomLight: 0x3a4b69, shoe: 0xf2f4f7, sole: 0x9aa5b5,
    iris: 0x4a6fa5, blush: 0xf5a0a0,
  },
  girl: {
    hair: 0x6b3f1d, hairLight: 0x986336, skin: 0xffd7b0, skinShade: 0xf0bf98,
    top: 0xec4899, topDark: 0xcf3a85, topLight: 0xf472b0,
    bottom: 0x4a2c5a, bottomLight: 0x654076, shoe: 0xf7f0f2, sole: 0xb59aa6,
    iris: 0x7b4a9e, blush: 0xf58fae,
  },
}

export class Character {
  readonly view = new Container()
  private readonly g = new Graphics()
  private gender: Gender
  private pose: Pose = 'idle'
  private phase = 0
  private facing: 1 | -1 = 1
  private target: { x: number; y: number } | null = null
  private sitTarget: { x: number; y: number } | null = null
  private readonly speed = 3.0

  constructor(gender: Gender) {
    this.gender = gender
    this.view.addChild(this.g)
    this.redraw()
  }

  setGender(gender: Gender): void {
    this.gender = gender
    this.redraw()
  }

  walkTo(x: number, y: number): void {
    this.target = { x, y }
    this.sitTarget = null
    if (this.pose === 'sit') {
      this.pose = 'idle'
      this.redraw()
    }
  }

  sitAt(x: number, y: number): void {
    this.target = { x, y }
    this.sitTarget = { x, y }
  }

  update(dt: number): void {
    if (this.target) {
      const dx = this.target.x - this.view.x
      const dy = this.target.y - this.view.y
      const dist = Math.hypot(dx, dy)
      const step = this.speed * dt

      if (dist <= step) {
        this.view.x = this.target.x
        this.view.y = this.target.y
        this.target = null
        if (this.sitTarget) {
          this.pose = 'sit'
          this.sitTarget = null
          this.redraw()
        } else if (this.pose === 'walk') {
          this.pose = 'idle'
          this.redraw()
        }
      } else {
        this.view.x += (dx / dist) * step
        this.view.y += (dy / dist) * step
        if (Math.abs(dx) > 2) this.facing = dx > 0 ? 1 : -1
        if (this.pose !== 'walk') {
          this.pose = 'walk'
          this.redraw()
        }
        this.phase += 0.22 * dt
        this.redraw()
      }
    }
    this.g.scale.x = this.facing
  }

  private redraw(): void {
    const g = this.g
    const p = PALETTES[this.gender]
    g.clear()

    const sitting = this.pose === 'sit'
    const bob = this.pose === 'walk' ? Math.abs(Math.sin(this.phase)) * 2 : 0
    const swing = this.pose === 'walk' ? Math.sin(this.phase) * 5 : 0

    g.ellipse(0, 2, 19, 5).fill({ color: 0x000000, alpha: 0.15 })

    if (sitting) {
      this.drawSittingLegs(g, p)
    } else {
      this.drawStandingLegs(g, p, bob, swing)
    }
    this.drawBody(g, p, sitting, bob)
    this.drawHead(g, p, sitting, bob)
  }

  private drawStandingLegs(g: Graphics, p: Palette, bob: number, swing: number): void {
    const ly = -36 + bob
    g.roundRect(-13 + swing * 0.45, ly, 11, 34, 5).fill(p.bottom)
    g.roundRect(3 - swing * 0.45, ly, 11, 34, 5).fill(p.bottom)
    g.roundRect(-12 + swing * 0.45, ly + 2, 3, 26, 2).fill(p.bottomLight)
    g.roundRect(4 - swing * 0.45, ly + 2, 3, 26, 2).fill(p.bottomLight)
    g.roundRect(-16 + swing * 0.45, -7 + bob, 15, 8, 4).fill(p.shoe)
    g.roundRect(2 - swing * 0.45, -7 + bob, 15, 8, 4).fill(p.shoe)
    g.roundRect(-16 + swing * 0.45, -1 + bob, 15, 3, 1).fill(p.sole)
    g.roundRect(2 - swing * 0.45, -1 + bob, 15, 3, 1).fill(p.sole)
  }

  private drawSittingLegs(g: Graphics, p: Palette): void {
    g.roundRect(-14, -48, 28, 22, 7).fill(p.bottom)
    g.roundRect(-12, -32, 26, 11, 5).fill(p.bottom)
    g.roundRect(-12, -19, 26, 11, 5).fill(p.bottom)
    g.roundRect(-10, -31, 20, 3, 2).fill(p.bottomLight)
    g.roundRect(-10, -18, 20, 3, 2).fill(p.bottomLight)
    g.roundRect(11, -30, 15, 8, 4).fill(p.shoe)
    g.roundRect(11, -17, 15, 8, 4).fill(p.shoe)
    g.roundRect(11, -24, 15, 3, 1).fill(p.sole)
    g.roundRect(11, -11, 15, 3, 1).fill(p.sole)
  }

  private drawBody(g: Graphics, p: Palette, sitting: boolean, bob: number): void {
    const top = sitting ? -74 : -70 + bob
    const arm = this.pose === 'walk' ? Math.sin(this.phase) * 4 : 0

    // hood behind shoulders
    g.ellipse(0, top + 3, 23, 18).fill(p.topDark)

    // sleeves
    g.roundRect(-26, top + 6 + arm, 11, 30, 5).fill(p.topDark)
    g.roundRect(15, top + 6 - arm, 11, 30, 5).fill(p.topDark)
    g.roundRect(-26, top + 6 + arm, 4, 26, 2).fill(p.topLight)
    g.roundRect(15, top + 6 - arm, 4, 26, 2).fill(p.topLight)

    // torso
    g.roundRect(-19, top, 38, 38, 11).fill(p.top)
    g.roundRect(-19, top, 38, 8, 8).fill(p.topLight)
    g.roundRect(-19, top + 30, 38, 8, 5).fill(p.topDark)

    // pocket + drawstrings
    g.roundRect(-11, top + 20, 22, 12, 4).fill(p.topDark)
    g.moveTo(-5, top + 8).lineTo(-5, top + 19).stroke({ width: 1.6, color: 0xf5f5f5 })
    g.moveTo(5, top + 8).lineTo(5, top + 19).stroke({ width: 1.6, color: 0xf5f5f5 })

    // hands
    g.circle(-21, top + 35 + arm, 4.5).fill(p.skin)
    g.circle(21, top + 35 - arm, 4.5).fill(p.skin)
    g.circle(-21, top + 34 + arm, 2).fill(p.skinShade)
    g.circle(21, top + 34 - arm, 2).fill(p.skinShade)
  }

  private drawHead(g: Graphics, p: Palette, sitting: boolean, bob: number): void {
    const hy = sitting ? -92 : -90 + bob
    const r = 16

    // hair back layer
    g.ellipse(0, hy + 2, r + 3, r + 3).fill(p.hair)
    if (this.gender === 'girl') {
      g.ellipse(-15, hy + 12, 6, 20).fill(p.hair)
      g.ellipse(15, hy + 12, 6, 20).fill(p.hair)
    }

    // face
    g.ellipse(0, hy + 1, r, r + 1).fill(p.skin)
    g.ellipse(-r + 2, hy + 2, 3, 8).fill(p.skinShade)

    // bangs with pointed strands
    g.ellipse(0, hy - 9, r + 2, 9).fill(p.hair)
    g.moveTo(-14, hy - 5).lineTo(-9, hy + 7).lineTo(-4, hy - 6).fill(p.hair)
    g.moveTo(-4, hy - 7).lineTo(2, hy + 8).lineTo(7, hy - 7).fill(p.hair)
    g.moveTo(7, hy - 7).lineTo(13, hy + 5).lineTo(16, hy - 4).fill(p.hair)
    g.moveTo(-8, hy - 13).lineTo(-2, hy - 16).lineTo(4, hy - 13).fill(p.hairLight)

    if (this.gender === 'girl') {
      g.ellipse(-16, hy + 4, 3, 12).fill(p.hairLight)
      g.ellipse(16, hy + 4, 3, 12).fill(p.hairLight)
    }

    // eyebrows
    g.moveTo(-10, hy - 3).lineTo(-4, hy - 4).stroke({ width: 1.6, color: p.hair })
    g.moveTo(4, hy - 4).lineTo(10, hy - 3).stroke({ width: 1.6, color: p.hair })

    // eyes
    for (const ex of [-7, 7]) {
      g.ellipse(ex, hy + 3, 4, 5.5).fill(0xffffff)
      g.ellipse(ex, hy + 3.5, 2.8, 4).fill(p.iris)
      g.ellipse(ex, hy + 4, 1.3, 2.4).fill(0x1a1a24)
      g.circle(ex - 1, hy + 1.5, 1.3).fill(0xffffff)
      g.moveTo(ex - 4, hy - 1).lineTo(ex - 2, hy - 3).stroke({ width: 1.8, color: p.hair })
    }

    // nose, mouth, blush
    g.circle(0, hy + 8, 0.9).fill(p.skinShade)
    g.arc(0, hy + 9, 4, 0.25 * Math.PI, 0.75 * Math.PI).stroke({ width: 1.4, color: 0xb26161 })
    g.ellipse(-11, hy + 9, 3.5, 2).fill({ color: p.blush, alpha: 0.55 })
    g.ellipse(11, hy + 9, 3.5, 2).fill({ color: p.blush, alpha: 0.55 })
  }
}
