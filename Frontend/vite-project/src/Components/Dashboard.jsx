import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useModal } from '../ModalContext.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom Next Arrow Button
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Next
    </div>
  );
}

// Custom Prev Arrow Button
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      Prev
    </div>
  );
}

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const getSubjectName = async () => {
      try {
        const response = await axios.get('/api/v1/users/getSubs');
        const subjectData = response.data.subjectNames;
        if (Array.isArray(subjectData)) {
          setSubjects(subjectData);
        } else {
          console.error('Data returned is not an array:', subjectData);
        }
      } catch (error) {
        console.error('Error during getting names', error.message);
      }
    };

    getSubjectName();
  }, []);

  const handleAddSubject = async () => {
    try {
      await axios.post('/api/v1/users/createSubject', { Subjectname: newSubject });
      setSubjects([...subjects, newSubject]);
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
    }

    setNewSubject('');
    closeModal();
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-screen-xl pt-40 relative">
        <Slider {...settings}>
          {subjects.map((subject, index) => (
            <div key={index} className="p-2">
              <div className="w-full h-32 border border-solid border-black flex items-center justify-center rounded-lg">
                <span>{subject}</span>
              </div>
            </div>
          ))}
        </Slider>
        {/* Positioning for custom arrows */}
        <style>{`
          .custom-arrow {
            position: absolute;
            top: 50%;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            z-index: 1;
          }
          .custom-next {
            right: 10px;
          }
          .custom-prev {
            left: 10px;
          }
        `}</style>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={()=>closeModal()}>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg mb-4">Enter Subject Name</h2>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="border px-4 py-2 mb-4 w-full"
              placeholder="Subject Name"
            />
            <button onClick={handleAddSubject} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
