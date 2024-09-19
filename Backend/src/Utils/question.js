import axios from 'axios'

// Replace with your actual API key and external user ID
const apiKey = 'vFKHtSB2Ckc0GJaKKUUtrRqjakhsPQ53';
const externalUserId = 'user';
 
// Function to create a chat session
async function createChatSession() {
  try {
    const response = await axios.post(
      'https://api.on-demand.io/chat/v1/sessions',
      {
        pluginIds: [],
        externalUserId: externalUserId
      },
      {
        headers: {
          apikey: apiKey
        }
      }
    );

    // Extract session ID from the response
    const sessionId = response.data.data.id;
    return sessionId;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;[]
  }
}

// Function to submit a query
async function submitQuery(sessionId,extraQuery) {
  try {
    const response = await axios.post(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
      {
        endpointId: 'predefined-openai-gpt4o',
        query: `give ten mcq on these topics in json fromat as i have to show it in frontend ${extraQuery}`,
        pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
        responseMode: 'sync'
      },
      {
        headers: {
          apikey: apiKey
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    console.log(error.response ? error.response.data : error);

    throw error;
  }
}

// Main function to execute the API calls
const question = async (extraQuery)=> {
  try {
    const sessionId = await createChatSession();
    const queryResponse = await submitQuery(sessionId,extraQuery);
    console.log('Query Response:', queryResponse);
    return queryResponse
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Execute the main function
export {question}
