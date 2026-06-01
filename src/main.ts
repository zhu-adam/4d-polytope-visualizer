import { Visualizer } from './app/Visualizer'

const app = document.getElementById('app')!
const visualizer = new Visualizer(app)
visualizer.start()
