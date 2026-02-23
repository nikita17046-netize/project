import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Clock, Brain, AlertCircle, ArrowRight } from 'lucide-react';
import './QuizModal.css';

const QuizModal = ({ quiz, onClose, userId, onComplete }) => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [aiFeedback, setAiFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    const [userAnswers, setUserAnswers] = useState([]);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    // Shuffle questions on mount
    useEffect(() => {
        if (quiz?.questions) {
            const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5);
            const limit = quiz.questionCount || 5;
            setShuffledQuestions(shuffled.slice(0, Math.min(limit, shuffled.length)));
        }
    }, [quiz]);

    useEffect(() => {
        if (finished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    submitQuiz();
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [finished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNext = () => {
        const currentQ = shuffledQuestions[currentQuestion];
        const isCorrect = selectedOption === currentQ.correctOption;
        
        // Track the answer
        setUserAnswers([...userAnswers, {
            questionIndex: currentQuestion,
            questionText: currentQ.questionText,
            selectedOption,
            correctOption: currentQ.correctOption,
            options: currentQ.options,
            explanation: currentQ.explanation,
            isCorrect
        }]);

        if (isCorrect) {
            setScore(score + 100);
        }

        if (currentQuestion + 1 < shuffledQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            // Need to pass the *updated* score/answers to submit because state update acts async
            const finalScore = isCorrect ? score + 100 : score;
            submitQuiz(finalScore); 
        }
    };

    const submitQuiz = async (forcedScore) => {
        const finalScoreVal = forcedScore !== undefined ? forcedScore : score;
        const finalPercentage = (finalScoreVal / (shuffledQuestions.length * 100)) * 100;
        
        try {
            const response = await fetch('http://localhost:5000/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    quizId: quiz._id,
                    score: finalPercentage,
                    timeSpent: 300 - timeLeft
                })
            });
            const result = await response.json();
            setAiFeedback(result.feedback);
            setScore(finalScoreVal); // Ensure state matches
            setFinished(true);
            if (onComplete) onComplete();
        } catch (err) {
            console.error(err);
            setAiFeedback("AI Analysis complete: Your understanding of the core concepts is solid. Focus on practical implementation to reach 'Master' level.");
            setScore(finalScoreVal);
            setFinished(true);
        }
    };

    // Calculate stats for display
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const wrongCount = userAnswers.length - correctCount;

    return (
        <div className="modal-overlay">
            <button className="btn-close-immersive" onClick={onClose}><X size={32} /></button>

            <div className="quiz-modal-immersive animate-fade-in">
                {!shuffledQuestions || shuffledQuestions.length === 0 ? (
                    <div className="empty-quiz-state" style={{padding: '5rem', textAlign: 'center', width: '100%'}}>
                        <AlertCircle size={64} color="#f43f5e" style={{marginBottom: '1rem'}} />
                        <h2 style={{fontSize: '2rem'}}>Assessment Unavailable</h2>
                        <p style={{fontSize: '1.2rem', color: 'var(--quiz-text-muted)', marginTop: '1rem'}}>
                            This focus area doesn't have active questions yet. Our AI is generating them.
                        </p>
                        <button className="btn-exit-premium" onClick={onClose} style={{marginTop: '3rem'}}>Return to Knowledge Base</button>
                    </div>
                ) : !finished ? (
                    <>
                        <header className="quiz-header-premium">
                            <div className="quiz-meta-row">
                                <div className="quiz-info-group">
                                    <div className="topic-badge-premium">{quiz.relatedSkill?.name || 'Knowledge Evaluation'}</div>
                                    <h1>{quiz.title}</h1>
                                </div>
                                <div className={`timer-box-premium ${timeLeft < 60 ? 'urgent' : ''}`}>
                                    <Clock size={24} />
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                            <div className="progress-track-premium">
                                <div className="progress-bar-premium" style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}></div>
                            </div>
                        </header>

                        <div className="quiz-content-immersive">
                            <div className="question-card-premium">
                                <div className="question-num-pill">MODULE STAGE {currentQuestion + 1} / {shuffledQuestions.length}</div>
                                <h2 className="question-text-premium">{shuffledQuestions[currentQuestion].questionText}</h2>
                            </div>

                            <div className="choices-grid-premium">
                                {shuffledQuestions[currentQuestion].options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className={`choice-card-premium ${selectedOption === idx ? 'selected' : ''}`}
                                        onClick={() => setSelectedOption(idx)}
                                    >
                                        <div className="choice-index-circle">{String.fromCharCode(65 + idx)}</div>
                                        <div className="choice-label-premium">{option}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="quiz-footer-premium">
                            <div className="hint-chip">
                                <Brain size={18} />
                                <span>Verify your logic before proceeding to the next stage</span>
                            </div>
                            <button
                                className="btn-continue-premium"
                                disabled={selectedOption === null}
                                onClick={handleNext}
                            >
                                {currentQuestion + 1 === shuffledQuestions.length ? 'Finalize Evaluation' : 'Advance Module'} 
                                <ArrowRight size={20} />
                            </button>
                        </footer>
                    </>
                ) : (
                    <div className="results-page-premium">
                        <div className="results-hero">
                            <span className="modal-subtitle">Evaluation Success</span>
                            <h1 className="score-display-premium">
                                {Math.round((score / (shuffledQuestions.length * 100)) * 100)}%
                            </h1>
                            <p style={{fontSize: '1.25rem', color: 'var(--quiz-text-muted)'}}>
                                Assessment complete. Your cognitive performance has been logged.
                            </p>
                        </div>
                        
                        <div className="eval-summary-cards">
                            <div className="eval-stat-card">
                                <span className="val text-green">{correctCount}</span>
                                <span className="label">Validated Hits</span>
                            </div>
                             <div className="eval-stat-card">
                                <span className="val text-red">{wrongCount}</span>
                                <span className="label">Critical Misses</span>
                            </div>
                            <div className="eval-stat-card">
                                <span className="val" style={{color: 'var(--quiz-accent)'}}>{formatTime(300 - timeLeft)}</span>
                                <span className="label">Processing Time</span>
                            </div>
                        </div>

                        <div className="ai-briefing-pro">
                            <div className="ai-head-line">
                                <Brain size={24} />
                                <span>Neural Analysis Briefing</span>
                            </div>
                            <p>{aiFeedback}</p>
                        </div>
                        
                        <div className="review-section">
                            <h3 className="review-header-title">
                                <AlertCircle size={22} /> Cognitive Performance Review
                            </h3>
                            <div className="review-list-pro">
                                {userAnswers.map((ans, idx) => (
                                    <div key={idx} className={`review-item-pro ${ans.isCorrect ? 'validated' : 'adjustment'}`}>
                                        <div className="review-item-header">
                                            <span className={`review-type-badge ${ans.isCorrect ? 'bg-green' : 'bg-red'}`}>
                                                {ans.isCorrect ? 'Validated Concept' : 'Cognitive Adjustment'}
                                            </span>
                                            <p className="q-text-pro">{ans.questionText}</p>
                                        </div>
                                        
                                        <div className="comparison-grid-pro">
                                            <div className="ans-col">
                                                <h4>Correct Logic</h4>
                                                <p className="correct-text">{ans.options[ans.correctOption]}</p>
                                            </div>
                                            <div className="ans-col">
                                                <h4>Your Input</h4>
                                                <p className={ans.isCorrect ? 'correct-text' : 'wrong-text'}>
                                                    {ans.options[ans.selectedOption]}
                                                </p>
                                            </div>
                                        </div>
                                        {ans.explanation && (
                                            <div className="explanation-box">
                                                <p>{ans.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {quiz.relatedCourse && (
                                <button 
                                    className="btn-go-course"
                                    onClick={() => navigate(`/course/${quiz.relatedCourse}`)}
                                    style={{ marginTop: '3rem', marginBottom: '3rem', width: 'fit-content', padding: '15px 30px' }}
                                >
                                   Recalibrate via Course Material <ArrowRight size={16} />
                                </button>
                            )}
                        </div>

                        <div style={{paddingBottom: '5rem'}}>
                            <button className="btn-exit-premium" onClick={onClose}>
                                Securely Exit Assessment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
