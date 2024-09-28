import React, { useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import { useModal } from '../Context/ModalContext.jsx';

const Header = () => {
    const { openModal } = useModal();

  const { isAuthenticated, logout ,loading} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout =() => {
    logout(); // Call the logout function from context
    navigate('/login'); // Redirect to login page
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while validating token
  }

  return (
    <header className="bg-white border-gray-200 py-3 px-6 flex justify-between justify-center items-center">
      <div  className="flex items-center">
                        <img
                            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                    </div>
      <nav>

        <Link to="/" className="px-3 hover:underline">Home</Link>

        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="ml-3 px-3 py-1 bg-red-500 rounded-lg hover:bg-red-700 transition duration-300">
              Logout
            </button>
            <button
              onClick={openModal}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 m-3 focus:outline-none"
            >
              Add Your Subject
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 hover:underline">Login</Link>
            <Link to="/signup" className=" px-3  hover:underline">
              Signup
            </Link>
           
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
