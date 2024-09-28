import React, { useState } from 'react';
import axios from 'axios';

function Syllabus() {
  const [syllabus, setSyllabus] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [questionsData, setQuestionsData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to track selected answers
  const [feedback, setFeedback] = useState({}); // State to track feedback messages

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

  // Function to fetch questions based on the topic
  const fetchQuestions = async (topics) => {
    try {
      const response = await axios.post('/api/v1/users/question', { topics });
      console.log(response);

      if (response.data.isSuccessful) {
        const rawData = response.data.data.response.data.answer;
        console.log("questions", rawData);

        const questions = rawData.split('#').filter(q => q.trim() !== '');
        const formattedQuestions = formatQuestions(questions);
        setQuestionsData(formattedQuestions);
      } else {
        alert('Failed to fetch questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('An error occurred while fetching questions.');
    }
  };

  // Function to format questions into an object
  const formatQuestions = (questions) => {
    const ans = {};
    questions.forEach((question, index) => {
      const parts = question.split('*');
      const questionText = parts[0].trim();
      const options = parts.slice(1, -1).map(opt => opt.trim());
      const correctAnswer = parts[parts.length - 1].trim();

      ans[`Question ${index + 1}`] = {
        Question: questionText,
        option1: options[0] || '',
        option2: options[1] || '',
        option3: options[2] || '',
        option4: options[3] || '',
        correct_answer: correctAnswer
      };
    });
    return ans;
  };

  // Handle answer selection
  const handleOptionChange = (questionKey, selectedOption) => {
    setSelectedAnswers(prev => ({ ...prev, [questionKey]: selectedOption }));
    
    const question = questionsData[questionKey];
    if (selectedOption === question.correct_answer) {
      setFeedback(prev => ({ ...prev, [questionKey]: 'Correct answer!!' }));
    } else {
      setFeedback(prev => ({ ...prev, [questionKey]: `Wrong answer!! Correct answer - ${question.correct_answer}` }));
    }
  };

  // Render formatted data
  const renderFormattedResponse = () => {
    if (!responseData) return null;

    return (
      <div className='mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-2xl' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {Object.entries(responseData).length > 0 ? (
          Object.entries(responseData).map(([unit, topics], unitIndex) => (
            <div key={unitIndex} className='mb-6'>
              <h2 className='text-xl font-bold mb-2'>{unit}</h2>
              <h3 className='text-lg font-semibold mb-1'>Topics:</h3>
              <ul className='list-decimal list-inside'>
                {topics.map((topic, idx) => (
                  <li 
                    key={idx} 
                    className='text-gray-800 cursor-pointer mb-1'
                    onClick={() => fetchQuestions(topic)} // Call fetchQuestions on click
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
  };

  // Render questions
  const renderQuestions = () => {
    if (!questionsData) return null;

    return (
      <div className='mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-2xl' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {Object.entries(questionsData).map(([key, value]) => (
          <fieldset key={key} className='question-box mb-4'>
            <h3 className='text-lg font-semibold'>{value.Question}</h3>
            <div>
              <input 
                type="radio" 
                name={key} 
                value={value.option1} 
                onChange={() => handleOptionChange(key, value.option1)} 
                checked={selectedAnswers[key] === value.option1} 
              /> {value.option1}
            </div>
            <div>
              <input 
                type="radio" 
                name={key} 
                value={value.option2} 
                onChange={() => handleOptionChange(key, value.option2)} 
                checked={selectedAnswers[key] === value.option2} 
              /> {value.option2}
            </div>
            <div>
              <input 
                type="radio" 
                name={key} 
                value={value.option3} 
                onChange={() => handleOptionChange(key, value.option3)} 
                checked={selectedAnswers[key] === value.option3} 
              /> {value.option3}
            </div>
            <div>
              <input 
                type="radio" 
                name={key} 
                value={value.option4} 
                onChange={() => handleOptionChange(key, value.option4)} 
                checked={selectedAnswers[key] === value.option4} 
              /> {value.option4}
            </div>
            {/* Show feedback message */}
            {feedback[key] && <div className='text-sm text-gray-600 mt-2'>{feedback[key]}</div>}
          </fieldset>
        ))}
      </div>
    );
  };

  return (
    <div className='h-screen flex flex-col justify-center items-center p-10 bg-slate-400 bg-opacity-50'>
      {/* Textarea Input */}
      <textarea
        className='h-3/6 w-3/6 p-4 mb-4 text-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        name='syllabus'
        id='syllabus'
        cols='30'
        rows='10'
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

      {/* Render questions if available */}
      {renderQuestions()}
    </div>
  );
}

export default Syllabus;
