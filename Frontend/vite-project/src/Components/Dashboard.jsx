import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
    const location = useLocation();
    const userData = location.state?.userData || { subjects: [] }; // Fallback to empty array if no subjects

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="subjects-container">
                {/* Check if userData.subjects is empty */}
                {userData.subjects.length === 0 ? (
                    <div className="add-subject-box">
                        <button className="add-subject-btn">
                            <span>+</span>
                        </button>
                    </div>
                ) : (
                    <div className="subject-list">
                        {/* Always show the + icon */}
                        <div className="add-subject-box">
                            <button className="add-subject-btn">
                                <span>+</span>
                            </button>
                        </div>
                        {/* Show subjects from the userData array */}
                        {userData.subjects.map((subject, index) => (
                            <div key={index} className="subject-box">
                                {subject}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
