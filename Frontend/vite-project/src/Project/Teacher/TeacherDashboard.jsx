import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GiveCredits() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [marks, setMarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/su/students", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.filter(student => student.active));
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students.");
    }
  }, [navigate]);

  const fetchAssignments = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/su/teacher/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignments(data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, [fetchStudents, fetchAssignments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedAssignment || !marks) {
      toast.error("Please select a student, an assignment, and enter marks.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/su/teacher/assignment/${selectedAssignment}/give-credit`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: { id: selectedStudent },
          marks: parseInt(marks),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign credits");
      }

      // Success animation
      setAnimate(false);
      setTimeout(() => {
        toast.success("Credits assigned successfully!");
        navigate("/teacher-dashboard");
      }, 500);
    } catch (error) {
      console.error("Error assigning credits:", error);
      toast.error("Failed to assign credits.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading students and assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dark Blue Navigation Bar with Animation */}
      <nav className="bg-[#1E3A8A] text-white shadow-lg animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">StandUp</span>
              </div>
              
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="px-6 py-2 bg-white text-[#1E3A8A] rounded-lg text-sm font-medium  transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      

      {/* Main Content with Animations */}
      <main className="container mx-auto px-6 py-8">
        <div className={`max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200 transition-all duration-500 ease-out ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center animate-pulse">Assign Student Credits</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`transition-all duration-500 delay-100 ${
              animate ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
            }`}>
              <label className="block text-gray-700 font-medium mb-2">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md"
                required
              >
                <option value="">-- Select a student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.username}
                  </option>
                ))}
              </select>
            </div>

            <div className={`transition-all duration-500 delay-200 ${
              animate ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
            }`}>
              <label className="block text-gray-700 font-medium mb-2">Select Assignment</label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md"
                required
              >
                <option value="">-- Select an assignment --</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title} - {assignment.creditMarks} Marks
                  </option>
                ))}
              </select>
            </div>

            <div className={`transition-all duration-500 delay-300 ${
              animate ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
            }`}>
              <label className="block text-gray-700 font-medium mb-2">Enter Marks</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md"
                placeholder="Enter marks"
                required
              />
            </div>

            <div className={`transition-all duration-500 delay-400 ${
              animate ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-[#1E3A8A] hover:bg-blue-900 hover:shadow-lg'
                } transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Submit Credits'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}