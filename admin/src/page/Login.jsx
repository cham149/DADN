import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";
import image from "../assets/image.jpg";

const AdminLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // Xử lý đăng nhập Admin
  const handleAdminLogin = async (data) => {
    if (!data.username) return alert("Tên Admin là bắt buộc!");
    if (!data.password) return alert("Mật khẩu không được để trống!");

    try {
      const submitData = {
        ten: data.username,
        matkhau: data.password,
      };
      const response = await axios.post("http://localhost:5000/api/admin/login", submitData);

      alert(response.data.message || "Đăng nhập admin thành công!");
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      // Điều hướng sang dashboard admin
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Tên hoặc mật khẩu Admin không đúng!");
    }
  };

  return (
    <div className="container">
      <div className="form">
        <form onSubmit={handleSubmit(handleAdminLogin)}>
          <h2>ADMIN LOGIN</h2>
          <input
            className="name"
            type="text"
            placeholder="Admin Name"
            {...register("username")}
          />
          <input
            className="pass"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <button name="login" type="submit">
            LOGIN
          </button>
        </form>
      </div>
      <div className="image">
        <img src={image} alt="admin login" />
      </div>
    </div>
  );
};

export default AdminLogin;
