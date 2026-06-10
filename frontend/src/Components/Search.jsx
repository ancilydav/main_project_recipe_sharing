import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { setSearch } from "../Features/recipeSlice";
import { FaMicrophone } from "react-icons/fa";

const Search = ({ handleVoiceSearch }) => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.recipes.search)
  
  return (
    <div className="relative w-full">
    <input
      type="text"
      value={search}
      placeholder="Search recipe"
      className="border rounded p-2 w-320"
      onChange={(e) => dispatch(setSearch(e.target.value))}
    />
    <button
        onClick={handleVoiceSearch}
        className="absolute text-xl right-20 text-white bg-orange-500 hover:bg-orange-600 px-3 py-3"
      >
        <FaMicrophone/> 
      </button>
    </div>
  );
};

export default Search;
