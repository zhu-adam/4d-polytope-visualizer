import { test, expect } from 'vitest'
import { perspectiveProject } from './projection'

test('w=0 leaves XYZ unchanged (scale factor = 1)', () => {
  // factor = d/(d-0) = 1
  const result = perspectiveProject([3, -2, 5, 0], 3)
  expect(result[0]).toBeCloseTo(3)
  expect(result[1]).toBeCloseTo(-2)
  expect(result[2]).toBeCloseTo(5)
})

test('positive W scales up (point nearer than origin)', () => {
  // factor = 3/(3-1.5) = 2
  const result = perspectiveProject([1, 0, 0, 1.5], 3)
  expect(result[0]).toBeCloseTo(2)
  expect(result[1]).toBeCloseTo(0)
  expect(result[2]).toBeCloseTo(0)
})

test('negative W scales down (point farther than origin)', () => {
  // factor = 3/(3-(-3)) = 0.5
  const result = perspectiveProject([2, 4, 0, -3], 3)
  expect(result[0]).toBeCloseTo(1)
  expect(result[1]).toBeCloseTo(2)
  expect(result[2]).toBeCloseTo(0)
})

test('returns a Vec3 (length 3)', () => {
  expect(perspectiveProject([1, 2, 3, 0], 3)).toHaveLength(3)
})
