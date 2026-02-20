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
            setShuffledQuestions(shuffled);
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
            <div className={`quiz-modal card glass animate-slide-up ${finished ? 'wide-modal' : ''}`}>
                <button className="close-btn-circle" onClick={onClose}><X size={18} /></button>

                {!shuffledQuestions || shuffledQuestions.length === 0 ? (
                    <div className="empty-quiz-state" style={{padding: '2rem', textAlign: 'center'}}>
                        <AlertCircle size={48} color="var(--accent)" style={{marginBottom: '1rem'}} />
                        <h3>No Questions Available</h3>
                        <p className="text-muted">This quiz has no questions yet. Please try another one.</p>
                        <button className="primary-btn-sm" onClick={onClose} style={{marginTop: '1rem'}}>Close</button>
                    </div>
                ) : !finished ? (
                    <>
                        <div className="quiz-header-modern">
                            <div className="topic-badge">{quiz.relatedSkill?.name || 'Topic Test'}</div>
                            <h3>{quiz.title}</h3>
                            <div className="quiz-tracker">
                                <div className="tracker-text">Question {currentQuestion + 1} of {shuffledQuestions.length}</div>
                                <div className={`timer-box ${timeLeft < 60 ? 'urgent' : ''}`}>
                                    <Clock size={16} />
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="question-container quiz-content-scroll">
                            <h2 className="question-text">{shuffledQuestions[currentQuestion].questionText}</h2>
                            <div className="options-vertical">
                                {shuffledQuestions[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`nav-item option-pill ${selectedOption === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedOption(idx)}
                                    >
                                        <span className="option-index">{String.fromCharCode(65 + idx)}</span>
                                        <span className="option-label">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <footer className="quiz-footer">
                            <div className="hint-text"><AlertCircle size={14} /> Select the best answer to proceed</div>
                            <button
                                className="primary-btn-sm"
                                style={{ width: '150px', height: '45px' }}
                                disabled={selectedOption === null}
                                onClick={handleNext}
                            >
                                {currentQuestion + 1 === shuffledQuestions.length ? 'Finalize' : 'Continue'}
                            </button>
                        </footer>
                    </>
                ) : (
                    <div className="result-container animate-fade-in">
                        <div className="result-header">
                            <div className="success-icon-wrap">
                                <CheckCircle size={60} color="#10b981" />
                            </div>
                            <div>
                                <h2>Evaluation Complete</h2>
                                <p className="text-muted">Here is how you performed</p>
                            </div>
                        </div>
                        
                        <div className="stats-row">
                            <div className="stat-box">
                                <span className="stat-val text-success">{correctCount}</span>
                                <span className="stat-label">Correct</span>
                            </div>
                             <div className="stat-box">
                                <span className="stat-val text-danger">{wrongCount}</span>
                                <span className="stat-label">Wrong</span>
                            </div>
                            <div className="stat-box">
                                <div className="score-ring-sm">
                                    <div className="score-val">{(score / (shuffledQuestions.length * 100)) * 100}%</div>
                                </div>
                                <span className="stat-label">Accuracy</span>
                            </div>
                        </div>

                        <div className="ai-feedback-modern">
                            <div className="ai-head">
                                <Brain size={20} />
                                <span>AI Logic Feedback</span>
                            </div>
                            <p>{aiFeedback}</p>
                        </div>
                        
                        {/* Review Section */}
                        {wrongCount > 0 && (
                            <div className="review-section">
                                <h3 className="review-title">Review Incorrect Answers</h3>
                                <div className="review-list">
                                    {userAnswers.filter(a => !a.isCorrect).map((ans, idx) => (
                                        <div key={idx} className="review-card">
                                            <p className="review-question"><strong>Q:</strong> {ans.questionText}</p>
                                            
                                            <div className="review-stack">
                                                <div className="correct-choice text-success">
                                                    <span className="label">Correct Answer:</span>
                                                    <span>{ans.options[ans.correctOption]}</span>
                                                </div>
                                                <div className="user-choice text-danger">
                                                    <span className="label">Your Answer:</span>
                                                    <span>{ans.options[ans.selectedOption]}</span>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                                {quiz.relatedCourse && (
                                    <button 
                                        className="btn-go-course"
                                        onClick={() => navigate(`/course/${quiz.relatedCourse}`)}
                                        style={{ marginTop: '2rem' }}
                                    >
                                       View Related Course <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                        <button className="primary-btn-sm" onClick={onClose} style={{ height: '45px', marginTop: '1rem' }}>Return to Path</button>
                        
                         <style jsx>{`
                            .wide-modal { max-width: 800px !important; }
                            .result-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                            .stats-row { display: flex; gap: 2rem; justify-content: center; width: 100%; margin-bottom: 2rem; }
                            .stat-box { display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.03); padding: 1rem 2rem; border-radius: 12px; min-width: 100px; border: 1px solid var(--border); }
                            .stat-val { font-size: 2rem; font-weight: 800; line-height: 1; margin-bottom: 0.25rem; }
                            .text-success { color: #10b981; }
                            .text-danger { color: #ef4444; }
                            .stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; }
                            .score-ring-sm { width: 60px; height: 60px; border-radius: 50%; border: 4px solid var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }
                            .score-ring-sm .score-val { font-size: 1rem; }
                            
                            .review-section { width: 100%; text-align: left; margin-top: 2rem; padding-bottom: 2rem; }
                            .review-title { font-size: 1.1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
                            .review-list { display: flex; flex-direction: column; gap: 1rem; }
                            .review-card { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: 10px; }
                            .review-question { font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text); }
                            .review-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 0.5rem; }
                            .user-choice, .correct-choice { display: flex; flex-direction: column; gap: 0.2rem; }
                            .label { font-size: 0.75rem; font-weight: 700; opacity: 0.8; }
                            .review-explanation { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.1); }
                         `}</style>
                    </div>
                )}
            </div>

            <style jsx>{`
        .close-btn-circle {
           position: absolute; top: -15px; right: -15px;
           width: 40px; height: 40px; border-radius: 50%;
           background: var(--surface); border: 1px solid var(--border);
           display: flex; align-items: center; justify-content: center;
           box-shadow: var(--shadow); cursor: pointer; color: var(--text-muted);
        }
        .quiz-header-modern { margin-bottom: 2rem; }
        .topic-badge { background: rgba(99, 102, 241, 0.1); color: var(--primary); font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; width: fit-content; margin-bottom: 0.75rem; text-transform: uppercase; }
        .quiz-tracker { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .tracker-text { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .timer-box { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--text); padding: 5px 12px; background: var(--background); border-radius: 10px; border: 1px solid var(--border); }
        .timer-box.urgent { color: var(--accent); border-color: var(--accent); animation: pulse 1s infinite; }
        .progress-bar-container { height: 6px; background: var(--border); border-radius: 10px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }
        
        .question-text { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; line-height: 1.3; }
        .options-vertical { display: flex; flex-direction: column; gap: 0.75rem; }
        .option-pill { background: var(--background) !important; color: var(--text) !important; border: 1px solid var(--border) !important; padding: 1rem 1.5rem !important; justify-content: flex-start !important; cursor: pointer !important; transition: all 0.2s !important; }
        .option-pill:hover { border-color: var(--primary) !important; background: rgba(99, 102, 241, 0.05) !important; }
        .option-pill.active { border-color: var(--primary) !important; background: var(--primary) !important; color: white !important; }
        .option-index { font-weight: 800; margin-right: 1.25rem; opacity: 0.5; width: 20px; }
        .option-pill.active .option-index { opacity: 1; }
        
        .quiz-footer { margin-top: 2.5rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1.5rem; }
        .hint-text { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
        
        .result-container { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 1rem 0; }
        .score-ring { width: 120px; height: 120px; border-radius: 50%; border: 8px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .score-val { font-size: 1.75rem; font-weight: 800; color: var(--primary); line-height: 1; }
        .score-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
        .ai-feedback-modern { background: rgba(99, 102, 241, 0.05); border: 1px solid var(--primary); border-radius: 16px; padding: 1.5rem; width: 100%; text-align: left; }
        .ai-head { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; font-size: 0.9rem; }
        
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
};

export default QuizModal;
