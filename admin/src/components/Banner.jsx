import React from 'react'
import image2 from "../assets/image2.jpg"; 
import "../style/Banner.css";

const Banner = ({ text }) => {
  return (
    <div className='banner'>
        <p>{text}</p> 
        <img src={image2} alt="banner" />
    </div>
  )
}

export default Banner
