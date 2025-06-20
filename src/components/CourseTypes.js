import React, { useState, useEffect } from "react";

function CourseTypes() {
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem("courseTypes");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("courseTypes", JSON.stringify(types));
  }, [types]);

  const handleAdd = () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    if (!input.trim()) {
      setError("Please enter a course type");
      return;
    }

    setIsLoading(true);

    // Check for duplicates
    if (
      editIdx === null &&
      types.some(
        (type) => type.toLowerCase() === input.trim().toLowerCase()
      )
    ) {
      setError(`Course type "${input.trim()}" already exists`);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (editIdx !== null) {
        // Update existing course type
        const updated = [...types];
        updated[editIdx] = input.trim();
        setTypes(updated);
        setSuccess(`Course type updated to "${input.trim()}"`);
        setEditIdx(null);
      } else {
        // Add new course type
        setTypes([...types, input.trim()]);
        setSuccess(`Course type "${input.trim()}" added successfully`);
      }
      setInput("");
      setIsLoading(false);

      // Clear success message after some time
      setTimeout(() => setSuccess(""), 3000);
    }, 300);
  };

  const handleEdit = (idx) => {
    setInput(types[idx]);
    setEditIdx(idx);
    setError("");
    setSuccess("");
  };

  const handleDelete = (idx) => {
    // Check if the course type is in use
    const courseOfferings = JSON.parse(
      localStorage.getItem("courseOfferings") || "[]"
    );
    const isInUse = courseOfferings.some(
      (offering) => offering.type === types[idx]
    );

    if (isInUse) {
      setError(
        `Cannot delete "${types[idx]}" as it's being used in course offerings.`
      );
      return;
    }

    setIsLoading(true);
    const typeToDelete = types[idx];

    setTimeout(() => {
      setTypes(types.filter((_, i) => i !== idx));
      setSuccess(`Course type "${typeToDelete}" deleted successfully`);

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
        <h2 className="text-xl font-semibold text-white">Course Types</h2>
        <p className="text-brand-100 text-sm mt-1">
          Manage the different types of courses offered
        </p>
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">
            Course Type
          </label>
          <div className="flex space-x-3">
            <input
              id="courseType"
              type="text"
              className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Individual, Group"
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Existing Course Types</h3>

          {types.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">No course types added yet</p>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new course type.</p>
            </div>
          ) : (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {types.map((type, idx) => (
                <li key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-gray-800">{type}</span>
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

export default CourseTypes;
