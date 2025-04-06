import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // Fetch students (active only)
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

  // Fetch teacher's assignments with credit marks
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
    
    // If assignmentId is provided in URL params, preselect it
    if (assignmentId) {
      setSelectedAssignment(assignmentId);
    }
  }, [fetchStudents, fetchAssignments, assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedAssignment || !marks) {
      toast.error("Please select a student, an assignment, and enter marks.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/su/give-credits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          studentId: selectedStudent, 
          assignmentId: selectedAssignment, 
          marks 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign credits");
      }

      toast.success("Credits assigned successfully!");
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error("Error assigning credits:", error);
      toast.error("Failed to assign credits.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-middle"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Loading students and assignments...</p>
        </div>
      </div>
    );
  }

  // Find selected assignment details for display
  const selectedAssignmentDetails = assignments.find(a => a.id === selectedAssignment);
  const maxMarks = selectedAssignmentDetails?.creditMarks || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Assign Student Credits</h2>
              <button 
                onClick={() => navigate("/teacher-dashboard")}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Dashboard
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">-- Select an assignment --</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title} ({assignment.creditMarks} max marks)
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssignment && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Assignment Details</h3>
                  <p className="text-sm text-blue-700">
                    Maximum marks: <span className="font-bold">{maxMarks}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Marks {maxMarks ? `(out of ${maxMarks})` : ''}
                </label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  min="0"
                  max={maxMarks || undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter marks"
                  required
                />
                {maxMarks > 0 && parseInt(marks) > maxMarks && (
                  <p className="mt-1 text-sm text-red-600">
                    Warning: Marks exceed the maximum value for this assignment.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/teacher-dashboard")}
                  className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Credits
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}