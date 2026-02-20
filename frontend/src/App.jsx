import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCourses from './pages/MyCourses';
import Network from './pages/Network';
import Quizzes from './pages/Quizzes';
import CourseDetails from './pages/CourseDetails';
import AllCourses from './pages/AllCourses';
import GenericPage from './pages/GenericPage';
import './App.css';

// Layout wrapper to handle conditional rendering of Sidebar/Navbar
const Layout = ({ children, theme, toggleTheme, logout }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/' 
        || location.pathname.startsWith('/course/') 
        || location.pathname.startsWith('/all-courses')
        || location.pathname.startsWith('/solutions/')
        || location.pathname.startsWith('/resources/')
        || location.pathname === '/network';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // If it's home page or course details, we use Navbar and different layout
    if (isHomePage) {
        return (
            <div className="home-layout">
                <Navbar isAuthenticated={!!localStorage.getItem('token')} onLogout={logout} />
                <main className="home-main">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // If auth page, just return content
    if (isAuthPage) {
        return <>{children}</>;
    }

    // Independent Admin Layout (No Student Sidebar)
    const isAdminPage = location.pathname === '/admin';
    if (isAdminPage) {
        return <div className="admin-layout-container">{children}</div>;
    }

    // Default Dashboard Layout
    return (
        <div className="app-container">
            <Sidebar theme={theme} onLogout={logout} />
            <main className="main-content">
                <Header theme={theme} toggleTheme={toggleTheme} />
                <div className="content-inner">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
};

// Protected Route for Admin
const ProtectedAdminRoute = ({ children }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role?.toLowerCase() !== 'admin') {
        return <Navigate to="/student" replace />;
    }

    return children;
};

function App() {
    const [theme, setTheme] = useState('dark');
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        window.location.href = '/';
    };

    return (
        <Router>
            <Layout theme={theme} toggleTheme={toggleTheme} logout={logout}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/admin" element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/courses" element={<MyCourses />} />
                    <Route path="/network" element={<Network />} />
                    <Route path="/quizzes" element={<Quizzes />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/all-courses" element={<AllCourses />} />
                    <Route path="/solutions/:slug" element={<GenericPage type="solutions" />} />
                    <Route path="/resources/:slug" element={<GenericPage type="resources" />} />
                    <Route path="/profile" element={<StudentDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;


