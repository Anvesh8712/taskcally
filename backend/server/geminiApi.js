const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateTasks = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    prompt =
      "the Task is: " +
      prompt +
      ` give me a to-do list of steps for the given task. reply using this JSON schema and nothing else:
    {
  "1": "Task 1",
  "2": "Task 2",
  "3": "Task 3"
}. dont let the tasks be more than 6 words. they should be self explanatory.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling GeminiAPI", error);
    throw error;
  }
};
module.exports = { generateTasks };
