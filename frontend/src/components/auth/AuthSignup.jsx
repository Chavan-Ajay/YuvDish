import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';

const AuthSignup = () => {
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* Main content */}
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg mx-auto space-y-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Signup As</h2>
                    
                    {/* Job Seeker Button */}
                    <button
                        className="w-full py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-300"
                        onClick={() => navigate("/jobSeeker/signup")}
                    >
                        Job Seeker
                    </button>
                    
                    {/* Recruiter Button */}
                    <button
                        className="w-full py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-300"
                        onClick={() => navigate("/recruiter/signup")}
                    >
                        Recruiter
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default AuthSignup;
