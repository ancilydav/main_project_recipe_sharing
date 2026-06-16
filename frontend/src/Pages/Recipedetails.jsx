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

  

  
  const ingredientsList = (() => {
    if (!recipe) return [];
    const raw = recipe.ingredients || [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") {
      return raw
        .split(/\r?\n|;|\||,/) 
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  })();

  const stepsList = (() => {
    if (!recipe) return [];
    const raw = recipe.steps || recipe.preparation || [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") {
      return raw
        .split(/\r?\n|;|\||,/) 
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  })();

  const speakSteps = () => {
    const ingredients = ingredientsList || [];
    const steps = stepsList || [];
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 items-start bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-96 object-cover transform transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                {recipe.name}
              </h1>
                <div className="mt-2 flex gap-2">
                  <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">⏱ {recipe.time}</span>
                  <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">🔥 {recipe.difficulty}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {ingredientsList.map((item, index) => (
                <li key={index} className="ingredient-chip bg-amber-50/50 text-amber-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Preparation Steps</h2>
            <ol className="mt-3 list-decimal list-inside space-y-3 text-gray-800">
              {stepsList.map((preparation, index) => (
                <li key={index} className="leading-relaxed">{preparation}</li>
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={speakSteps}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transform transition">
              {isSpeaking ? "⏹ Stop Hands-free" : "🔈 Hands-free Cooking"}
            </button>

            <div className="ml-auto">
              <Timer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipedetails;
