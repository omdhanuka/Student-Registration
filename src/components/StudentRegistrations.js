import React, { useState, useEffect } from "react";

function StudentRegistrations() {
  const [offerings, setOfferings] = useState([]);
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem("registrations");
    return saved ? JSON.parse(saved) : [];
  });
  const [types, setTypes] = useState([]);
  
  const [studentName, setStudentName] = useState("");
  const [selectedOfferingIndex, setSelectedOfferingIndex] = useState("");
  const [filterType, setFilterType] = useState("");
  const [viewMode, setViewMode] = useState("register"); // "register" or "view"
  const [selectedViewOffering, setSelectedViewOffering] = useState("");
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Load course offerings and types from localStorage
  useEffect(() => {
    const loadedOfferings = JSON.parse(localStorage.getItem("courseOfferings") || "[]");
    const loadedTypes = JSON.parse(localStorage.getItem("courseTypes") || "[]");
    
    setOfferings(loadedOfferings);
    setTypes(loadedTypes);
  }, []);

  // Save registrations when they change
  useEffect(() => {
    localStorage.setItem("registrations", JSON.stringify(registrations));
  }, [registrations]);

  const handleRegister = () => {
    // Clear previous messages
    setError("");
    setSuccessMessage("");
    
    // Validation
    if (!studentName.trim()) {
      setError("Please enter a student name");
      return;
    }
    
    if (selectedOfferingIndex === "") {
      setError("Please select a course offering");
      return;
    }
    
    const offeringIndex = parseInt(selectedOfferingIndex);
    const offering = offerings[offeringIndex];
    
    if (!offering) {
      setError("Invalid course offering selected");
      return;
    }
    
    // Check if this student is already registered for this offering
    const alreadyRegistered = registrations.some(
      r => r.student.toLowerCase() === studentName.trim().toLowerCase() && 
           r.type === offering.type && 
           r.course === offering.course
    );
    
    if (alreadyRegistered) {
      setError(`${studentName} is already registered for ${offering.type} - ${offering.course}`);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API delay for better UX feedback
    setTimeout(() => {
      // Create a new registration with a unique ID
      const newRegistration = {
        id: Date.now().toString(),
        student: studentName.trim(),
        type: offering.type,
        course: offering.course,
        date: new Date().toLocaleDateString()
      };
      
      const updatedRegistrations = [...registrations, newRegistration];
      setRegistrations(updatedRegistrations);
      setSuccessMessage(`Successfully registered ${studentName} for ${offering.type} - ${offering.course}`);
      
      // Reset form
      setStudentName("");
      setSelectedOfferingIndex("");
      setIsLoading(false);
      
      // Clear success message after some time
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 500);
  };
  
  const handleDeleteRegistration = (id) => {
    setIsLoading(true);
    
    // Find the registration for better UX feedback
    const regToDelete = registrations.find(reg => reg.id === id);
    
    // Simulate API delay
    setTimeout(() => {
      setRegistrations(registrations.filter(reg => reg.id !== id));
      setSuccessMessage(`Removed ${regToDelete?.student || "student"} from registration`);
      setIsLoading(false);
      
      // Clear success message after some time
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 300);
  };

  // Filter offerings by selected type
  const filteredOfferings = filterType
    ? offerings.filter(off => off.type === filterType)
    : offerings;
    
  // Get students for the selected offering in view mode
  const studentsForOffering = (selectedViewOffering !== "") 
    ? registrations.filter(reg => {
        const offering = offerings[parseInt(selectedViewOffering)];
        return offering && reg.type === offering.type && reg.course === offering.course;
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card overflow-hidden">
      <div className="bg-brand-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Student Registrations</h2>
        <p className="text-brand-100 text-sm mt-1">
          Register students for courses or view existing registrations
        </p>
      </div>

      <div className="p-6">
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
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

        <div className="mb-6 flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
              viewMode === "register"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setViewMode("register")}
          >
            Register Students
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
              viewMode === "view"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setViewMode("view")}
          >
            View Registrations
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Course Type
          </label>
          <select
            id="filterType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {viewMode === "register" ? (
          <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Register New Student</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="studentName"
                  type="text"
                  className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter student full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="courseOffering" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Offering <span className="text-red-500">*</span>
                </label>
                <select
                  id="courseOffering"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                  value={selectedOfferingIndex}
                  onChange={(e) => setSelectedOfferingIndex(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select a course offering</option>
                  {filteredOfferings.map((off, idx) => (
                    <option key={idx} value={offerings.indexOf(off)}>
                      {off.type} - {off.course}
                    </option>
                  ))}
                </select>
                {filteredOfferings.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    No course offerings available {filterType ? `for type "${filterType}"` : ""}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isLoading || !studentName.trim() || selectedOfferingIndex === ""
                    ? "bg-brand-400 cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                }`}
                onClick={handleRegister}
                disabled={isLoading || !studentName.trim() || selectedOfferingIndex === ""}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register Student"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">View Students by Course Offering</h3>
            
            <div className="mb-4">
              <label htmlFor="viewCourseOffering" className="block text-sm font-medium text-gray-700 mb-1">
                Select Course Offering
              </label>
              <select
                id="viewCourseOffering"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                value={selectedViewOffering}
                onChange={(e) => setSelectedViewOffering(e.target.value)}
              >
                <option value="">Select a course offering</option>
                {filteredOfferings.map((off, idx) => (
                  <option key={idx} value={offerings.indexOf(off)}>
                    {off.type} - {off.course}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedViewOffering !== "" && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Students registered for{" "}
                  {offerings[parseInt(selectedViewOffering)] && 
                    <span className="font-semibold">
                      {offerings[parseInt(selectedViewOffering)].type} - {offerings[parseInt(selectedViewOffering)].course}
                    </span>
                  }:
                </h4>
                
                {studentsForOffering.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 italic">
                    No students registered for this course offering.
                  </div>
                ) : (
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {studentsForOffering.map((reg, idx) => (
                      <li key={idx} className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800">{reg.student}</span>
                          <span className="text-xs text-gray-500">{reg.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {viewMode === "register" && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">All Registrations</h3>
            
            {registrations.length === 0 ? (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-900">No students registered yet</p>
                <p className="mt-1 text-sm text-gray-500">Register your first student above.</p>
              </div>
            ) : (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {registrations
                  .filter(reg => filterType ? reg.type === filterType : true)
                  .map((reg, idx) => (
                    <li key={idx} className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{reg.student}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {reg.type} - {reg.course}
                            {reg.date && <span className="ml-2">({reg.date})</span>}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRegistration(reg.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentRegistrations;
