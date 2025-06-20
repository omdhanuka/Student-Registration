import React, { useState, useEffect } from "react";

function Courses() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleAdd = () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    if (!input.trim()) {
      setError("Please enter a course name");
      return;
    }

    setIsLoading(true);

    // Check for duplicates
    if (
      editIdx === null &&
      courses.some(
        (course) => course.toLowerCase() === input.trim().toLowerCase()
      )
    ) {
      setError(`Course "${input.trim()}" already exists`);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (editIdx !== null) {
        // Update existing course
        const updated = [...courses];
        updated[editIdx] = input.trim();
        setCourses(updated);
        setSuccess(`Course updated to "${input.trim()}"`);
        setEditIdx(null);
      } else {
        // Add new course
        setCourses([...courses, input.trim()]);
        setSuccess(`Course "${input.trim()}" added successfully`);
      }
      setInput("");
      setIsLoading(false);

      // Clear success message after some time
      setTimeout(() => setSuccess(""), 3000);
    }, 300);
  };

  const handleEdit = (idx) => {
    setInput(courses[idx]);
    setEditIdx(idx);
    setError("");
    setSuccess("");
  };

  const handleDelete = (idx) => {
    // Check if the course is in use
    const courseOfferings = JSON.parse(
      localStorage.getItem("courseOfferings") || "[]"
    );
    const isInUse = courseOfferings.some(
      (offering) => offering.course === courses[idx]
    );

    if (isInUse) {
      setError(
        `Cannot delete "${courses[idx]}" as it's being used in course offerings.`
      );
      return;
    }

    setIsLoading(true);
    const courseToDelete = courses[idx];

    setTimeout(() => {
      setCourses(courses.filter((_, i) => i !== idx));
      setSuccess(`Course "${courseToDelete}" deleted successfully`);

      if (editIdx === idx) {
        setEditIdx(null);
        setInput("");
      }

      setIsLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }, 300);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-card overflow-hidden">
      <div className="bg-brand-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Courses</h2>
        <p className="text-brand-100 text-sm mt-1">
          Manage the subjects taught in your institution
        </p>
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="courseName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Name
          </label>
          <div className="flex space-x-3">
            <input
              id="courseName"
              type="text"
              className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Hindi, Mathematics"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLoading
                  ? "bg-brand-400 cursor-not-allowed"
                  : "bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              }`}
              onClick={handleAdd}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </span>
              ) : editIdx !== null ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Existing Courses
          </h3>

          {courses.length === 0 ? (
            <div className="rounded-md bg-gray-50 p-6 text-center border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">
                No courses added yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new course above.
              </p>
            </div>
          ) : (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {courses.map((course, idx) => (
                <li
                  key={idx}
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-gray-800">{course}</span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(idx)}
                      disabled={isLoading}
                      className="text-brand-600 hover:text-brand-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
