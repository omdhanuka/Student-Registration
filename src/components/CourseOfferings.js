import React, { useState, useEffect } from "react";

function CourseOfferings() {
  const [types, setTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [offerings, setOfferings] = useState(() => {
    const saved = localStorage.getItem("courseOfferings");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedType, setSelectedType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load course types and courses from localStorage
  useEffect(() => {
    const loadedTypes = JSON.parse(localStorage.getItem("courseTypes") || "[]");
    const loadedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    
    if (loadedTypes.length === 0) {
      setError("Please add course types before creating offerings");
    }
    
    if (loadedCourses.length === 0) {
      setError("Please add courses before creating offerings");
    }
    
    setTypes(loadedTypes);
    setCourses(loadedCourses);
  }, []);

  // Save offerings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("courseOfferings", JSON.stringify(offerings));
  }, [offerings]);

  const handleAdd = () => {
    // Clear previous messages
    setError("");
    setSuccess("");
    
    if (!selectedType) {
      setError("Please select a course type");
      return;
    }
    
    if (!selectedCourse) {
      setError("Please select a course");
      return;
    }
    
    setIsLoading(true);
    
    // Create a new offering with a unique ID
    const newOffering = {
      id: Date.now().toString(),
      type: selectedType,
      course: selectedCourse,
      date: new Date().toLocaleDateString()
    };
    
    // Check for duplicates
    const isDuplicate = offerings.some(
      off => off.type === selectedType && off.course === selectedCourse && editIdx === null
    );
    
    if (isDuplicate) {
      setError(`The combination "${selectedType} - ${selectedCourse}" already exists.`);
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      if (editIdx !== null) {
        // Update existing offering
        const updated = [...offerings];
        updated[editIdx] = newOffering;
        setOfferings(updated);
        setSuccess(`Updated "${selectedType} - ${selectedCourse}" offering successfully`);
        setEditIdx(null);
      } else {
        // Add new offering
        setOfferings([...offerings, newOffering]);
        setSuccess(`Created new "${selectedType} - ${selectedCourse}" offering successfully`);
      }
      
      // Reset form
      setSelectedType("");
      setSelectedCourse("");
      setIsLoading(false);
      
      // Clear success after some time
      setTimeout(() => setSuccess(""), 3000);
    }, 400);
  };

  const handleEdit = (idx) => {
    const offering = offerings[idx];
    setSelectedType(offering.type);
    setSelectedCourse(offering.course);
    setEditIdx(idx);
    setError("");
    setSuccess("");
  };

  const handleDelete = (idx) => {
    // Check if the offering is used in student registrations
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
    const offering = offerings[idx];
    const isInUse = registrations.some(r => 
      r.course === offering.course && r.type === offering.type
    );
    
    if (isInUse) {
      setError(`Cannot delete this offering as students are registered for it.`);
      return;
    }
    
    setIsLoading(true);
    const offeringToDelete = offerings[idx];
    
    setTimeout(() => {
      setOfferings(offerings.filter((_, i) => i !== idx));
      setSuccess(`Deleted "${offeringToDelete.type} - ${offeringToDelete.course}" offering successfully`);
      
      if (editIdx === idx) {
        setEditIdx(null);
        setSelectedType("");
        setSelectedCourse("");
      }
      
      setIsLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card overflow-hidden">
      <div className="bg-brand-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Course Offerings</h2>
        <p className="text-brand-100 text-sm mt-1">
          Combine course types and subjects to create course offerings
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

        <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {editIdx !== null ? "Edit Course Offering" : "Create New Course Offering"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">
                Course Type <span className="text-red-500">*</span>
              </label>
              <select
                id="courseType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={isLoading || types.length === 0}
              >
                <option value="">Select a course type</option>
                {types.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {types.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No course types available. Please add some first.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                id="course"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={isLoading || courses.length === 0}
              >
                <option value="">Select a course</option>
                {courses.map((course, idx) => (
                  <option key={idx} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {courses.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No courses available. Please add some first.
                </p>
              )}
            </div>

            <button
              type="button"
              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLoading || !selectedType || !selectedCourse || types.length === 0 || courses.length === 0
                  ? "bg-brand-400 cursor-not-allowed"
                  : "bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              }`}
              onClick={handleAdd}
              disabled={isLoading || !selectedType || !selectedCourse || types.length === 0 || courses.length === 0}
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
                "Update Offering"
              ) : (
                "Create Offering"
              )}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Existing Course Offerings</h3>

          {offerings.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">No course offerings yet</p>
              <p className="mt-1 text-sm text-gray-500">Create your first course offering above.</p>
            </div>
          ) : (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {offerings.map((offering, idx) => (
                <li key={idx} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {offering.type} - {offering.course}
                      </h4>
                      {offering.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Added on {offering.date}
                        </p>
                      )}
                    </div>
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

export default CourseOfferings;
