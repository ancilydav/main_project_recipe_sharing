import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import Timer from "../Components/Timer";

const Recipedetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load recipe details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return <h2>Loading recipe details...</h2>;
  }

  if (error) {
    return <h2 className="text-red-600">{error}</h2>;
  }

  if (!recipe) {
    return <h2>Recipe not found</h2>;
  }

  // Hands-free cooking

  const speakSteps = () => {
    const ingredients = recipe.ingredients || [];
    const steps = recipe.steps || recipe.preparation || [];
    const allSteps = [
      "Ingredients are",
      ...ingredients,
      "Preparation steps are",
      ...steps,
    ];

    if (isSpeaking) {
      speakingRef.current = false;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let i = 0;
    speakingRef.current = true;
    setIsSpeaking(true);

    const speakNext = () => {
      if (!speakingRef.current) return;
      if (i < allSteps.length) {
        const speech = new SpeechSynthesisUtterance(allSteps[i]);
        speech.rate = 0.9;
        speech.onend = () => {
          i++;
          if (!speakingRef.current || i >= allSteps.length) {
            speakingRef.current = false;
            setIsSpeaking(false);
            return;
          }
          speakNext();
        };
        window.speechSynthesis.speak(speech);
      } else {
        speakingRef.current = false;
        setIsSpeaking(false);
      }
    };

    speakNext();
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      <img src={recipe.image} className="w-100 h-80 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-4">Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h2 className="text-xl mt-4 font-bold">Preparation Steps</h2>
      <ul>
        {(recipe.steps || recipe.preparation || []).map((preparation, index) => (
          <li key={index}>{preparation}</li>
        ))}
      </ul>
      <p className="text-l font-semibold mt-4">Time:{recipe.time}</p>
      <p className="text-l font-semibold">Difficulty:{recipe.difficulty}</p>

      <button
       onClick={speakSteps}
       className="bg-purple-500 text-white px-4 py-2 rounded mt-4 hover:bg-purple-700">
       {isSpeaking ? "⏹ Stop Hands-free" : "🔈 Hands-free Cooking"}
      </button>

      <Timer />
    </div>
  );
};

export default Recipedetails;
