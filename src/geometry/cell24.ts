import type { Vec4 } from '../math/types'

export function getVertices(): Vec4[] {
  const vertices: Vec4[] = []
  const signs = [1, -1] as const

  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const a of signs) {
        for (const b of signs) {
          const v: Vec4 = [0, 0, 0, 0]
          v[i] = a
          v[j] = b
          vertices.push(v)
        }
      }
    }
  }
  return vertices
}

export function getEdges(): [number, number][] {
  const vertices = getVertices()
  const edges: [number, number][] = []

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      if (Math.abs(dist2(vertices[i], vertices[j]) - 2) < 1e-10) {
        edges.push([i, j])
      }
    }
  }
  return edges
}

function dist2(a: Vec4, b: Vec4): number {
  return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2 + (a[3]-b[3])**2
}
