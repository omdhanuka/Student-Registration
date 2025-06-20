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

  // Load course types and courses
  useEffect(() => {
    const loadedTypes = JSON.parse(localStorage.getItem("courseTypes") || "[]");
    const loadedCourses = JSON.parse(localStorage.getItem("courses") || "[]");

    setTypes(loadedTypes);
    setCourses(loadedCourses);

    if (loadedTypes.length === 0 && loadedCourses.length === 0) {
      setError("Please add course types and courses before creating offerings");
    } else if (loadedTypes.length === 0) {
      setError("Please add course types before creating offerings");
    } else if (loadedCourses.length === 0) {
      setError("Please add courses before creating offerings");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("courseOfferings", JSON.stringify(offerings));
  }, [offerings]);

  const handleAdd = () => {
    setError("");
    setSuccess("");

    if (!selectedType) return setError("Please select a course type");
    if (!selectedCourse) return setError("Please select a course");

    setIsLoading(true);

    const newOffering = {
      id: Date.now().toString(),
      type: selectedType,
      course: selectedCourse,
      date: new Date().toLocaleDateString(),
    };

    const isDuplicate =
      editIdx === null &&
      offerings.some(
        (o) => o.type === selectedType && o.course === selectedCourse
      );

    if (isDuplicate) {
      setError(`The combination "${selectedType} - ${selectedCourse}" already exists.`);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (editIdx !== null) {
        const updated = [...offerings];
        updated[editIdx] = newOffering;
        setOfferings(updated);
        setSuccess(`Updated offering successfully`);
        setEditIdx(null);
      } else {
        setOfferings([...offerings, newOffering]);
        setSuccess(`Created new offering successfully`);
      }

      setSelectedType("");
      setSelectedCourse("");
      setIsLoading(false);

      setTimeout(() => setSuccess(""), 3000);
    }, 300);
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
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
    const offering = offerings[idx];

    const isInUse = registrations.some(
      (r) => r.course === offering.course && r.type === offering.type
    );

    if (isInUse) {
      setError("Cannot delete this offering. It has registered students.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const updated = offerings.filter((_, i) => i !== idx);
      setOfferings(updated);
      setSuccess("Deleted offering successfully");

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
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Course Offerings</h2>
      <p className="text-gray-500 mb-4">Manage course type and subject combinations.</p>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 border border-green-400">
          {success}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block font-medium text-sm mb-1">Course Type *</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`w-full p-2 border rounded ${
              error.includes("type") ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select course type</option>
            {types.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Course *</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`w-full p-2 border rounded ${
              error.includes("course") ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select course</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`w-full py-2 rounded text-white font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleAdd}
          disabled={isLoading || !types.length || !courses.length}
        >
          {isLoading
            ? "Processing..."
            : editIdx !== null
            ? "Update Offering"
            : "Create Offering"}
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Existing Course Offerings</h3>
        {offerings.length === 0 ? (
          <p className="text-gray-500 italic">No course offerings yet.</p>
        ) : (
          <ul className="divide-y border rounded">
            {offerings.map((offering, idx) => (
              <li key={offering.id} className="flex justify-between p-2">
                <div>
                  <div className="font-medium">
                    {offering.type} - {offering.course}
                  </div>
                  <div className="text-xs text-gray-500">
                    Added on {offering.date}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="text-blue-600 hover:underline"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-red-600 hover:underline"
                    disabled={isLoading}
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
  );
}

export default CourseOfferings;
