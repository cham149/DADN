import React from 'react'
import "../style/Report.css";
import Reported from './Reported';
import UserCard from './UserCard';

const report = () => {
  return (
    <>
    <div>
        <div className='report-header'>
            <label>Danh sách chờ</label>
        </div>
        <div className='report-body'>
            <Reported></Reported>
            <Reported></Reported>
            <Reported></Reported>
            <Reported></Reported>
        </div>
        <div className='report-header'>
            <label>Danh sách đã duyệt</label>
        </div>
        <div className='report-body'>
            <Reported></Reported>
            <Reported></Reported>
            <Reported></Reported>
            <Reported></Reported>
        </div>
        <div className='report-header'>
            <label>Danh sách những tài khoản sẽ bị khóa</label>
        </div>
        <div className='report-body'>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
            <UserCard></UserCard>
        </div>

    </div>
    </>
  )
}

export default report