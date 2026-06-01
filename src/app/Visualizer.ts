import { getVertices, getEdges } from '../geometry/cell24'
import { rotateXY, rotateXZ, rotateXW, rotateYZ, rotateYW, rotateZW, multiplyMat4, applyMat4 } from '../math/rotation4d'
import { perspectiveProject } from '../math/projection'
import { Renderer } from '../renderer/Renderer'

const VELOCITIES = [0.31, 0.47, 0.19, 0.53, 0.37, 0.61]

const VIEWER_DISTANCE = 3.0
const W_RANGE = Math.SQRT2

function wToColor(w: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, (w + W_RANGE) / (2 * W_RANGE)))
  return [t * 0.5, t * 0.9, 0.4 + t * 0.6]
}

export class Visualizer {
  private renderer: Renderer
  private vertices = getVertices()
  private edges = getEdges()
  private angles = [0, 0, 0, 0, 0, 0]
  private rafId: number | null = null
  private lastTime: number | null = null
  private positions: Float32Array
  private colors: Float32Array

  constructor(container: HTMLElement) {
    this.renderer = new Renderer(container, this.edges.length)
    this.positions = new Float32Array(this.edges.length * 6)
    this.colors = new Float32Array(this.edges.length * 6)
  }

  start(): void {
    this.rafId = requestAnimationFrame(t => this.tick(t))
  }

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.renderer.dispose()
  }

  private tick(time: DOMHighResTimeStamp): void {
    if (this.lastTime !== null) {
      const dt = Math.min((time - this.lastTime) / 1000, 1 / 30)
      for (let i = 0; i < 6; i++) this.angles[i] += VELOCITIES[i] * dt
    }
    this.lastTime = time

    const rot = [
      rotateXY(this.angles[0]),
      rotateXZ(this.angles[1]),
      rotateXW(this.angles[2]),
      rotateYZ(this.angles[3]),
      rotateYW(this.angles[4]),
      rotateZW(this.angles[5]),
    ].reduce((acc, m) => multiplyMat4(acc, m))

    const rotated = this.vertices.map(v => applyMat4(rot, v))
    const projected = rotated.map(v => perspectiveProject(v, VIEWER_DISTANCE))
    const wVals = rotated.map(v => v[3])

    const positions = this.positions
    const colors = this.colors

    this.edges.forEach(([i, j], e) => {
      const [x0, y0, z0] = projected[i]
      const [x1, y1, z1] = projected[j]
      positions[e*6+0] = x0; positions[e*6+1] = y0; positions[e*6+2] = z0
      positions[e*6+3] = x1; positions[e*6+4] = y1; positions[e*6+5] = z1

      const [r0, g0, b0] = wToColor(wVals[i])
      const [r1, g1, b1] = wToColor(wVals[j])
      colors[e*6+0] = r0; colors[e*6+1] = g0; colors[e*6+2] = b0
      colors[e*6+3] = r1; colors[e*6+4] = g1; colors[e*6+5] = b1
    })

    this.renderer.updateGeometry(positions, colors)
    this.rafId = requestAnimationFrame(t => this.tick(t))
  }
}
