import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateInstructor, setUpdateInstructor] = useState({ courseId: '', instructorId: '' });

  // Recursive function to flatten nested courses
  const parseCourses = (data) => {
    const courseMap = new Map(); // Use a Map to avoid duplicates

    const extractCourses = (courseList) => {
      courseList.forEach((course) => {
        if (!courseMap.has(course.courseId)) {
          // Add the course to the map
          courseMap.set(course.courseId, {
            courseId: course.courseId,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            instructorName: course.courseInstructor?.instructorName || 'N/A',
            instructorEmail: course.courseInstructor?.instructorEmail || 'N/A',
          });
        }

        // Recursively process nested courses
        if (course.courseInstructor?.courses?.length) {
          extractCourses(course.courseInstructor.courses);
        }
      });
    };

    extractCourses(data);
    return Array.from(courseMap.values()); // Convert Map values to an array
  };

  // Fetch all courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/getAllCourses');
        const parsedCourses = parseCourses(response.data);
        setCourses(parsedCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Update course instructor
  const handleUpdateInstructor = async () => {
    const { courseId, instructorId } = updateInstructor;
    if (!courseId || !instructorId) {
      alert('Please provide both Course ID and Instructor ID');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/admin/courses/${courseId}/${instructorId}`);
      alert('Instructor updated successfully');
      setUpdateInstructor({ courseId: '', instructorId: '' });
    } catch (err) {
      alert('Failed to update instructor');
    }
  };

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8080/admin/courses/${courseId}`);
      alert('Course deleted successfully');
      setCourses(courses.filter((course) => course.courseId !== courseId));
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-600">Loading courses...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div>
        <Navbar/>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Course Management</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Course Instructor</h2>
        <div className="flex gap-4">
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Course ID"
            value={updateInstructor.courseId}
            onChange={(e) => setUpdateInstructor({ ...updateInstructor, courseId: e.target.value })}
          />
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Instructor ID"
            value={updateInstructor.instructorId}
            onChange={(e) => setUpdateInstructor({ ...updateInstructor, instructorId: e.target.value })}
          />
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleUpdateInstructor}
        >
          Update Instructor
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Courses</h2>
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="border-b p-2 text-gray-600">ID</th>
              <th className="border-b p-2 text-gray-600">Title</th>
              <th className="border-b p-2 text-gray-600">Description</th>
              <th className="border-b p-2 text-gray-600">Instructor</th>
              <th className="border-b p-2 text-gray-600">Email</th>
              <th className="border-b p-2 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId} className="hover:bg-gray-100">
                <td className="p-2 border-b">{course.courseId}</td>
                <td className="p-2 border-b">{course.courseName}</td>
                <td className="p-2 border-b">{course.courseDescription}</td>
                <td className="p-2 border-b">{course.instructorName}</td>
                <td className="p-2 border-b">{course.instructorEmail}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDeleteCourse(course.courseId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default CoursesPage;
