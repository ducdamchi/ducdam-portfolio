import React from 'react'
import { useState, useRef, useEffect } from 'react'

export default function Carousel_Items() {
  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 

  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([]);    
  const [clonesRight, setClonesRight] = useState([]);  
}