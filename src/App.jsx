import './App.css'
import NavSection from './Components/NavSection';
import Home from './Components/Home/Home';
import Photography from './Components/Photography/Photography';
import Film from './Components/Film/Film';
import Woodworking from './Components/Woodworking/Woodworking';
import About from './Components/About/About';


import { Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <>
      <NavSection/>
      <div className='routes-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/film" element={<Film />} />
          <Route path="/woodworking" element={<Woodworking />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  )
}