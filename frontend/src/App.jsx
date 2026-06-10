import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import RecipeDetails from "./Pages/Recipedetails";
import Favourites from "./Pages/Favourites";
import Login from "./Pages/Login";
import UserRecipe from "./Pages/UserRecipe";
import ProtectedRoute from "./Components/ProtectedRoute";
import Footer from "./Components/Footer";
import Register from "./Pages/Register"; 

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />

        <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>}/>
        <Route
          path="/myrecipes"
          element={
            <ProtectedRoute>
              <UserRecipe />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
