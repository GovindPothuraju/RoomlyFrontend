import { useState } from "react";
import {ArrowRight,} from "lucide-react";

import logo from "../assets/logo.png";
import heroDashboard from "../assets/heroImage.png";
import axios from "axios";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/userSlice";

import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function LoginPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const [authLoading, setAuthLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://roomlybackend.onrender.com/api/v1/user/profile",
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.user));

      navigate("/home/meetings", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://roomlybackend.onrender.com/api/v1/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.user));

      navigate("/home/meetings", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://roomlybackend.onrender.com/api/v1/user/register",
        {
          name,
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.user));

      navigate("/home/meetings", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };


  if (authLoading) {
    return (
      <div className="h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="animate-pulse">
            
            <div className="h-10 w-40 mx-auto rounded bg-slate-200" />

            <div className="mt-8 h-5 w-60 mx-auto rounded bg-slate-200" />

            <div className="mt-10 h-14 rounded-xl bg-slate-200" />

            <div className="mt-4 h-14 rounded-xl bg-slate-200" />

            <div className="mt-6 h-14 rounded-xl bg-slate-200" />

          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-2 lg:p-4">
      <div
        className="
        relative
        w-full
        max-w-7xl
        h-[95vh]
        rounded-[40px]
        overflow-hidden
        border
        border-slate-200
        shadow-2xl
        bg-white
      "
      >
        {/* Background Dashboard */}
        <img
          src={heroDashboard}
          alt="RoomLY Dashboard"
          className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
        />

        {/* Overlay */}
        <div
          className="
          absolute
          inset-0
          bg-linear-to-r
          from-slate-950/50
          via-slate-950/20
          to-transparent
        "
        />

        {/* Glow */}
        <div
          className="
          absolute
          top-1/2
          right-40
          -translate-y-1/2
          h-72
          w-72
          rounded-full
          bg-cyan-400/20
          blur-[120px]
        "
        />

        

        {/* Left Content */}
        <div className="hidden lg:flex absolute left-16 top-1/2 -translate-y-1/2 max-w-lg flex-col">
          <img
            src={logo}
            alt="RoomLY"
            className="h-14 w-fit mb-8"
          />

          <h1 className="text-6xl font-bold text-white leading-tight">
            Smarter Meetings.
            <br />
            Powered By AI.
          </h1>

          <p className="mt-6 text-slate-200 text-lg leading-relaxed">
            Schedule meetings, generate summaries,
            capture action items, and let AI handle
            the busy work while your team focuses on
            what truly matters.
          </p>
        </div>

        {/* Auth Card */}
<div
  className="
  absolute
  right-4
  left-4
  lg:left-auto
  lg:right-12
  top-1/2
  -translate-y-1/2

  w-auto
  lg:w-[460px]

  rounded-[32px]
  bg-white/85
  backdrop-blur-2xl

  border
  border-white/50

  shadow-2xl

  p-8
  lg:p-10
"
>
  <h2 className="text-3xl font-bold text-slate-900 text-center">
    {isLogin ? "Welcome Back" : "Create Account"}
  </h2>

  <p className="mt-2 text-center text-slate-500">
    {isLogin
      ? "Login to continue using RoomLY"
      : "Start smarter meetings today"}
  </p>

  {/* Login / Signup Toggle */}
  <div className="mt-8">
    <div className="flex bg-slate-100 p-1 rounded-xl">
      <button
        onClick={() => {
          setIsLogin(true);
          setError("");
        }}
        className={`
          flex-1
          py-3
          rounded-lg
          text-sm
          font-semibold
          transition-all
          ${
            isLogin
              ? "bg-white shadow text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }
        `}
      >
        Login
      </button>

      <button
        onClick={() => {
          setIsLogin(false);
          setError("");
        }}
        className={`
          flex-1
          py-3
          rounded-lg
          text-sm
          font-semibold
          transition-all
          ${
            !isLogin
              ? "bg-white shadow text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }
        `}
      >
        Sign Up
      </button>
    </div>
  </div>

  <div className="space-y-4 mt-6">
    {!isLogin && (
      <>
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </>
    )}

    <Input
      placeholder="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <Input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      disabled={loading}
      onClick={isLogin ? handleLogin : handleRegister}
      className="
        w-full
        py-4
        rounded-xl
        bg-cyan-500
        text-white
        font-semibold

        hover:bg-cyan-600
        hover:scale-[1.02]

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100

        transition-all
      "
    >
      {loading
        ? isLogin
          ? "Logging In..."
          : "Creating Account..."
        : isLogin
        ? "Login"
        : "Create Account"}
    </button>
  </div>

  {error && (
    <p className="text-red-500 text-sm mt-4 text-center">
      {error}
    </p>
  )}

  <div className="mt-6 text-center">
    <button
      onClick={() => {
        setIsLogin(!isLogin);
        setError("");
      }}
      className="
        text-sm
        font-medium
        text-cyan-600
        hover:text-cyan-700
        transition-colors
      "
    >
      {isLogin
        ? "Don't have an account? Sign Up"
        : "Already have an account? Login"}
    </button>
  </div>

  <div className="mt-8 flex justify-center">
    <button
      onClick={() => navigate("/")}
      className="
        text-sm
        text-slate-500
        flex
        items-center
        gap-2
        hover:text-slate-700
        transition-colors
      "
    >
      Back To Home
      <ArrowRight size={14} />
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
      w-full
      rounded-xl
      border
      border-slate-200
      bg-white/70
      px-4
      py-4
      outline-none
      focus:border-cyan-500
      focus:ring-4
      focus:ring-cyan-100
      transition-all
    "
    />
  );
}