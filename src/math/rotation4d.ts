import type { Vec4, Mat4 } from './types'

export function rotateXY(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [c, -s,  0, 0,
          s,  c,  0, 0,
          0,  0,  1, 0,
          0,  0,  0, 1]
}

export function rotateXZ(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [c,  0, -s, 0,
          0,  1,  0, 0,
          s,  0,  c, 0,
          0,  0,  0, 1]
}

export function rotateXW(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [c,  0, 0, -s,
          0,  1, 0,  0,
          0,  0, 1,  0,
          s,  0, 0,  c]
}

export function rotateYZ(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [1,  0,  0, 0,
          0,  c, -s, 0,
          0,  s,  c, 0,
          0,  0,  0, 1]
}

export function rotateYW(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [1, 0,  0, 0,
          0, c,  0, -s,
          0, 0,  1,  0,
          0, s,  0,  c]
}

export function rotateZW(theta: number): Mat4 {
  const c = Math.cos(theta), s = Math.sin(theta)
  return [1, 0, 0,  0,
          0, 1, 0,  0,
          0, 0, c, -s,
          0, 0, s,  c]
}

// Row-major matrix multiplication: C = A × B
// C[r][c] = Σ_k A[r][k] * B[k][c]
export function multiplyMat4(a: Mat4, b: Mat4): Mat4 {
  const out: number[] = new Array(16)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      out[r*4+c] = a[r*4+0]*b[c]    + a[r*4+1]*b[4+c]
                 + a[r*4+2]*b[8+c]  + a[r*4+3]*b[12+c]
    }
  }
  return out
}

// Row-major M × column vector v
export function applyMat4(m: Mat4, v: Vec4): Vec4 {
  return [
    m[0]*v[0] + m[1]*v[1] + m[2]*v[2] + m[3]*v[3],
    m[4]*v[0] + m[5]*v[1] + m[6]*v[2] + m[7]*v[3],
    m[8]*v[0] + m[9]*v[1] + m[10]*v[2] + m[11]*v[3],
    m[12]*v[0] + m[13]*v[1] + m[14]*v[2] + m[15]*v[3],
  ]
}
