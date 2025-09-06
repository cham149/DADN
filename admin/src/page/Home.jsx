import React, { useState } from 'react'
import Menu from '../components/Menu';
import Header from '../components/Header';
import Banner from '../components/Banner';

import HumanResources from '../components/HumanResources';
import Post from '../components/Post';
import Report from '../components/Report';
// import ThongKe from '../components/ThongKe';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bannerText, setBannerText] = useState("QUẢN LÝ NHÂN SỰ");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => { if (isOpen) setIsOpen(false); };

const renderContent = () => {
  switch (bannerText) {
    case "ADMIN":
      return <HumanResources type="admin" />;
    case "USER":
      return <HumanResources type="user" />;
    case "QUẢN LÝ BÀI ĐĂNG":
      return <Post />;
    case "QUẢN LÝ BÁO CÁO":
      return <Report />;
    default:
      return null ;
  }
};

  return (
    <div>
      <Header toggleMenu={toggleMenu} />
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}

      <Menu isOpen={isOpen} setBannerText={setBannerText} />
      <Banner text={bannerText} />

      <div className="home-content" onClick={closeMenu}>
        {renderContent()}
      </div>
    </div>
  )
}

export default Home
