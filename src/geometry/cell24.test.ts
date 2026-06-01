import { describe, test, expect } from 'vitest'
import { getVertices, getEdges } from './cell24'

describe('getVertices', () => {
  test('returns exactly 24 vertices', () => {
    expect(getVertices()).toHaveLength(24)
  })

  test('all vertices are 4D vectors with two ±1 components and two 0s', () => {
    for (const v of getVertices()) {
      const nonZero = v.filter(x => x !== 0)
      const zero = v.filter(x => x === 0)
      expect(nonZero).toHaveLength(2)
      expect(zero).toHaveLength(2)
      expect(nonZero.every(x => Math.abs(x) === 1)).toBe(true)
    }
  })

  test('all vertices lie on a 3-sphere of radius √2', () => {
    for (const v of getVertices()) {
      const mag2 = v[0] ** 2 + v[1] ** 2 + v[2] ** 2 + v[3] ** 2
      expect(mag2).toBeCloseTo(2, 10)
    }
  })

  test('all 24 vertices are distinct', () => {
    const verts = getVertices()
    const strs = new Set(verts.map(v => v.join(',')))
    expect(strs.size).toBe(24)
  })
})

describe('getEdges', () => {
  test('returns exactly 96 edges', () => {
    expect(getEdges()).toHaveLength(96)
  })

  test('each vertex has exactly 8 neighbors', () => {
    const edges = getEdges()
    const degree = new Array(24).fill(0)
    for (const [i, j] of edges) {
      degree[i]++
      degree[j]++
    }
    for (const d of degree) {
      expect(d).toBe(8)
    }
  })

  test('all edge indices are valid (0–23)', () => {
    for (const [i, j] of getEdges()) {
      expect(i).toBeGreaterThanOrEqual(0)
      expect(i).toBeLessThan(24)
      expect(j).toBeGreaterThanOrEqual(0)
      expect(j).toBeLessThan(24)
      expect(i).not.toBe(j)
    }
  })

  test('connected vertices are distance √2 apart', () => {
    const verts = getVertices()
    for (const [i, j] of getEdges()) {
      const v = verts[i], w = verts[j]
      const d2 = (v[0]-w[0])**2 + (v[1]-w[1])**2 + (v[2]-w[2])**2 + (v[3]-w[3])**2
      expect(d2).toBeCloseTo(2, 10)
    }
  })
})
