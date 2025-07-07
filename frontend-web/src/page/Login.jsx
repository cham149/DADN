import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import "../style/LoginSignup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Đăng nhập
  const handleLogin = async (data) => {
    if (!data.username) return alert("Tên đăng nhập là bắt buộc!");
    if (data.password.length < 6) return alert("Mật khẩu phải trên 6 ký tự!");
    if (!/[A-Z]/.test(data.password)) return alert("Phải có ít nhất 1 chữ in hoa!");
    if (!/[a-z]/.test(data.password)) return alert("Phải có ít nhất 1 chữ thường!");
    if (!/[!@#$%^&*]/.test(data.password)) return alert("Phải có ít nhất 1 ký tự đặc biệt!");

    try {
      const submitData = {
        ten: data.username,
        matkhau: data.password,
      };
      const response = await axios.post("http://localhost:5000/api/login", submitData);
      alert(response.data.message || "Đăng nhập thành công!");
      
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi kết nối server khi đăng nhập!");
    }
  };

  // Đăng ký
  const handleRegister = async (data) => {
    if (!data.new_username) return alert("Tên đăng ký là bắt buộc!");
    if (!data.role) return alert("Vui lòng chọn danh tính!");
    if (data.new_password.length < 6) return alert("Mật khẩu phải trên 6 ký tự!");
    if (!/[A-Z]/.test(data.new_password)) return alert("Phải có chữ in hoa!");
    if (!/[a-z]/.test(data.new_password)) return alert("Phải có chữ thường!");
    if (!/[!@#$%^&*]/.test(data.new_password)) return alert("Phải có ký tự đặc biệt!");
    if (data.new_password !== data.re_password) return alert("Mật khẩu không khớp!");
    if (!data.email.endsWith("@gmail.com")) return alert("Email phải có dạng @gmail.com!");

    try {
      const submitData = {
        ten: data.new_username,
        email: data.email,
        matkhau: data.new_password,
        vaiTro: data.role === "buyer" ? "Cá nhân" : "Trang",
      };
      const response = await axios.post("http://localhost:5000/api/signup", submitData);
      alert(response.data.message || "Đăng ký thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi kết nối server khi đăng ký!");
    }
  };

  return (
    <div className={`container ${isRegistering ? "reverse" : ""}`}>
      {/* BÊN TRÁI */}
      <div className="container__left">
        <p>
          {isRegistering
            ? "Cho đi là điều đẹp nhất, và minh bạch là cách khiến điều đẹp ấy không bị đánh mất trên đường đến tay người cần."
            : "Bạn có thể không dùng nữa, nhưng với ai đó, nó là thứ cần thiết nhất. Việc mua – bán đồ cũ chính là cách kết nối lặng lẽ và ý nghĩa."}
        </p>
        <button
          className="button__reverse"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Đăng nhập" : "Đăng ký"}
        </button>
        <img src={isRegistering ? img1 : img2} alt="Background" />
      </div>

      {/* FORM ĐĂNG NHẬP */}
      <div className="form-wrapper login">
        {!isRegistering && (
          <form onSubmit={handleSubmit(handleLogin)}>
            <h1>Đăng nhập</h1>
            <div className="input-wrapper">
              <i className="ri-user-line"></i>
              <input {...register("username")} placeholder="Tên đăng nhập" />
            </div>
            <div className="input-wrapper">
              <i className="ri-lock-line"></i>
              <input {...register("password")} type="password" placeholder="Mật khẩu" />
            </div>
            <button type="submit">Đăng nhập</button>
            <a>Hoặc đăng nhập với</a>
            <div className="container__icon">
              <i className="ri-mail-line"></i>
              <i className="ri-facebook-circle-line"></i>
              <i className="ri-twitter-line"></i>
            </div>
            <Link to="/">Trang chủ</Link>
          </form>
        )}
      </div>

      {/* FORM ĐĂNG KÝ */}
      <div className="form-wrapper register">
        {isRegistering && (
          <form onSubmit={handleSubmit(handleRegister)}>
            <h1>Đăng ký</h1>
            <div className="input-wrapper">
              <i className="ri-user-line"></i>
              <input {...register("new_username")} placeholder="Tên đăng ký" />
            </div>
            <div className="input-radio">
              <label style={{width:"60%"}}>Bạn là:</label>
              <label>
                <input type="radio" value="buyer" {...register("role")} /> Cá nhân
              </label>
              <label>
                <input type="radio" value="seller" {...register("role")} /> Trang
              </label>
            </div>
            <div className="input-wrapper">
              <i className="ri-mail-line"></i>
              <input {...register("email")} placeholder="Email" />
            </div>
            <div className="input-wrapper">
              <i className="ri-lock-line"></i>
              <input {...register("new_password")} type="password" placeholder="Mật khẩu" />
            </div>
            <div className="input-wrapper">
              <i className="ri-lock-line"></i>
              <input {...register("re_password")} type="password" placeholder="Nhập lại mật khẩu" />
            </div>
            <button type="submit">Đăng ký</button>
            <a>Hoặc đăng nhập với</a>
            <div className="container__icon">
              <i className="ri-mail-line"></i>
              <i className="ri-facebook-circle-line"></i>
              <i className="ri-twitter-line"></i>
            </div>
            <Link to="/">Trang chủ</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
