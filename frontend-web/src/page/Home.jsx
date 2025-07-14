import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Category from '../components/Category';
import ChatList from '../components/ChatList';
import PostCard from '../components/PostCard';
import "../style/Home.css";
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);      // Danh sách bài đăng đã load
  const [page, setPage] = useState(1);         // Trang hiện tại (mặc định là 1)
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn bài để tải hay không
  const loaderRef = useRef(null);              // Ref cho phần tử cuối cùng để theo dõi khi scroll chạm tới

  // Fetch dữ liệu bài đăng
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts?page=${page}`);
        console.log("📥 Dữ liệu từ server:", res.data);

        if (res.data.length < 10) setHasMore(false); // Nếu ít hơn 10 bài => hết dữ liệu
        
        setPosts(prev => {
          const prevIds = new Set(prev.map(p => p._id));
          const newPosts = res.data.filter(p => !prevIds.has(p._id));
          const mergedPosts = [...prev, ...newPosts];

          // Kiểm tra ID trùng
          const idCount = {};
          mergedPosts.forEach(post => {
            idCount[post._id] = (idCount[post._id] || 0) + 1;
          });
          const duplicatedIds = Object.entries(idCount)
            .filter(([_, count]) => count > 1)
            .map(([id]) => id);

          if (duplicatedIds.length > 0) {
            console.warn("📛 Các _id bị trùng:", duplicatedIds);
          }

          return mergedPosts;
        });

      } catch (err) {
        console.error("❌ Lỗi khi fetch bài đăng:", err);
      }
    };

    fetchPosts();
  }, [page]);

  // Tự động load thêm khi cuộn đến cuối
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore]);

  return (
    <div>
      <Header />
      <div className='body'>
        <div className='category'><Category /></div>

        <div className='postlist'>
          {posts.map((post) => {
            return (
              <PostCard
                key={post._id}
                avatar={post.nguoiDang?.avatar}
                tenNguoiDung={post.nguoiDang?.ten}
                thoiGianCapNhat={new Date(post.thoiGianCapNhat).toLocaleString()}
                moTaSP={post.moTa}
                anhSP={post.hinhAnh.startsWith("http") 
                  ? post.hinhAnh 
                  : `http://localhost:5000/uploads/${post.hinhAnh}`
                }

                diaChi={post.diaChi}
                danhMuc={post.danhMuc?.tenDanhMuc}
                tinhTrangVatDung={post.tinhTrangVatDung}
                trangThaiBaiDang={post.trangThaiBaiDang}
                loaiGiaoDich={post.loaiGiaoDich}
                soLuong={post.soLuong}
                soTien={post.giaTien}
                isProfilePage={false}
              />
            );
          })}
          {hasMore && (
            <div ref={loaderRef} style={{ textAlign: "center", padding: 20 }}>
              Đang tải thêm...
            </div>
          )}
        </div>

        <div className='chatlist'><ChatList /></div>
      </div>
    </div>
  );
};

export default Home;
