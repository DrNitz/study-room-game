import { Container, Graphics, Rectangle, Text } from 'pixi.js'

export const WORLD_W = 1024
export const WORLD_H = 640

export const HIT = {
  laptop: new Rectangle(428, 238, 132, 72),
  coffee: new Rectangle(612, 264, 46, 46),
  chair: new Rectangle(512, 350, 108, 132),
  window: new Rectangle(84, 64, 232, 184),
  clock: new Rectangle(782, 62, 96, 96),
}

export const SEAT = { x: 565, y: 470 }
export const DESK_CENTER = { x: 510, y: 285 }

export interface RoomRefs {
  world: Container
  clockText: Text
  steam: Graphics
  windowGlass: Graphics
  coffeeLiquid: Graphics
  laptopScreen: Graphics
}

export function createRoom(): RoomRefs {
  const world = new Container()

  const wall = new Graphics()
  wall.rect(0, 0, WORLD_W, 380).fill(0xf2e1cb)
  wall.rect(0, 360, WORLD_W, 20).fill(0xe3c9a8)
  for (let x = 0; x < WORLD_W; x += 64) {
    wall.rect(x, 0, 1, 360).fill({ color: 0xdcc3a3, alpha: 0.35 })
  }
  world.addChild(wall)

  const floor = new Graphics()
  floor.rect(0, 380, WORLD_W, 260).fill(0xc39c6e)
  for (let i = 0; i <= 8; i++) {
    floor.moveTo(0, 380 + i * 33).lineTo(WORLD_W, 380 + i * 33).stroke({ width: 1.5, color: 0xa98055, alpha: 0.45 })
  }
  floor.rect(0, 374, WORLD_W, 8).fill(0x9c774f)
  world.addChild(floor)

  const rug = new Graphics()
  rug.ellipse(512, 520, 230, 78).fill(0x7e5f7d)
  rug.ellipse(512, 520, 200, 62).fill({ color: 0xa784a5, alpha: 0.55 })
  rug.ellipse(512, 520, 150, 44).fill({ color: 0xc9aec8, alpha: 0.35 })
  world.addChild(rug)

  const winFrame = new Graphics()
  winFrame.roundRect(88, 68, 224, 174, 4).fill(0xfaf6ef)
  winFrame.roundRect(96, 76, 208, 158, 2).fill(0x8ec5e8)
  world.addChild(winFrame)

  const windowGlass = new Graphics()
  windowGlass.circle(260, 112, 18).fill(0xffe08a)
  windowGlass.ellipse(150, 190, 34, 12).fill({ color: 0xffffff, alpha: 0.85 })
  windowGlass.ellipse(180, 182, 24, 10).fill({ color: 0xffffff, alpha: 0.85 })
  windowGlass.ellipse(250, 205, 30, 11).fill({ color: 0xffffff, alpha: 0.75 })
  world.addChild(windowGlass)

  const winBars = new Graphics()
  winBars.rect(196, 76, 8, 158).fill(0xfaf6ef)
  winBars.rect(96, 150, 208, 8).fill(0xfaf6ef)
  winBars.rect(88, 68, 224, 174).stroke({ width: 4, color: 0xd8cbbb })
  world.addChild(winBars)

  const curtains = new Graphics()
  curtains.roundRect(76, 60, 26, 190, 6).fill(0xb4666e)
  curtains.roundRect(298, 60, 26, 190, 6).fill(0xb4666e)
  curtains.roundRect(74, 56, 252, 14, 4).fill(0x8f4b53)
  world.addChild(curtains)

  const clock = new Graphics()
  clock.circle(830, 110, 46).fill(0xfaf6ef)
  clock.circle(830, 110, 42).stroke({ width: 3, color: 0x3a3a48 })
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    clock.moveTo(830 + Math.cos(a) * 34, 110 + Math.sin(a) * 34)
      .lineTo(830 + Math.cos(a) * 38, 110 + Math.sin(a) * 38)
      .stroke({ width: i % 3 === 0 ? 3 : 1.5, color: 0x3a3a48 })
  }
  world.addChild(clock)

  const clockText = new Text({
    text: '00:00',
    style: { fontFamily: 'monospace', fontSize: 19, fontWeight: 'bold', fill: 0x2d2d38 },
  })
  clockText.anchor.set(0.5)
  clockText.position.set(830, 116)
  world.addChild(clockText)

  const desk = new Graphics()
  desk.roundRect(356, 318, 16, 100, 3).fill(0x7a4a26)
  desk.roundRect(648, 318, 16, 100, 3).fill(0x7a4a26)
  desk.roundRect(336, 296, 348, 24, 5).fill(0x9c6234)
  desk.roundRect(336, 296, 348, 7, 5).fill(0xb87a46)
  world.addChild(desk)

  const laptop = new Graphics()
  laptop.roundRect(442, 240, 104, 58, 4).fill(0x2a2a35)
  laptop.roundRect(447, 245, 94, 48, 2).fill(0x1b1b24)
  const laptopScreen = new Graphics()
  laptopScreen.rect(447, 245, 94, 48).fill({ color: 0x6c5ce7, alpha: 0.18 })
  for (let i = 0; i < 5; i++) {
    laptopScreen.rect(452, 250 + i * 8, 40 + (i % 3) * 14, 3).fill({ color: 0x8a7cff, alpha: 0.7 })
  }
  laptopScreen.rect(452, 250, 84, 2).fill(0xa29bff)
  laptop.addChild(laptopScreen)
  laptop.roundRect(430, 296, 128, 9, 3).fill(0x4a4a58)
  laptop.roundRect(488, 303, 12, 3, 1).fill(0x6a6a7a)
  world.addChild(laptop)

  const cup = new Graphics()
  cup.roundRect(618, 274, 30, 28, 5).fill(0xf7f3ec)
  cup.ellipse(633, 276, 14, 4).fill(0xf7f3ec)
  cup.arc(648, 284, 8, -Math.PI / 2, Math.PI / 2).stroke({ width: 3, color: 0xf7f3ec })
  world.addChild(cup)

  const coffeeLiquid = new Graphics()
  coffeeLiquid.ellipse(633, 276, 11, 2.6).fill(0x5b3620)
  world.addChild(coffeeLiquid)

  const steam = new Graphics()
  world.addChild(steam)

  const chair = new Graphics()
  chair.roundRect(528, 352, 76, 52, 8).fill(0x5c3b7a)
  chair.roundRect(534, 358, 64, 40, 6).fill(0x744d94)
  chair.roundRect(516, 424, 100, 14, 5).fill(0x5c3b7a)
  chair.roundRect(522, 438, 9, 44, 3).fill(0x45305c)
  chair.roundRect(601, 438, 9, 44, 3).fill(0x45305c)
  world.addChild(chair)

  return { world, clockText, steam, windowGlass, coffeeLiquid, laptopScreen }
}
