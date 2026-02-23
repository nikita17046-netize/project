import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight, ShieldCheck, User, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Registration failed. Check backend connection.');
        }
    };

    return (
        <div className="auth-immersive-container">
            {/* Animated Background */}
            <div className="auth-bg-overlay">
                <img 
                    src="/assets/auth_register_bg.png" 
                    alt="background" 
                    className="auth-bg-image pan-animation"
                />
            </div>

            <div className="auth-card-classic glass-premium animate-fade-in" style={{ maxWidth: '500px' }}>
                <div className="auth-header-classic">
                    <div className="auth-icon-circle">
                        <UserPlus size={32} color="#000000" />
                    </div>
                    <h1>Join Us</h1>
                    <p>Create your professional account today</p>
                </div>

                <form onSubmit={handleRegister} className="auth-form-classic">
                    {error && <div className="classic-error-msg">{error}</div>}

                    <div className="classic-input-group">
                        <div className="input-icon-classic"><User size={18} /></div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="classic-input-group">
                        <div className="input-icon-classic"><Mail size={18} /></div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="classic-input-group">
                        <div className="input-icon-classic"><Lock size={18} /></div>
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="classic-role-selection">
                        <p className="classic-role-label">Choose your access level:</p>
                        <div className="classic-radio-group">
                            <label className={`classic-radio-pill ${formData.role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                                <User size={16} />
                                <span>Student</span>
                            </label>

                            <label className={`classic-radio-pill ${formData.role === 'admin' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                                <ShieldCheck size={16} />
                                <span>Admin</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="classic-auth-btn">
                        Get Started <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer-classic">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>

            <style jsx>{`
                .auth-immersive-container {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                    overflow: hidden;
                }

                .auth-bg-overlay {
                    position: absolute;
                    inset: 0;
                    background: #000;
                }

                .auth-bg-image {
                    width: 110%;
                    height: 110%;
                    object-fit: cover;
                    opacity: 0.6;
                }

                .pan-animation {
                    animation: pan-slow 20s ease-in-out infinite alternate;
                }

                @keyframes pan-slow {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.1) translate(-2%, -2%); }
                }

                .auth-card-classic {
                    width: 100%;
                    max-width: 450px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 24px;
                    padding: 3rem;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
                    position: relative;
                    z-index: 2;
                }

                .glass-premium {
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }

                .auth-header-classic {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .auth-icon-circle {
                    width: 70px;
                    height: 70px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }

                .auth-header-classic h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 0.25rem;
                    letter-spacing: -0.5px;
                }

                .auth-header-classic p {
                    color: #666;
                    font-size: 0.95rem;
                }

                .auth-form-classic {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .classic-input-group {
                    position: relative;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    transition: all 0.3s;
                }

                .classic-input-group:focus-within {
                    border-color: #000;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
                }

                .input-icon-classic {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }

                .classic-input-group input {
                    width: 100%;
                    padding: 0.85rem 1rem 0.85rem 3rem;
                    border: none;
                    background: transparent;
                    font-size: 0.95rem;
                    outline: none;
                    color: #1a1a1a;
                }

                .classic-role-selection {
                    margin-top: 0.5rem;
                }

                .classic-role-label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #444;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .classic-radio-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }

                .classic-radio-pill {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #666;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .classic-radio-pill input {
                    display: none;
                }

                .classic-radio-pill:hover {
                    border-color: #000;
                    background: #fafafa;
                }

                .classic-radio-pill.active {
                    background: #000;
                    color: white;
                    border-color: #000;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .classic-auth-btn {
                    background: #000;
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 1.05rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 0.5rem;
                }

                .classic-auth-btn:hover {
                    background: #333;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .auth-footer-classic {
                    margin-top: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #666;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    padding-top: 1.5rem;
                }

                .auth-footer-classic a {
                    color: #000;
                    font-weight: 700;
                    text-decoration: none;
                    margin-left: 0.5rem;
                }

                .classic-error-msg {
                    background: #fff5f5;
                    color: #e53e3e;
                    padding: 0.7rem;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    border: 1px solid #feb2b2;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Register;
