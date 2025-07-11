import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category'
import ChatList from '../components/ChatList'
import PostCard from '../components/PostCard'
import "../style/Home.css";


const Home = () => {
  return (
    <div>
      <Header/>
      <div className='body'>
        <div className='category'><Category/></div>
        <div className='postlist'><PostCard/></div>
        <div className='chatlist'><ChatList/></div>
      </div>
    </div>
  )
}

export default Home