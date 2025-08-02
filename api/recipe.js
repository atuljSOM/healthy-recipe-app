import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { protein = "all", forceRefresh = "false" } = req.query;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const today = new Date().toISOString().split("T")[0];
  const cacheKey = "recipe:" + protein + ":" + today;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  if (forceRefresh !== "true") {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
    } catch (err) {
      console.warn("Redis lookup failed:", err);
    }
  }

  try {
    const searchParams = new URLSearchParams({
      number: 1,
      sort: "random",
      addRecipeInformation: "true",
      fillIngredients: "true",
      instructionsRequired: "true",
      addRecipeInformation: "true",
      addRecipeNutrition: "true",   // ✅ Required for nutrient filters to work!
      minProtein: "10",
      maxCalories: "500",
      apiKey,
    });

    if (protein !== "all") {
      searchParams.append("query", protein);
    }

    const searchUrl = "https://api.spoonacular.com/recipes/complexSearch?" + searchParams.toString();
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const recipe = searchData?.results?.[0];
    if (!recipe || !recipe.id) {
      throw new Error("No recipe found.");
    }

    const infoUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=${apiKey}`;
    const infoRes = await fetch(infoUrl);
    const fullData = await infoRes.json();

    const nutrients = fullData?.nutrition?.nutrients?.map(n =>
      n.name + ": " + n.amount + " " + n.unit
    ) || [];

    const responseData = {
      title: fullData.title,
      image: fullData.image,
      ingredients: fullData.extendedIngredients?.map(i => i.original) || [],
      steps: fullData.analyzedInstructions?.[0]?.steps?.map(s => s.step) || [],
      calories: Math.round(
        fullData.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 0
      ),
      nutrients,
      affiliateLink: fullData.sourceUrl || null,
    };

    await redis.set(cacheKey, responseData, { ex: 86400 });

    res.status(200).json(responseData);
  } catch (err) {
    console.error("❌ Recipe fetch error:", err);
    res.status(500).json({
      title: "Recipe Error",
      ingredients: ["Could not fetch recipe."],
      steps: ["Try again later."],
      calories: 0,
      nutrients: [],
    });
  }
}
