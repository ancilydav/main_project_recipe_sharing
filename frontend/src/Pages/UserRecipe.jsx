import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteRecipe, createRecipe, deleteRecipeThunk, fetchRecipes, updateRecipeThunk } from "../Features/recipeSlice";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

const UserRecipe = () => {
  const [title, setTitle] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisine,setCuisine]= useState("");
  const [difficulty,setDifficulty]=useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const recipes = useSelector((state) => state.recipes.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const myRecipes = recipes.filter(
    (recipe) =>
      recipe.author === user?.name ||
      recipe.authorId === user?._id ||
      recipe.authorId === user?.id
  );
  const handleAdd = async () => {
    if (!user) {
      toast.error("Please login to add a recipe");
      return;
    }
    if (!title) return;

    const newRecipe = {
      name: title,
      diet,
      image,
      time,
      difficulty,
      cuisine,
      ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
      author: user?.name,
    };

    try {
      if (editingId) {
        await dispatch(updateRecipeThunk({ id: editingId, recipeData: newRecipe })).unwrap();
        toast.success("Recipe Updated");
      } else {
        await dispatch(createRecipe(newRecipe)).unwrap();
        toast.success("Recipe Added");
      }
      // refresh recipes so the new item appears immediately
      dispatch(fetchRecipes());
      setTitle("");
      setDiet("");
      setCuisine("");
      setImage("");
      setTime("");
      setDifficulty("");
      setIngredients("");
      setSteps("");
      setEditingId(null);
    } catch (err) {
      toast.error(err || "Failed to add recipe");
    }
  };

  const handleEdit = (recipe) => {
    setTitle(recipe.name || recipe.title || "");
    setDiet(recipe.diet || "");
    setCuisine(recipe.cuisine || "");
    setDifficulty(recipe.difficulty || "");
    setImage(recipe.image || "");
    setTime(recipe.time || "");
    setIngredients((recipe.ingredients && recipe.ingredients.join("\n")) || "");
    setSteps((recipe.steps && recipe.steps.join("\n")) || "");
    setEditingId(recipe._id || recipe.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setTitle("");
    setDiet("");
    setCuisine("");
    setDifficulty("");
    setImage("");
    setTime("");
    setIngredients("");
    setSteps("");
    setEditingId(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data?.imageUrl;
      if (imageUrl) {
        setImage(imageUrl);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed: no URL returned");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (recipe) => {
    if (recipe._id) {
      try {
        await dispatch(deleteRecipeThunk(recipe._id)).unwrap();
        toast.success("Recipe deleted");
      } catch (err) {
        toast.error(err || "Failed to delete");
      }
    } else {
      dispatch(deleteRecipe(recipe.id));
      toast.success("Recipe deleted");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-lg font-bold mb-4">Add Recipe</h2>
      <div className="space-y-4 mb-8">
        {/* title */}
        <input
          type="text"
          placeholder="Recipe Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* Diet */}
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Diet</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
        {/* cuisine */}
        <input
          type="text"
           placeholder="Cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="border  w-full
           rounded  h-10 resize-none"
        />

        {/* image */}

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Choose File
            </button>
            <span className="text-sm text-gray-700 truncate max-w-xs">{fileName || "No file chosen"}</span>
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>

          {image && (
            <div className="mt-2 mb-2">
              <img src={image} alt="preview" className="w-40 h-40 object-cover rounded" />
            </div>
          )}

          <input
            type="text"
            placeholder="Or paste Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border p-2 flex-1 rounded w-full mt-3"
          />
        </div>
        {/* time */}
        <input
          type="text"
           placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border  w-full
           rounded  h-10 resize-none"
        />
        <input
          type="text"
           placeholder="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border  w-full
           rounded  h-10 resize-none"
        />
        {/* Ingredients */}

        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border p-2 w-full rounded  h-24 resize-none"
        />

        {/* Steps */}

        <textarea
          placeholder="Preparation Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="border p-2 w-full h-28 rounded resize-none"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button onClick={cancelEdit} className="bg-gray-300 px-3 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4"> My Recipe</h2>
      {myRecipes.length ? (
        myRecipes.map((recipe) => (
          <div
            key={recipe._id || recipe.id}
            className="flex justify-between items-center border p-3 mb-2 rounded"
          >
            <p>{recipe.name || recipe.title}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(recipe)} className="bg-blue-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button
                onClick={() => handleDelete(recipe)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No recipes yet.</p>
      )}
    </div>
  );
};

export default UserRecipe;
