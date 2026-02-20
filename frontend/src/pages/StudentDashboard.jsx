import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    AreaChart, Area
} from 'recharts';
import {
    AlertCircle, Zap, Brain, TrendingUp, Calendar, BrainCircuit
} from 'lucide-react';
import QuizModal from '../components/QuizModal';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    const fetchData = () => {
        const userJson = localStorage.getItem('user');
        const userObj = userJson ? JSON.parse(userJson) : null;
        const url = userObj ? `http://localhost:5000/api/student/${userObj.id}/dashboard` : 'http://localhost:5000/api/student/dashboard/mock';

        fetch(url)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setLoading(false);
            });
    };

    const [joinedCircles, setJoinedCircles] = useState([]);
    useEffect(() => {
        const circles = JSON.parse(localStorage.getItem('joinedCircles') || '[]');
        setJoinedCircles(circles);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const startRecommendedQuiz = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quiz/mock');
            const quizData = await response.json();
            setSelectedQuiz(quizData);
            setShowQuiz(true);
        } catch (err) {
            alert("No quiz available for this recommendation yet.");
        }
    };

    const handleTileClick = (label) => {
        switch (label) {
            case "Skill Level":
                setActiveTab('analytics');
                break;
            case "Progress":
                navigate('/courses');
                break;
            case "AI Recommendation":
                startRecommendedQuiz();
                break;
            case "Weak Spot":
                alert(`Revision mode activated for: ${data?.weakSpot || "General Fundamentals"}. Redirecting to practice lab...`);
                break;
            case "Forecast":
                alert(`Ecosystem Forecast: At your current velocity (${data?.overallCompletion}% in 1 week), you will reach Professional level by March and Complete Mastery by ${data?.forecast || "May 2026"}.`);
                break;
            default:
                break;
        }
    };

    if (loading) return (
        <div className="loading-screen" style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <BrainCircuit size={60} className="pulse" color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Initializing Ecosystem</h2>
            <p className="text-muted">Analyzing your intelligent learning path...</p>
        </div>
    );

    const userName = localStorage.getItem('token') ? (data?.user?.name || 'Academic') : 'Guest';

    return (
        <div className="dashboard-wrapper animate-slide-up">
            <header className="dashboard-header-modern" style={{ marginBottom: '1.5rem' }}>
                <div className="welcome-info">
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome, {userName} 🚀</h1>
                    <p className="text-muted">Your intelligent ecosystem is optimized for peak performance.</p>
                </div>
            </header>

            <div className="tab-navigation">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Smart Overview</button>
                <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Deep Analytics</button>
            </div>

            {activeTab === 'overview' && (
                <>
                    <section className="overview-section">
                        <div className="grid-overview">
                            <StatTile
                                icon={<Zap size={22} color="#f59e0b" />}
                                label="Skill Level"
                                value={data?.overallCompletion > 50 ? 'Intermediate' : 'Beginner'}
                                sub="Click for breakdown"
                                onClick={() => handleTileClick("Skill Level")}
                            />
                            <StatTile
                                icon={<TrendingUp size={22} color="#6366f1" />}
                                label="Progress"
                                value={`${data?.overallCompletion || 0}%`}
                                sub="Go to My Courses"
                                onClick={() => handleTileClick("Progress")}
                            />
                            <StatTile
                                icon={<Brain size={22} color="#0ea5e9" />}
                                label="AI Recommendation"
                                value={data?.recommendation || 'Analyzing Path'}
                                sub="Start Intelligent Quiz"
                                highlight
                                onClick={() => handleTileClick("AI Recommendation")}
                            />
                            <StatTile
                                icon={<AlertCircle size={22} color="#f43f5e" />}
                                label="Weak Spot"
                                value={data?.weakSpot || "None detected"}
                                sub="Click for revision"
                                onClick={() => handleTileClick("Weak Spot")}
                            />
                            <StatTile
                                icon={<Calendar size={22} color="#10b981" />}
                                label="Forecast"
                                value={data?.forecast || "TBD"}
                                sub="View timeline"
                                onClick={() => handleTileClick("Forecast")}
                            />
                        </div>
                    </section>

                    {/* Subscribed Circles Section (New) */}
                    {joinedCircles.length > 0 && (
                        <div className="animate-slide-up" style={{ marginBottom: '2rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div className="card-top" style={{ marginBottom: '1rem' }}>
                                    <h3>My Study Circles 🌐</h3>
                                    <p className="text-muted text-sm">Communities you are actively researching with</p>
                                </div>
                                <div className="circles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {joinedCircles.map(circle => (
                                        <div key={circle} className="circle-card-mini" style={{ padding: '1rem', background: 'var(--background)', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <BrainCircuit size={18} />
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{circle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="main-analytics-grid">
                        <div className="card span-8">
                            <div className="card-top">
                                <h3>Learning Velocity</h3>
                                <p className="text-muted text-sm">Quantifying your progress over time</p>
                            </div>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.progressOverTime || [
                                        { date: '12 Feb', p: 0 }, { date: '14 Feb', p: 0 }, { date: '16 Feb', p: 0 }, { date: '18 Feb', p: 0 }
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} unit="%" />
                                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="p" stroke="var(--primary)" strokeWidth={4} fill="url(#colorArea)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card span-4">
                            <div className="card-top">
                                <h3>Adaptive Skill Tree</h3>
                                <p className="text-muted text-sm">Visualizing prerequisites</p>
                            </div>
                            <div className="skill-tree-visual">
                                {(data?.progress || [
                                    { skill: { name: 'HTML Basics' }, status: 'completed' },
                                    { skill: { name: 'CSS Fundamentals' }, status: 'in-progress' },
                                    { skill: { name: 'JavaScript Core' }, status: 'locked' }
                                ]).map((p, idx) => (
                                    <div key={idx} className="path-item">
                                        <div className={`node-dot ${p.status}`}></div>
                                        <div className="node-content">
                                            <span className="node-name">{p.skill?.name}</span>
                                            <span className={`node-status-text ${p.status}`}>{p.status.replace('-', ' ')}</span>
                                        </div>
                                        {idx < 2 && <div className="node-connector"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <div className="main-analytics-grid">
                    <div className="card span-6 analytics-card">
                        <div className="card-top"><h3>Technology Mastery</h3></div>
                        <div className="chart-wrapper" style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={[
                                    { subject: 'HTML', A: 90 }, { subject: 'CSS', A: 85 },
                                    { subject: 'JS', A: 65 }, { subject: 'React', A: 45 },
                                    { subject: 'Node', A: 35 }
                                ]} cx="50%" cy="50%" outerRadius="70%">
                                    <PolarGrid stroke="var(--border)" />
                                    <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" fontSize={14} fontWeight={600} />
                                    <Radar dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="card span-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="promo-box" style={{ textAlign: 'center', padding: '2.5rem' }}>
                            <div className="orb-icon-wrap" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <BrainCircuit size={40} color="var(--primary)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Deep Logic Analysis</h3>
                            <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>
                                Advanced behavioral analytics based on <b>{data?.progress?.length || 5} trackable nodes</b> in your ecosystem.
                            </p>
                            <button className="primary-btn-sm" style={{ marginTop: '2rem', height: '50px', padding: '0 2rem', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: 700 }} onClick={() => navigate('/courses')}>
                                View Course Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showQuiz && selectedQuiz && (
                <QuizModal
                    quiz={selectedQuiz}
                    userId={JSON.parse(localStorage.getItem('user'))?.id}
                    onClose={() => { setShowQuiz(false); fetchData(); }}
                    onComplete={() => fetchData()}
                />
            )}

            <style jsx>{`
          .stat-tile { cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
          .stat-tile:active { transform: scale(0.95); }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 2rem; }
          .quiz-modal { width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; padding: 3rem; }
          .analytics-card { position: relative; overflow: visible; }
      `}</style>
        </div>
    );
};

const StatTile = ({ icon, label, value, sub, highlight, onClick }) => (
    <div className={`stat-tile ${highlight ? 'highlight' : ''}`} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <span className="stat-label">{label}</span>
        </div>
        <span className="stat-value">{value}</span>
        <span className="stat-sub">{sub}</span>
    </div>
);

export default StudentDashboard;
