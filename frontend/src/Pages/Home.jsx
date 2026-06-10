import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Search from "../Components/Search";
import Filter from "../Components/Filter";
import RecipeCard from "../Components/RecipeCard";
import { setSearch, fetchRecipes } from "../Features/recipeSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { search, diet, cuisine, difficulty, recipes, loading } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

const filteredRecipes = recipes.filter((recipe) => {
    const recipeName = (recipe.name || recipe.title || "").toLowerCase();
    const recipeDiet = (recipe.diet || "").toLowerCase();
    const recipeCuisine = (recipe.cuisine || "").toLowerCase();
    const recipeDifficulty = (recipe.difficulty || "").toLowerCase();
    const normalizedSearch = search.toLowerCase();

    return (
      recipeName.includes(normalizedSearch) &&
      (diet === "All" || recipeDiet === diet.toLowerCase()) &&
      (cuisine === "All" || recipeCuisine === cuisine.toLowerCase()) &&
      (difficulty === "All" || recipeDifficulty === difficulty.toLowerCase())
    );
  });
  if(loading){
    return(
      <h2 className="text-center text-xl mt-10">Loading Recipes...</h2>
    );
  }

  // Webspeech
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.start();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      dispatch(setSearch(text));
    };
  };

  

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-3"> Recipes</h2>
      <Search handleVoiceSearch={handleVoiceSearch} />
      
      <div className="flex flex-wrap gap-3 mt-4">
        <Filter />
      </div>

      <div className="grid grid-cols-3 gap-4">
        
        {loading?(<p>Loading...</p>):(
          
        filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />)
        ))}
        
      </div>
    </div>
  );
};

export default Home;
