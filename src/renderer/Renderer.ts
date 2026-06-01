import * as THREE from 'three'

export class Renderer {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private webgl: THREE.WebGLRenderer
  private geometry: THREE.BufferGeometry
  private material: THREE.LineBasicMaterial
  private lineSegments: THREE.LineSegments

  constructor(container: HTMLElement, edgeCount: number) {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    )
    this.camera.position.set(0, 0, 4)

    this.webgl = new THREE.WebGLRenderer({ antialias: true })
    this.webgl.setPixelRatio(window.devicePixelRatio)
    this.webgl.setSize(window.innerWidth, window.innerHeight)
    this.webgl.setClearColor(0x000000)
    container.appendChild(this.webgl.domElement)

    // LineSegments layout: 2 vertices per edge, each with 3 floats
    this.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(edgeCount * 2 * 3)
    const colors = new Float32Array(edgeCount * 2 * 3)
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    this.material = new THREE.LineBasicMaterial({ vertexColors: true })
    this.lineSegments = new THREE.LineSegments(this.geometry, this.material)
    this.scene.add(this.lineSegments)

    window.addEventListener('resize', this.onResize)
  }

  updateGeometry(positions: Float32Array, colors: Float32Array): void {
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = this.geometry.attributes.color as THREE.BufferAttribute
    posAttr.array.set(positions)
    colAttr.array.set(colors)
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    this.webgl.render(this.scene, this.camera)
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize)
    this.scene.remove(this.lineSegments)
    this.geometry.dispose()
    this.material.dispose()
    this.webgl.dispose()
  }

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.webgl.setSize(window.innerWidth, window.innerHeight)
  }
}
