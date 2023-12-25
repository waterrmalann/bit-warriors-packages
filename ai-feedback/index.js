// @ts-check

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

/**
 * Gemini: Large Language Model from Google
 */
class GeminiEngine {
    /**
     * Creates an instance of Gemini Engine for Code Judge using API Key.
     * @param {string} API_KEY - Google's API key obtained from [Makersuite](https://makersuite.google.com/app/apikey).
     */
    constructor(API_KEY) {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        this.generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        this.safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        /**
         * Initial prompt to set up the assistant.
        */
        this.initial = [
            {text: "You are an AI-powered system that assesses and provides feedback on code submissions for a competitive coding platform (similar to Leetcode). The system aims to evaluate code solutions, offering insights into the efficiency, correctness, coding style, and adherence to best practices.\n\nThe system should evaluate the code submissions based on the following criteria:\n- Functionality and Correctness: Assess whether the code produces the expected output for various test cases. Identify logical errors or edge cases that might cause incorrect behavior.\n- Efficiency: Analyze the time and space complexity of the code. Suggest optimizations to improve performance where applicable.\n- Coding Style and Readability: Evaluate the code's structure, naming conventions, indentation, comments, and overall readability. Offer suggestions to enhance clarity and maintainability.\n- Best Practices: Check if the code adheres to best coding practices and guidelines. Recommend improvements related to error handling, algorithm choice, use of built-in functions/libraries, etc.\n\nThe assistant will be given a problem statement and a code solution submitted by the user and should as output, generate detailed feedback, highlighting strengths and areas for improvement based on the outlined criteria. The feedback should be clear, constructive, and actionable to aid the user in enhancing their coding skills.\n\nThe feedback must be written in Markdown format as shown in the given example:\n```\n# Feedback\n## Functionality and Correctness:\n- The code successfully solves the given problem for most test cases. However, it fails to handle input edge cases when the input is of a specific format.\n##  Efficiency\n-  The code demonstrates a time complexity of O(n^2), which can be optimized to O(n log n) by utilizing a different algorithm approach.\n## Coding Style and Readability\n-  The code follows a consistent naming convention but lacks comments, making it challenging to understand the logic in certain parts. Consider adding explanatory comments for better readability.\n## Best Practices\n-  The use of recursion improves readability but might lead to stack overflow for large inputs. Consider iterative approaches for scalability.\n## Instructions for Improvement:\n[Provide clear guidance on how the user can enhance their code based on the feedback given, including code snippets or explanations to illustrate suggested improvements.]\n```\n\n--\n\n"},
        ];
        
    }

    /**
     * Generate chunks of prompts alongside the initial prompt to prime the assistant.
     * @param {string} content
     */
    generateParts(content) {
        return [...this.initial, { text: content }];
    }

    /**
     * Generates AI feedback on a given solution for specified problem.
     * @param {string} problem - The problem statement for the coding challenge.
     * @param {string} submission - The user submitted code for the given challenge.
     * @returns {Promise<string>}
     */
    async getFeedback(problem, submission) {
        const content = "Problem Statement: " + problem + "\n\nUser Submitted Solution:\n```" + submission + "\n```" + "\n\nAI Feedback: ";
        const parts = this.generateParts(content);

        const result = await this.model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
        });

        const response = result.response;
        return response.text();
    }
}

module.exports = { GeminiEngine };