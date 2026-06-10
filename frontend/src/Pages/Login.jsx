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
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {/* email*/}
        <input
          type="email"
          placeholder="Enter Email"
          required
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
        />

        {/* Password */}

        <input
          type="password"
          placeholder="Enter Password"
          required
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) =>
            setFormdata({ ...formdata, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-orange-500 text-white w-full p-2 rounded"
        >
          Login
        </button>
        <p className="mt-3 text-center">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer ml-1"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
