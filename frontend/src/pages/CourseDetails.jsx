import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle, Clock, BookOpen, Star, Share2, MoreHorizontal, CheckCircle, Users } from 'lucide-react';
import '../index.css';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();

    const [course, setCourse] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('Overview');
    const [relatedCourses, setRelatedCourses] = React.useState([]);
    const [isSubscribed, setIsSubscribed] = React.useState(false);
    const [showNotification, setShowNotification] = React.useState(false);

    const handleSubscribe = () => {
        setIsSubscribed(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    React.useEffect(() => {
        // Reset view and state when ID changes
        window.scrollTo(0, 0);
        setLoading(true);
        setIsSubscribed(false);
        setShowNotification(false);

        // Fetch course details from API
        const fetchCourse = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/admin/courses`); 
                if (res.ok) {
                    const allCourses = await res.json();
                    console.log("All requested courses:", allCourses);
                    console.log("Looking for ID:", id);
                    
                    // Try to match by _id first, then by legacy id if needed
                    const found = allCourses.find(c => String(c._id) === String(id) || String(c.id) === String(id));
                    console.log("Found course:", found);
                    
                    // Fallback to a default if not found (for safety) or the first one
                    const current = found || allCourses[0];
                    setCourse(current);

                    // Filter for related courses (exclude current)
                    let others = allCourses.filter(c => c._id !== current._id);
                    
                    const sameCategory = others.filter(c => c.category === current.category);
                    if (sameCategory.length > 0) {
                        others = sameCategory;
                    }
                    
                    setRelatedCourses(others.slice(0, 3)); // Take top 3
                }
            } catch (error) {
                console.error("Failed to load course details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div className="loading-spinner">Loading Course Details...</div>;
    if (!course) return <div className="error-message">Course not found</div>;

    const mockReviews = [
        { id: 1, user: "Alex Johnson", role: "Frontend Dev", comment: "This course was exactly what I needed. The project-based approach is superior.", rating: 5, avatar: "A" },
        { id: 2, user: "Sarah Smith", role: "Student", comment: "Great content, but some parts were a bit fast. Rewatching helped!", rating: 4, avatar: "S" },
        { id: 3, user: "Michael Chen", role: "Full Stack Engineer", comment: "The advanced patterns section is gold. Highly recommended for seniors too.", rating: 5, avatar: "M" }
    ];

    return (
        <div className="course-details-container animate-slide-up">
            
            {/* Notification Toast */}
            {showNotification && (
                <div className="notification-toast">
                    <CheckCircle size={20} />
                    <span>Successfully subscribed to this course!</span>
                </div>
            )}

            {/* Navigation Bar */}
            <div className="details-nav">
                <NavLink to="/" className="back-link">
                    <ArrowLeft size={20} /> Back to Home
                </NavLink>
                <div className="nav-actions">
                    <button className="icon-btn"><Share2 size={20} /></button>
                    <button className="icon-btn"><MoreHorizontal size={20} /></button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="details-grid">
                
                {/* Left Column: Video & Content */}
                <div className="details-main">
                    <div className="video-player-wrapper glass">
                        <iframe
                            width="100%"
                            height="100%"
                            src={course.videoUrl || "https://www.youtube.com/embed/pWDvOtmU9dI"} // Fallback video (Tech background)
                            title={course.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="course-header-info">
                        <div className="badges">
                            <span className="badge-category">{course.category || "Development"}</span>
                            <span className="badge-rating"><Star size={14} fill="#fbbf24" stroke="none"/> {course.rating || 5.0}</span>
                        </div>
                        <h1>{course.title}</h1>
                        <p className="instructor-meta">Created by <strong>{course.instructor}</strong> • {course.role || "Lead Instructor"}</p>
                    </div>

                    <div className="tabs-container glass">
                        <div className="tabs-header">
                            <button className={`tab-btn ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')}>Overview</button>
                            <button className={`tab-btn ${activeTab === 'Curriculum' ? 'active' : ''}`} onClick={() => setActiveTab('Curriculum')}>Curriculum</button>
                            <button className={`tab-btn ${activeTab === 'Reviews' ? 'active' : ''}`} onClick={() => setActiveTab('Reviews')}>Reviews</button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'Overview' && (
                                <div className="animate-fade-in">
                                    <h3>About This Course</h3>
                                    <p>{course.description || "No description available for this course yet."}</p>
                                    
                                    <div className="learning-points">
                                        <h3>What you'll learn</h3>
                                        <ul>
                                            <li><CheckCircle size={16} color="var(--primary)" /> Master core concepts and advanced patterns</li>
                                            <li><CheckCircle size={16} color="var(--primary)" /> Build real-world projects from scratch</li>
                                            <li><CheckCircle size={16} color="var(--primary)" /> Best practices for scalable architecture</li>
                                            <li><CheckCircle size={16} color="var(--primary)" /> Industry standard tools and workflows</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Curriculum' && (
                                <div className="animate-fade-in">
                                    <h3>Course Curriculum</h3>
                                    <div className="curriculum-list">
                                        <div className="lesson-item"><PlayCircle size={16}/> Introduction to {course.title}</div>
                                        <div className="lesson-item"><PlayCircle size={16}/> Setting up the environment</div>
                                        <div className="lesson-item"><PlayCircle size={16}/> Core Concepts Deep Dive</div>
                                        <div className="lesson-item"><PlayCircle size={16}/> Final Project Build</div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Reviews' && (
                                <div className="animate-fade-in">
                                    <h3>Student Reviews ({mockReviews.length})</h3>
                                    <div className="reviews-list">
                                        {mockReviews.map(review => (
                                            <div key={review.id} className="review-card glass">
                                                <div className="review-header">
                                                    <div className="review-avatar">{review.avatar}</div>
                                                    <div>
                                                        <h4 className="review-author">{review.user}</h4>
                                                        <span className="review-role">{review.role}</span>
                                                    </div>
                                                    <div className="review-rating">
                                                        {Array.from({ length: review.rating }).map((_, i) => (
                                                            <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="review-text">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Stats */}
                <div className="details-sidebar">
                    <div className="sidebar-card glass">
                        <div className="price-tag">Included</div>
                        <div className="progress-card-section">
                            <div className="progress-info">
                                <span>Your Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{width: `${course.progress || 0}%`}}></div>
                            </div>
                        </div>
                        
                        <div className="course-features-list">
                            <div className="feature-item">
                                <Clock size={18} /> <span>{course.duration} on-demand video</span>
                            </div>
                            <div className="feature-item">
                                <BookOpen size={18} /> <span>{course.lessons} Lessons</span>
                            </div>
                            <div className="feature-item">
                                <Share2 size={18} /> <span>Full lifetime access</span>
                            </div>
                        </div>

                        {isSubscribed ? (
                             <button className="btn-primary-lg full-width">Continue Learning</button>
                        ) : (
                             <button className="btn-primary-lg full-width" onClick={handleSubscribe}>Subscribe Now</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Courses Section */}
            <section className="related-courses-section">
                 <h2>Related Courses</h2>
                 {relatedCourses.length > 0 ? (
                     <div className="related-grid">
                        {relatedCourses.map(related => (
                            <NavLink key={related.id || related._id} to={`/course/${related._id || related.id}`} className="card course-card-home glass">
                                <div className="course-img-wrapper">
                                    <img 
                                        src={related.image || `https://source.unsplash.com/random/800x600?${related.category}`} 
                                        alt={related.title} 
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'; }}
                                    />
                                    <div className="level-badge">{related.level || "Beginner"}</div>
                                </div>
                                <div className="course-content">
                                    <div className="course-rating">
                                        <Star size={14} fill="#fbbf24" stroke="none" /> 
                                        <span>{related.rating || '4.8'} ({related.reviews || 120})</span>
                                    </div>
                                    <h3>{related.title}</h3>
                                    <p className="instructor">By {related.instructor}</p>
                                    
                                    <div className="course-meta-row">
                                        <span><Clock size={14} /> {related.duration || "TBD"}</span>
                                        <span><BookOpen size={14} /> {related.lessons || 10} Lessons</span>
                                    </div>

                                    <div className="btn-resume">
                                        View Details <ArrowRight size={16} />
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                     </div>
                 ) : (
                     <p className="text-muted">No related courses found.</p>
                 )}
            </section>


        </div>
    );
};

export default CourseDetails;
