import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Features/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  return (
    <div className="flex bg-orange-400 justify-between p-3 text-white">
      <h1 className="italic text-blue-700 font-bold text-2xl">
        Tasty<span className="text-blue-900">Nest</span>
      </h1>

      {/* authentication Protected Route */}

      <div className="space-x-4 text-l font-semibold">
        <Link to="/">Home</Link>
        {user && <Link to="/favourites">Favourites</Link>}
        {user && <Link to="/myrecipes">Add Recipe</Link>}

        {user ? (
          <button
            onClick={() => dispatch(logout())}
            className="bg-white text-red-700 font-semibold px-3 py-1 rounded-full"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-green-700 font-semibold px-3 py-1 rounded-full"
          >
            Login
          </Link>
        )}
        {user && (
          <span className="text-blue-800 italic">Hello, {user.name}</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
