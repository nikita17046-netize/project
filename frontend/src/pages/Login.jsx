import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const userRole = data.user.role ? data.user.role.toLowerCase() : 'student';
                
                if (userRole === 'admin') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection refused. Is the backend running?');
        }
    };

    return (
        <div className="auth-immersive-container">
            {/* Animated Background */}
            <div className="auth-bg-overlay">
                <img 
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070" 
                    alt="background" 
                    className="auth-bg-image pan-animation"
                />
            </div>

            <div className="auth-card-classic glass-premium animate-fade-in">
                <div className="auth-header-classic">
                    <div className="auth-icon-circle">
                        <LogIn size={32} color="#000000" />
                    </div>
                    <h1>Classic Login</h1>
                    <p>Enter your credentials to access the platform</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form-classic">
                    {error && <div className="classic-error-msg">{error}</div>}

                    <div className="classic-input-group">
                        <div className="input-icon-classic"><Mail size={18} /></div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="classic-input-group">
                        <div className="input-icon-classic"><Lock size={18} /></div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="classic-auth-btn">
                        Login Now <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer-classic">
                    <p>New to the platform? <Link to="/register">Create an Account</Link></p>
                </div>
            </div>

            <style jsx>{`
                .auth-immersive-container {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001; /* Above navbar if needed, or just standard fullscreen */
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
                    margin-bottom: 2.5rem;
                }

                .auth-icon-circle {
                    width: 70px;
                    height: 70px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }

                .auth-header-classic h1 {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.5px;
                }

                .auth-header-classic p {
                    color: #666;
                    font-size: 1rem;
                }

                .auth-form-classic {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
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
                    padding: 1rem 1rem 1rem 3rem;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    outline: none;
                    color: #1a1a1a;
                }

                .classic-auth-btn {
                    background: #000;
                    color: white;
                    border: none;
                    padding: 1.1rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }

                .classic-auth-btn:hover {
                    background: #333;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .auth-footer-classic {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.95rem;
                    color: #666;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    padding-top: 2rem;
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
                    padding: 0.75rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    border: 1px solid #feb2b2;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Login;
