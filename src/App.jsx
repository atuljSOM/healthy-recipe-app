import React, { useState, useEffect } from "react";

export default function HealthyRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [proteinChoice, setProteinChoice] = useState("all");

  useEffect(() => {
    document.title = "Healthy recipe of the day";
  }, []);

  const fetchRecipe = async (protein) => {
    try {
      const response = await fetch(`/api/recipe?protein=${protein}&forceRefresh=true`);
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
        <aside className="hidden lg:block w-[100px] text-gray-400 text-sm text-center">Ad</aside>

        {/* Main Content Box */}
        <div className="flex-1 max-w-5xl bg-green-50 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8 mx-2">
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
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="rounded-xl shadow mx-auto max-w-full h-auto max-h-96"
                  />
                )}

                <div className="space-y-6 mx-auto max-w-prose text-center p-4 sm:p-6 rounded-xl bg-green-200 shadow">
                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold">Ingredients:</h3>
                    <ul className="list-disc list-inside space-y-1 text-left inline-block text-gray-700">
                      {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold">Steps:</h3>
                    <div className="text-left inline-block text-gray-700 whitespace-pre-line break-words max-w-full">
                      <ol className="list-decimal list-inside space-y-1">
                        {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                      </ol>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p><strong>Calories:</strong> {recipe.calories ?? "N/A"} kcal</p>

                    <div className="mt-4">
                      <h3 className="font-semibold">Nutritional Info:</h3>
                      {recipe.nutrients?.length > 0 ? (
                        <ul className="list-disc list-inside text-left inline-block text-gray-700">
                          {recipe.nutrients.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-gray-500">Nutrient details are not available for this recipe.</p>
                      )}
                    </div>
                  </div>

                  {recipe.affiliateLink && (
                    <a
                      href={recipe.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 underline block mt-4"
                    >
                      View Full Recipe Source
                    </a>
                  )}
                </div>
              </div>
            )
          ) : (
            <p className="text-center text-gray-500">Loading recipe...</p>
          )}

          <footer className="text-center text-sm text-gray-400 pt-6">
            © {new Date().getFullYear()} DailyHealthyRecipe. All rights reserved.
          </footer>
        </div>

        {/* Right Ad Space */}
        <aside className="hidden lg:block w-[100px] text-gray-400 text-sm text-center">Ad</aside>
      </div>
    </main>
  );
}
