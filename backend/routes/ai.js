const express = require("express");
const router = express.Router();

const {
    getAIRecommendation,
    getAITextRecommendation
} = require("../controllers/aiController");

router.post("/recommend", getAIRecommendation);
router.post('/recommend-text', (req, res) => {
    const text = req.body.text.toLowerCase();

    let season = "summer";
    let gender = "man";
    let occasion = "casual";

    if (text.includes("winter")) season = "winter";
    if (text.includes("female") || text.includes("woman")) gender = "woman";
    if (text.includes("date")) occasion = "romantic";
    if (text.includes("sport")) occasion = "sporty";
    if (text.includes("formal")) occasion = "formal";

    const recommendations = {
        winter: {
            man: "a wool coat, dark jeans, leather boots, and a warm scarf",
            woman: "a long coat, knitted sweater, leggings, and ankle boots"
        },
        summer: {
            man: "a light t-shirt, chino shorts, and white sneakers",
            woman: "a floral dress with sandals and sunglasses"
        }
    };

    const outfit = recommendations[season][gender];

    res.json({
        recommendation: `For a ${occasion} ${season} look for a ${gender}, we recommend ${outfit}.`
    });
});

module.exports = router;
