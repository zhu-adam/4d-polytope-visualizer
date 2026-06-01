import type { Vec4, Vec3 } from './types'

export function perspectiveProject(v: Vec4, d: number): Vec3 {
  const scale = d / (d - v[3])
  return [v[0] * scale, v[1] * scale, v[2] * scale]
}
