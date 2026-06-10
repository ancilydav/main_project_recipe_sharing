import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavourites } from "../Features/recipeSlice";
import RecipeCard from "../Components/RecipeCard";

const Favourites = () => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.recipes.favourites);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavourites());
    }
  }, [dispatch, user]);

  const displayedFavourites = favourites;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Favourite Recipes</h1>
      <div className="grid grid-cols-3 gap-6">
        {displayedFavourites.length === 0 ? (
          <p className="text-gray-500 text-lg text-center mt-10">
            No Favourites Added
          </p>
        ) : (
          displayedFavourites.map((recipe) => (
            <RecipeCard key={recipe._id || recipe.id} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
};

export default Favourites;
