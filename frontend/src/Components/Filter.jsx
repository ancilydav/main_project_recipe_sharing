import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCuisine, setDiet, setDifficulty } from "../Features/recipeSlice";

const Filter = () => {
  const dispatch = useDispatch();
  const { cuisine, diet, difficulty } = useSelector((state) => state.recipes);

  return (
    <div className="flex gap-6 items-end mb-6">

      {/* Cuisine */}
      <div className="flex flex-col">
        <label className="text-l font-semibold mb-1">Cuisine</label>
        <select
          value={cuisine}
          onChange={(e) => dispatch(setCuisine(e.target.value))}
          className="rounded-full bg-yellow-400 py-2 px-4 w-full"
        >
          <option value="All">All</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="Kerala">Kerala</option>
        </select>
      </div>

      {/* Diet */}
      <div className="flex flex-col">
        <label className="text-l font-semibold mb-1">Diet</label>
        <select
          value={diet}
          onChange={(e) => dispatch(setDiet(e.target.value))}
          className="rounded-full bg-yellow-400 py-2 px-4 w-full"
        >
          <option value="All">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col">
        <label className="text-l font-semibold mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => dispatch(setDifficulty(e.target.value))}
          className="rounded-full bg-yellow-400 py-2 px-4 w-full "
        >
          <option value="All">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
