exports.getAIRecommendation = (req, res) => {
    const { gender, occasion, season } = req.body;

    const recommendations = {
        winter: {
            male: "a wool coat, dark jeans, leather boots, and a warm scarf",
            female: "a long coat, knitted sweater, leggings, and ankle boots"
        },
        summer: {
            male: "a light t-shirt, chino shorts, and white sneakers",
            female: "a floral dress with sandals and sunglasses"
        }
    };

    const outfit =
        recommendations[season?.toLowerCase()]?.[gender?.toLowerCase()] ||
        "stylish casual pieces that match your vibe";

    res.json({
        recommendation: `For a ${occasion} ${season} look, we recommend ${outfit}.`
    });
};

exports.getAITextRecommendation = (req, res) => {
    const text = req.body.text.toLowerCase();

    let gender = text.includes("woman") ? "woman" : "man";
    let occasion = "casual";
    let season = "summer";

    if (text.includes("formal") || text.includes("work")) occasion = "formal";
    if (text.includes("party")) occasion = "party";
    if (text.includes("winter")) season = "winter";

    let recommendation = `Based on your description, we suggest a ${occasion} ${season} outfit for a ${gender}. `;

    recommendation +=
        "Try combining stylish pieces that match the mood you described with confidence and comfort.";

    res.json({ recommendation });
};
