// src/controller/ai.controller.js

const aiService = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
    try {
        
        const code  = req.body.code;

        if (!code) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // CORRECTED: The function name now matches the one in your service file.
        const textResponse = await aiService.generateContent(code);

        res.status(200).send(textResponse);

    } catch (error) {
        // This will catch errors if the Gemini API call fails
        console.error("Error in getResponse controller:", error);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
};