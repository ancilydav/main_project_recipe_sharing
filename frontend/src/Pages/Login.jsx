import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Features/authSlice";
import { fetchFavourites } from "../Features/recipeSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/users/login", formdata);
      // store token alongside user fields so other thunks can access `user.token`
      const payload = { ...(response.data.user || {}), token: response.data.token };
      dispatch(login(payload));
      await dispatch(fetchFavourites());
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30"
      >
        <h2 className="text-xl font-extrabold mb-3 text-center text-orange-600">Welcome Back</h2>
        <p className="text-sm text-center text-orange-500 mb-4">Sign in to access your recipes and favourites</p>

        {/* email*/}
        <input
          type="email"
          placeholder="Enter Email"
          required
          className="border p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
          onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
        />

        {/* Password */}

        <input
          type="password"
          placeholder="Enter Password"
          required
          className="border p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
          onChange={(e) =>
            setFormdata({ ...formdata, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-lg hover:scale-[1.02] transform transition"
        >
          Login
        </button>
        <p className="mt-3 text-center">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 cursor-pointer ml-1 font-semibold"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
