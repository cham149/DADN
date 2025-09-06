import React from 'react'
import "../style/Header.css";

const Header = ({ toggleMenu }) => {
  return (
    <div className='header-container'>
        <i className="ri-dashboard-horizontal-fill" id='tab-menu' onClick={toggleMenu}></i>
        <h1>HỆ THỐNG ADMIN</h1>
        <img src="https://i.pinimg.com/736x/20/ef/6b/20ef6b554ea249790281e6677abc4160.jpg" alt="" />
    </div>
  )
}

export default Header
