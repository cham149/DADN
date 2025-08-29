import React from "react";
import "../style/Login.css";
import image from "../assets/image.jpg"; 

const Login = () => {
  return (
    <div className="container">
        <div className="form">
            <form action="" method="post">
            <h2>ADMIN LOGIN</h2>
            <input className="name" type="text" placeholder="Admin Name" />
            <input className="pass" type="password" placeholder="Password" />
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

export default Login;
