import React from 'react'
import '../style/Reported.css'

const Reported = () => {
  return (
    <>
    <div className='reported-container'>
        <label className='reported-id'>68aa951f92ac9843c4bfb03d</label>
        <img className='reported-post-avatar' src="https://i.pinimg.com/736x/b1/0e/b0/b10eb075e21b6fd74eabcf31cd88c795.jpg" alt="" />
        <div className='reported-post-infor'>
            <label className='reported-reason'>lý do: Lừa đảo</label>
            <label className='reported-status'>trạng thái báo cáo: 2</label>
        </div>
        <div className='reported-button-container'>
          <button className='reported-button-yes'>Duyệt</button>
          <button className='reported-button-no'>Không duyệt</button>
        </div>
    </div>
    </>
  )
}

export default Reported