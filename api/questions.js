import api from "./client";
import endpoints from "./endpoints";

/**
 * Fetches the user's questionnaire responses from the server
 * @returns {Promise<Array>} Array of user's responses
 */
export const getUserAnswers = async () => {
  try {
    const res = await api.get(endpoints.answers);
    console.log("Fetched user's responses:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch responses:", message);
    throw new Error(message);
  }
};

/**
 * Submits a user's answer to a specific question
 * @param {Number} questionId - The ID of the question being answered
 * @param {any} answer - The user's answer value
 * @returns {Promise<Object>} The response from the server or null if answer is null
 */
export const submitAnswer = async (questionId, answer) => {
  // If answer is null, don't send to server (user deselected their answer)
  if (answer === null) {
    console.log("Answer is null, not sending to server");
    return null;
  }
  
  try {
    // Format the payload according to the API schema
    const payload = {
      responses: [
        {
          question: questionId,
          // For radio-type questions, use numeric_response
          // For text-type questions, would use text_response
          numeric_response: answer
        }
      ]
    };
    
    const res = await api.post(endpoints.answers, payload);
    console.log("Submitted answer for question", questionId, res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to submit answer:", message);
    throw new Error(message);
  }
};

/**
 * Submits multiple answers at once
 * @param {Array} answers - Array of {questionId, answer} objects
 * @returns {Promise<Object>} The response from the server
 */
export const submitMultipleAnswers = async (answers) => {
  try {
    // Filter out null answers
    const validAnswers = answers.filter(a => a.answer !== null);
    
    if (validAnswers.length === 0) {
      console.log("No valid answers to submit");
      return null;
    }
    
    // Format the payload according to the API schema
    // For question ID 1, use text_response
    // For all other questions, use numeric_response
    const payload = {
      responses: validAnswers.map(item => {
        // Check if it's question ID 1
        if (item.questionId === 1 || item.questionId === 2) {
          console.log(`Question ID 1 sending text_response: ${item.answer}`);
          return {
            question: item.questionId,
            text_response: String(item.answer) // Ensure it's a string
          };
        } else {
          // For all other questions, use numeric_response
          console.log(`Question ID ${item.questionId} sending numeric_response: ${item.answer}`);
          return {
            question: item.questionId,
            numeric_response: Number(item.answer) // Ensure it's a number
          };
        }
      })
    };
    
    console.log('Submitting answers payload:', JSON.stringify(payload, null, 2));
    const res = await api.post(endpoints.answers, payload);
    console.log("Submitted multiple answers:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to submit multiple answers:", message);
    throw new Error(message);
  }
};
