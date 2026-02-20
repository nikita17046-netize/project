import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Star, ArrowRight, PlayCircle } from 'lucide-react';
import '../index.css';
import './AllCourses.css';

const AllCourses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Use the same API endpoint that the Admin uses
                const res = await fetch('http://localhost:5000/api/admin/courses');
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Development', 'AI', 'Design', 'Security', 'Data Science'];

    return (
        <div className="all-courses-container animate-slide-up">
            <div className="catalog-header">
                <h1>Explore Our Course Catalog</h1>
                <p>Discover expert-led courses to advance your career.</p>
                
                <div className="search-bar-lg glass">
                    <Search size={20} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search for courses, skills, or instructors..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tags">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="catalog-grid">
                {filteredCourses.map(course => (
                    <div key={course._id || course.id} className="card course-card-home glass">
                        <div className="course-img-wrapper">
                            <img src={course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"} alt={course.title} />
                            <div className="level-badge">{course.level || "Beginner"}</div>
                        </div>
                        <div className="course-content">
                            <div className="course-rating">
                                <Star size={14} fill="#fbbf24" stroke="none" /> 
                                <span>{course.rating || 'New'} ({course.reviews || 0})</span>
                            </div>
                            <h3>{course.title}</h3>
                            <p className="instructor">By {course.instructor || "Unknown"}</p>
                            
                            <div className="course-meta-row">
                                <span><Clock size={14} /> {course.duration || "TBD"}</span>
                                <span><BookOpen size={14} /> {course.lessons || 0} Lessons</span>
                            </div>

                            <NavLink to={`/course/${course._id || course.id}`} className="btn-resume">
                                View Details <ArrowRight size={16} />
                            </NavLink>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default AllCourses;
