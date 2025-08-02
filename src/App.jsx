import React, { useState, useEffect } from "react";

export default function HealthyRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [proteinChoice, setProteinChoice] = useState("all");

  useEffect(() => {
    document.title = "Healthy recipe of the day";
  }, []);

  const fetchRecipe = async (protein) => {
    try {
      const response = await fetch(`/api/recipe?protein=${protein}`);
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error("Failed to fetch recipe", error);
    }
  };

  useEffect(() => {
    fetchRecipe(proteinChoice);
  }, [proteinChoice]);

  return (
    <main className="min-h-screen bg-lime-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between">
        {/* Left Ad Space */}
        <aside className="hidden lg:block w-[60px] text-gray-400 text-sm text-center">Ad</aside>

        {/* Main Content Box */}
        <div className="flex-1 max-w-6xl bg-green-50 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8 mx-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-green-700">🥗 Healthy recipe of the day</h1>

          {/* Protein Filter */}
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">What protein are you feeling today?</h2>
            <select
              value={proteinChoice}
              onChange={(e) => setProteinChoice(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-[180px] text-center mx-auto block focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Proteins</option>
              <option value="chicken">Chicken</option>
              <option value="egg">Egg</option>
              <option value="chickpea">Chickpea</option>
              <option value="tofu">Tofu</option>
              <option value="paneer">Paneer</option>
              <option value="beef">Beef</option>
              <option value="pork">Pork</option>
              <option value="fish">Fish</option>
              <option value="shrimp">Shrimp</option>
            </select>
          </div>

          {/* Recipe Display */}
          {recipe ? (
            recipe.title === "Recipe Error" ? (
              <div className="text-center text-red-500 text-lg font-medium">
                No matching recipe found. Try a different protein or try again later.
              </div>
            ) : (
              <div className="space-y-8 text-gray-800 text-center">
                <h2 className="text-xl sm:text-2xl font-bold">{recipe.title}</h2>

                {recipe.image && (
