import { test, expect } from 'vitest'
import { rotateXY, rotateXZ, rotateXW, rotateYZ, rotateYW, rotateZW, multiplyMat4, applyMat4 } from './rotation4d'
import type { Vec4 } from './types'

function expectVec4Close(actual: Vec4, expected: Vec4, precision = 10) {
  expected.forEach((e, i) => expect(actual[i]).toBeCloseTo(e, precision))
}

test('rotateXY(0) is identity — leaves [1,2,3,4] unchanged', () => {
  const m = rotateXY(0)
  expectVec4Close(applyMat4(m, [1, 2, 3, 4]), [1, 2, 3, 4])
})

test('rotateXY(π/2) sends [1,0,0,0] to [0,1,0,0]', () => {
  const m = rotateXY(Math.PI / 2)
  expectVec4Close(applyMat4(m, [1, 0, 0, 0]), [0, 1, 0, 0])
})

test('rotateXY leaves Z and W unchanged', () => {
  const m = rotateXY(Math.PI / 3)
  const result = applyMat4(m, [0, 0, 5, 7])
  expectVec4Close(result, [0, 0, 5, 7])
})

test('rotateXW(π/2) sends [1,0,0,0] to [0,0,0,1]', () => {
  const m = rotateXW(Math.PI / 2)
  expectVec4Close(applyMat4(m, [1, 0, 0, 0]), [0, 0, 0, 1])
})

test('rotateYZ(π/2) sends [0,1,0,0] to [0,0,1,0]', () => {
  const m = rotateYZ(Math.PI / 2)
  expectVec4Close(applyMat4(m, [0, 1, 0, 0]), [0, 0, 1, 0])
})

test('rotateZW(π/2) sends [0,0,1,0] to [0,0,0,1]', () => {
  const m = rotateZW(Math.PI / 2)
  expectVec4Close(applyMat4(m, [0, 0, 1, 0]), [0, 0, 0, 1])
})

test('multiplyMat4: two 90° XY rotations compose to 180°', () => {
  const r90 = rotateXY(Math.PI / 2)
  const r180 = rotateXY(Math.PI)
  const composed = multiplyMat4(r90, r90)
  const v: Vec4 = [1, 0, 0, 0]
  expectVec4Close(applyMat4(composed, v), applyMat4(r180, v))
})

test('multiplyMat4 with identity leaves matrix unchanged', () => {
  const identity: number[] = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
  const r = rotateXY(1.23)
  const composed = multiplyMat4(r, identity)
  const v: Vec4 = [1, 2, 3, 4]
  expectVec4Close(applyMat4(composed, v), applyMat4(r, v))
})
