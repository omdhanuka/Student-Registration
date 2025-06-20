import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import CourseTypes from "./components/CourseTypes";
import Courses from "./components/Courses";
import CourseOfferings from "./components/CourseOfferings";
import StudentRegistrations from "./components/StudentRegistrations";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-brand-600">Student Registration System</h1>
                </div>
              </div>
              
              {/* Desktop nav */}
              <nav className="hidden md:flex space-x-4">
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 rounded-md text-sm font-medium bg-brand-50 text-brand-600" 
                      : "px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                >
                  Course Types
                </NavLink>
                <NavLink 
                  to="/courses"
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 rounded-md text-sm font-medium bg-brand-50 text-brand-600" 
                      : "px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                >
                  Courses
                </NavLink>
                <NavLink 
                  to="/offerings" 
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 rounded-md text-sm font-medium bg-brand-50 text-brand-600" 
                      : "px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                >
                  Course Offerings
                </NavLink>
                <NavLink 
                  to="/registrations" 
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 rounded-md text-sm font-medium bg-brand-50 text-brand-600" 
                      : "px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                >
                  Student Registrations
                </NavLink>
              </nav>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  onClick={toggleMobileMenu}
                  type="button" 
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-brand-600 hover:bg-gray-100 focus:outline-none"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {!mobileMenuOpen ? (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <NavLink 
                  to="/"
                  end
                  className={({ isActive }) => 
                    isActive 
                      ? "block px-3 py-2 rounded-md text-base font-medium bg-brand-50 text-brand-600" 
                      : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Course Types
                </NavLink>
                <NavLink 
                  to="/courses"
                  className={({ isActive }) => 
                    isActive 
                      ? "block px-3 py-2 rounded-md text-base font-medium bg-brand-50 text-brand-600" 
                      : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </NavLink>
                <NavLink 
                  to="/offerings" 
                  className={({ isActive }) => 
                    isActive 
                      ? "block px-3 py-2 rounded-md text-base font-medium bg-brand-50 text-brand-600" 
                      : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Course Offerings
                </NavLink>
                <NavLink 
                  to="/registrations" 
                  className={({ isActive }) => 
                    isActive 
                      ? "block px-3 py-2 rounded-md text-base font-medium bg-brand-50 text-brand-600" 
                      : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-brand-600"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Registrations
                </NavLink>
              </div>
            </div>
          )}
        </header>
        
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<CourseTypes />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/offerings" element={<CourseOfferings />} />
            <Route path="/registrations" element={<StudentRegistrations />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              All data is stored locally in your browser
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
