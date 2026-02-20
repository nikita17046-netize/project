import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, BrainCircuit } from 'lucide-react';
import '../index.css';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="brand-logo">
                        <BrainCircuit size={32} color="var(--primary)" />
                        <span className="logo-text">ALME</span>
                    </div>
                    <p>Empowering the next generation of developers and thinkers with AI-driven personalized learning.</p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><Facebook size={20} /></a>
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                        <a href="#" className="social-icon"><Instagram size={20} /></a>
                        <a href="#" className="social-icon"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li>
                            <a href="#courses" onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('courses');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#courses';
                                }
                            }}>Courses</a>
                        </li>
                        <li>
                            <a href="#quizzes" onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('quizzes');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#quizzes';
                                }
                            }}>Quizzes</a>
                        </li>
                        <li>
                            <a href="#mentors" onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('mentors');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#mentors';
                                }
                            }}>Mentors</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Community</h3>
                    <ul>
                        <li>
                            <a href="#community" onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('community');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#community';
                                }
                            }}>Brain Trust</a>
                        </li>
                        <li><a href="#">Discord Server</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Events</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <ul className="contact-list">
                        <li><Mail size={16} /> <span>support@alme.edu</span></li>
                        <li><Phone size={16} /> <span>+1 (555) 123-4567</span></li>
                        <li><MapPin size={16} /> <span>Silicon Valley, CA</span></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} ALME Platform. All rights reserved.</p>
                <div className="legal-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
