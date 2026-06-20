const axios = require('axios');

/**
 * Communicates with the FastAPI model server.
 * @param {string} title The news article title
 * @param {string} text The news article text
 * @returns {Promise<{prediction: string, confidenceScore: number}>}
 */
const getMLPrediction = async (title, text) => {
  try {
    const mlUrl = process.env.ML_SERVICE_URL || 'https://fake-news-and-misinformation-detect-swart.vercel.app/predict';
    
    console.log(`Sending predict request to ML service: ${mlUrl}`);
    const response = await axios.post(mlUrl, {
      title: title || "",
      text: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10s timeout
    });

    if (response.status === 200 && response.data) {
      return {
        prediction: response.data.prediction,
        confidenceScore: response.data.confidence_score
      };
    } else {
      throw new Error(`ML Service returned status ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in ML Service client: ${error.message}`);
    // Check if FastAPI service is offline
    if (error.code === 'ECONNREFUSED') {
      throw new Error('FastAPI ML service is currently offline. Please start the ML service first.');
    }
    throw new Error(error.response?.data?.detail || error.message || 'Error running model prediction');
  }
};

module.exports = { getMLPrediction };
