import React from 'react'
import { Image } from 'react-bootstrap';
import './Header.css';

function Header() {
  return (
    <div>
        <div className='header'>
            <Image className='logo' src="https://images.squarespace-cdn.com/content/v1/623b6c120a64d02ae34e6b2d/28c38736-e6b1-449d-9449-ba990dc1d188/BNY+Mellon%402x.png" />
        </div>
    </div>
  )
}

export default Header
