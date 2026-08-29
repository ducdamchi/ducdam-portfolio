import './App.css'
import Gallery from './Components/Gallery/Gallery'
import Gallery_Landing from './Components/Gallery/Gallery_Landing'
import {
  photographyConfig,
  woodworkingConfig,
  filmConfig,
} from './Components/Gallery/configs'
import Film_Landing from './Components/Film/Film_Landing'
import About from './Components/About/About'
import Contact from './Components/Contact/Contact'

import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <div className="bg-zinc-50">
      <div className="routes-container">
        <Routes>
          <Route
            path="/"
            element={<Gallery key="photography" config={photographyConfig} />}
          />
          <Route
            path="/photography"
            element={<Gallery key="photography" config={photographyConfig} />}
          />
          <Route
            path="/photography/:photoURL"
            element={<Gallery_Landing config={photographyConfig} />}
          />
          <Route
            path="/film"
            element={<Gallery key="film" config={filmConfig} />}
          />
          <Route path="/film/:filmURL" element={<Film_Landing />} />
          <Route
            path="/woodworking"
            element={<Gallery key="woodworking" config={woodworkingConfig} />}
          />
          <Route
            path="/woodworking/:woodURL"
            element={<Gallery_Landing config={woodworkingConfig} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  )
}
