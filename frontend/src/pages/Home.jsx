import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, FileQuestion, Users, Trophy, Target, PlayCircle } from 'lucide-react';
import QuizModal from '../components/QuizModal';
import '../index.css';

const Home = () => {
    const [quizzes, setQuizzes] = React.useState([]);
    const [recentCourses, setRecentCourses] = React.useState([]);


    const [showQuizModal, setShowQuizModal] = React.useState(false);
    const [selectedQuiz, setSelectedQuiz] = React.useState(null);

    React.useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/quizzes');
                if (res.ok) {
                    const data = await res.json();
                    setQuizzes(data);
                }
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            }
        };

        const fetchCourses = async () => {
             try {
                const res = await fetch('http://localhost:5000/api/admin/courses');
                if (res.ok) {
                    const data = await res.json();
                    setRecentCourses(data);
                }
            } catch (error) {
                console.error("Failed to load courses:", error);
            }
        };

        fetchQuizzes();
        fetchCourses();
    }, []);

    const handleStartQuiz = (quiz, e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setSelectedQuiz(quiz);
        setShowQuizModal(true);
    };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Learning Platform
          </div>
          <h1>
            Master Your Future with <span className="gradient-text">ALME</span>
          </h1>
          <p className="hero-subtitle">
            Experience the next generation of personalized learning. 
            AI-driven quizzes, adaptive courses, and real-time analytics 
            designed to skyrocket your potential.
          </p>
          <div className="hero-cta">
            <NavLink to="/register" className="btn-primary-lg">
              Get Started <ArrowRight size={20} />
            </NavLink>

          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-orb-container">
            <div className="visual-orb main">
              <BrainCircuit size={64} color="var(--primary)" />
            </div>
            {/* Floating Elements for decoration */}
            <div className="float-card item-1 GLASS">
              <Trophy size={20} color="#fbbf24" />
              <span>Top Rated</span>
            </div>
            <div className="float-card item-2 GLASS">
              <Users size={20} color="#38bdf8" />
              <span>10k+ Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose ALME?</h2>
          <p>Everything you need to excel in your academic journey.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="icon-box primary">
              <BookOpen size={24} />
            </div>
            <h3>Comprehensive Courses</h3>
            <p>Access a vast library of expert-curated content across multiple disciplines.</p>
          </div>

          <div className="feature-card glass">
            <div className="icon-box secondary">
              <FileQuestion size={24} />
            </div>
            <h3>Intelligent Quizzes</h3>
            <p>Test your knowledge with AI-generated quizzes that adapt to your learning pace.</p>
          </div>

          <div className="feature-card glass">
            <div className="icon-box accent">
              <Target size={24} />
            </div>
            <h3>Real-time Analytics</h3>
            <p>Track your progress with detailed dashboards and personalized insights.</p>
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      <section id="quizzes" className="quizzes-section">
        <div className="section-header">
          <h2>Trending Quizzes</h2>
          <p>Challenge yourself with our most popular assessments.</p>
        </div>

        <div className="quizzes-grid">
           {/* Mock Data - In real app, fetch from API */}
           {quizzes.slice(0, 3).map((quiz) => (
             <div key={quiz._id} className="card quiz-card-home glass">
                <div className="card-top">
                    <span className="badge-category">{quiz.category || 'General'}</span>
                    <span className="badge-points">+{quiz.points} PTS</span>
                </div>
                <h3>{quiz.title}</h3>
                <div className="card-meta">
                    <span>{quiz.duration}</span>
                    <span>•</span>
                    <span>{quiz.difficulty || 'Mixed'}</span>
                </div>
                <div className="btn-start-quiz" onClick={(e) => handleStartQuiz(quiz, e)} style={{cursor: 'pointer'}}>
                    Start Quiz <ArrowRight size={16} />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Dashboard Overview Section */}
      <section id="dashboard" className="dashboard-section">
        <div className="section-header-row">
            <div className="header-text">
                <h2>Your Dashboard</h2>
                <p>At a glance overview of your progress.</p>
            </div>
            <NavLink to="/student" className="btn-text-link">
                More Details <ArrowRight size={16} />
            </NavLink>
        </div>
        <div className="dashboard-preview glass">
            <div className="stat-card">
                <h3>3</h3>
                <p>Courses in Progress</p>
            </div>
            <div className="stat-card">
                <h3>12</h3>
                <p>Certificates Earned</p>
            </div>
            <div className="stat-card">
                <h3>850</h3>
                <p>Ecosystem Points</p>
            </div>
            <div className="stat-card">
                <h3>4.8</h3>
                <p>Average Score</p>
            </div>
        </div>
      </section>

      {/* My Courses Section */}
      <section id="courses" className="courses-section">
        <div className="section-header-row">
            <div className="header-text">
                <h2>My Academic Path</h2>
                <p>Continue where you left off.</p>
            </div>
            <NavLink to="/all-courses" className="btn-text-link">
                View All Courses <ArrowRight size={16} />
            </NavLink>
        </div>
        <div className="courses-grid-home">
          {recentCourses.length > 0 ? (
            recentCourses.slice(0, 3).map(course => (
             <div key={course._id || course.id} className="card course-card-home glass">
                <div className="course-img-wrapper">
                    <img src={course.image} alt={course.title} />
                    <div className="progress-overlay">
                        <span className="progress-text">{Math.floor(Math.random() * 100)}% Complete</span>
                    </div>
                </div>
                <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="instructor">By {course.instructor}</p>
                    <NavLink to={`/course/${course._id || course.id}`} className="btn-resume">
                        <PlayCircle size={16} /> Resume
                    </NavLink>
                </div>
             </div>
           ))
          ) : (
             <p style={{color: 'var(--text-muted)', textAlign: 'center', width: '100%'}}>Loading courses...</p>
          )}
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" className="mentors-section">
        <div className="section-header-row">
            <div className="header-text">
                <h2>Expert Mentors</h2>
                <p>Learn from the visionaries shaping the future.</p>
            </div>
             <NavLink to="/mentors" className="btn-text-link">
                Meet All Mentors <ArrowRight size={16} />
            </NavLink>
        </div>
        <div className="mentors-grid">
            {[
                { name: "Dr. Sarah Logic", role: "AI Specialist", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60" },
                { name: "Prof. James Byte", role: "Full Stack Lead", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60" },
                { name: "Elena Flow", role: "UI/UX Pioneer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60" },
                { name: "David Code", role: "Security Analyst", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60" }
            ].map((mentor, index) => (
                <div key={index} className="mentor-card glass">
                    <div className="mentor-img">
                        <img src={mentor.img} alt={mentor.name} />
                    </div>
                    <h3>{mentor.name}</h3>
                    <p>{mentor.role}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="community-section">
        <div className="community-banner glass">
            <div className="community-content">
                <h2>Join the Global Brain Trust</h2>
                <p>Connect with 10,000+ learners, share insights, and collaborate on projects in our exclusive Discord community.</p>
                <div className="btn-primary-lg" style={{marginTop: '1rem', display: 'inline-flex', cursor: 'pointer'}}>
                    Join Community <Users size={20} />
                </div>
            </div>
            <div className="community-visual">
                <div className="avatar-group">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="avatar-circle" style={{left: `${(i-1)*30}px`, zIndex: i}}></div>
                    ))}
                    <div className="avatar-circle count" style={{left: '150px', zIndex: 6}}>+10k</div>
                </div>
            </div>
        </div>
      </section>






      <section className="stats-section">
        <div className="stats-container glass">
            <div className="stat-item">
                <h3>50+</h3>
                <p>Active Courses</p>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
                <h3>10k+</h3>
                <p>Quizzes Taken</p>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
                <h3>99%</h3>
                <p>Satisfaction</p>
            </div>
        </div>
      </section>

      {/* Quiz Modal Integration */}
      {showQuizModal && selectedQuiz && (
        <QuizModal 
            quiz={selectedQuiz}
            userId={JSON.parse(localStorage.getItem('user'))?.id}
            onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
