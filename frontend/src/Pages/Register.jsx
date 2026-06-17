import { useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axiosInstance.post(
        "/users/register",formData);
      

      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message 
      );
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-yellow-50 to-green-50">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/30"
      >
        <h2 className="text-2xl font-extrabold mb-2 text-center text-emerald-700 tracking-wide">Create Account</h2>
        <p className="text-sm text-center text-emerald-600 mb-4">Join our community and share your favorite recipes!</p>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
          className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 rounded-lg hover:scale-[1.02] transform transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
