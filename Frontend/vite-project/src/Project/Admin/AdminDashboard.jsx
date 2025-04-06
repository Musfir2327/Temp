import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Dark Blue */}
      <header className="bg-[#1E3A8A] text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-white text-[#1E3A8A] rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          Logout
        </button>
      </header>

      {/* Main Content - White Background with Vertical Buttons */}
      <main className="flex-grow p-8 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-8 text-center"></h2>
          
          <div className="flex flex-col gap-6">
            {/* Teachers Button - First in order */}
            <Link 
              to="/manage-teacher" 
              className="bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] p-6 rounded-lg shadow-md hover:bg-[#1E3A8A] hover:text-white transition-colors duration-300 flex flex-col items-center"
            >
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="text-xl font-semibold">Teachers</span>
            </Link>
            
            {/* Students Button - Second in order */}
            <Link 
              to="/manage-students" 
              className="bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] p-6 rounded-lg shadow-md hover:bg-[#1E3A8A] hover:text-white transition-colors duration-300 flex flex-col items-center"
            >
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span className="text-xl font-semibold">Students</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}