import React, { useState, useEffect } from 'react';
import {
    BrainCircuit,
    PlayCircle,
    Clock,
    Trophy,
    Search,
    HelpCircle,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import QuizModal from '../components/QuizModal';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/quizzes');
                if (res.ok) {
                    const data = await res.json();
                    setQuizzes(data);

                    // Check for URL param to auto-start quiz
                    const params = new URLSearchParams(window.location.search);
                    const startId = params.get('start');
                    if (startId) {
                        const quizToStart = data.find(q => q._id === startId);
                        if (quizToStart) {
                            setSelectedQuiz(quizToStart);
                            setShowQuizModal(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const startQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setShowQuizModal(true);
    };

    const handleQuizComplete = () => {
        // Refresh or update stats if needed
        setShowQuizModal(false);
    };

    return (
        <div className="quizzes-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Assessment Lab 🧠</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Test your logic and earn Ecosystem Points.</p>
                </div>
                <div className="search-bar-modern" style={{ position: 'relative', width: '350px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search for quizzes..."
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                    />
                </div>
            </header>

            <div className="quizzes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {quizzes.map((quiz) => (
                    <div key={quiz._id} className="card quiz-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s' }}>
                        <div className="quiz-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                                <HelpCircle size={24} />
                            </div>
                            <div className="points-badge" style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                                +{quiz.points} PTS
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{quiz.title}</h3>
                            <div className="quiz-meta" style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {quiz.duration}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={14} /> {quiz.difficulty}</span>
                            </div>
                        </div>

                        <div className="quiz-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span className="text-muted">Topic:</span>
                                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{quiz.category}</span>
                            </div>
                            <button className="auth-btn" style={{ marginTop: 0, padding: '0.8rem' }} onClick={() => startQuiz(quiz)}>
                                Start Assessment <PlayCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showQuizModal && selectedQuiz && (
                <QuizModal
                    quiz={selectedQuiz}
                    userId={JSON.parse(localStorage.getItem('user'))?.id}
                    onClose={() => setShowQuizModal(false)}
                    onComplete={handleQuizComplete}
                />
            )}

            <style jsx>{`
                .quiz-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center;
                    z-index: 9999; padding: 2rem;
                }
                .btn-go-home {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    margin-top: 3rem; padding: 0.8rem 2rem;
                    background: transparent; border: 1px solid var(--border);
                    color: var(--text-muted); border-radius: 12px;
                    font-weight: 600; text-decoration: none; transition: all 0.2s;
                }
                .btn-go-home:hover {
                    border-color: var(--primary); color: var(--text);
                }
            `}</style>

            <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
                <a href="/" className="btn-go-home">
                    <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Go to Website
                </a>
            </div>
        </div>
    );
};

export default Quizzes;
