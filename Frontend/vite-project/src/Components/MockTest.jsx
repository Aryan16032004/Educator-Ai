import React, { useState } from 'react';
import axios from 'axios';

function MockTest() {
  const [syllabus, setSyllabus] = useState('');
  const [responseData, setResponseData] = useState(null);

  // Handle the textarea change
  const handleInputChange = (e) => {
    setSyllabus(e.target.value);
  };

  // Function to call the API and handle the response
  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/v1/users/separator', {
        query: syllabus,
      });

      if (response.data.isSuccessful) {
        setResponseData(response.data.data.response);
      } else {
        alert('Failed to process the syllabus.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    }
  };

  // Render formatted data
  const renderFormattedResponse = () => {
    if (!responseData) return null;

    return (
      <div className='mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-2xl' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {Object.keys(responseData).map((unit, index) => (
          <div key={index} className='mb-6'>
            <h2 className='text-xl font-bold mb-2'>{unit}</h2>
            <h3 className='text-lg font-semibold mb-1'>Topics:</h3>
            <ul className='list-decimal list-inside'>
              {responseData[unit][0].split('<').map((topic, idx) => (
                <li key={idx} className='text-gray-800'>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='h-screen flex flex-col justify-center items-center bg-slate-400 bg-opacity-50'>
      {/* Textarea Input */}
      <textarea
        className='w-96 p-4 mb-4 text-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        name='syllabus'
        id='syllabus'
        cols='30'
        rows='5'
        placeholder='Enter your syllabus'
        value={syllabus}
        onChange={handleInputChange}
      />
      
      {/* Submit Button */}
      <button
        type='button'
        onClick={handleSubmit}
        className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
        Submit
      </button>
      
      {/* Render the formatted response data */}
      {renderFormattedResponse()}
    </div>
  );
}

export default MockTest;
