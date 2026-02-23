import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Users, CheckCircle, AlertTriangle, Activity, Zap, Database,
    Plus, Edit2, Trash2, Search, X, Bell, Settings, Filter, Download, Book, MoreHorizontal, Shield, List, Clock
} from 'lucide-react';

import './AdminDashboard.css';

// Mock Data (Will be replaced by API calls)
const initialCourses = [
    { id: 1, title: 'Advanced React Patterns', instructor: 'Dr. Logic', students: 1240, rating: 4.8 },
    { id: 2, title: 'Full Stack Ecosystems', instructor: 'Prof. Byte', students: 850, rating: 4.9 },
    { id: 3, title: 'AI & Neural Networks', instructor: 'Neural AI', students: 2100, rating: 5.0 },
];

const initialUsers = [
    { id: 1, name: 'Nikita', email: 'nikita@example.com', role: 'admin', status: 'Active' },
    { id: 2, name: 'Student One', email: 'student1@example.com', role: 'student', status: 'Active' },
    { id: 3, name: 'Student Two', email: 'student2@example.com', role: 'student', status: 'Inactive' },
];

const initialQuizzes = [
    { id: 1, title: 'React Fundamentals', course: 'Advanced React Patterns', questions: 10 },
    { id: 2, title: 'Node.js Basics', course: 'Full Stack Ecosystems', questions: 15 },
];

const activeStudentsData = [
    { month: 'Jan', students: 50 },
    { month: 'Feb', students: 120 },
    { month: 'Mar', students: 250 },
    { month: 'Apr', students: 380 },
    { month: 'May', students: 480 },
    { month: 'Jun', students: 600 },
];

const completionData = [
    { name: 'Completed', value: 780 },
    { name: 'In Progress', value: 220 },
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Manager State
    const [courses, setCourses] = useState(initialCourses);
    const [users, setUsers] = useState(initialUsers);
    const [quizzes, setQuizzes] = useState(initialQuizzes);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentItem, setCurrentItem] = useState(null);
    const [itemType, setItemType] = useState('');

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Simulate New Subscriber Notification
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotifications(prev => [
                { id: Date.now(), message: 'New Subscription: Alex joined "JS Logic Masters" circle', time: 'Just now' },
                ...prev
            ]);
        }, 5000); // Verify after 5 seconds
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, coursesRes, usersRes, quizzesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/admin/stats'),
                    fetch('http://localhost:5000/api/admin/courses'),
                    fetch('http://localhost:5000/api/admin/users'),
                    fetch('http://localhost:5000/api/admin/quizzes')
                ]);

                if (!statsRes.ok || !coursesRes.ok || !usersRes.ok || !quizzesRes.ok) 
                    throw new Error('Failed to fetch data');

                const statsData = await statsRes.json();
                const coursesData = await coursesRes.json();
                const usersData = await usersRes.json();
                const quizzesData = await quizzesRes.json();

                setStats(statsData || { totalStudents: 0, activeNow: 0, completionRate: 0, atRisk: 0, activeCourses: 0 });
                setCourses(Array.isArray(coursesData) ? coursesData : []);
                setUsers(Array.isArray(usersData) ? usersData : []);
                setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                // Keep existing state instead of clearing if it's already populated
                if (!stats) {
                    setStats({ totalStudents: 0, activeNow: 0, completionRate: 0, atRisk: 0, activeCourses: 0 });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (type, id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                let url = '';
                if (type === 'course') url = `http://localhost:5000/api/admin/courses/${id}`;
                if (type === 'user') url = `http://localhost:5000/api/admin/users/${id}`;
                if (type === 'quiz') url = `http://localhost:5000/api/admin/quizzes/${id}`;

                const res = await fetch(url, { method: 'DELETE' });
                if (res.ok) {
                    if (type === 'course') setCourses(courses.filter(c => c._id !== id));
                    if (type === 'user') setUsers(users.filter(u => u._id !== id));
                    if (type === 'quiz') setQuizzes(quizzes.filter(q => q._id !== id));
                }
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            let res;
            if (itemType === 'course') {
                const url = modalMode === 'add' 
                    ? 'http://localhost:5000/api/admin/courses'
                    : `http://localhost:5000/api/admin/courses/${currentItem._id}`;
                
                res = await fetch(url, {
                    method: modalMode === 'add' ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else if (itemType === 'user') {
                const url = modalMode === 'add'
                    ? 'http://localhost:5000/api/admin/users'
                    : `http://localhost:5000/api/admin/users/${currentItem._id}`;

                res = await fetch(url, {
                    method: modalMode === 'add' ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else if (itemType === 'quiz') {
                const url = modalMode === 'add'
                    ? 'http://localhost:5000/api/admin/quizzes'
                    : `http://localhost:5000/api/admin/quizzes/${currentItem._id}`;

                res = await fetch(url, {
                    method: modalMode === 'add' ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Server error: ${res.status}`);
            }

            const savedItem = await res.json();
            
            if (itemType === 'course') {
                if (modalMode === 'add') setCourses([...courses, savedItem]);
                else setCourses(courses.map(c => c._id === savedItem._id ? savedItem : c));
            } else if (itemType === 'user') {
                 if (modalMode === 'add') setUsers([...users, savedItem]);
                 else setUsers(users.map(u => u._id === savedItem._id ? savedItem : u));
            } else if (itemType === 'quiz') {
                 if (modalMode === 'add') setQuizzes([...quizzes, savedItem]);
                 else setQuizzes(quizzes.map(q => q._id === savedItem._id ? savedItem : q));
            }

            setIsModalOpen(false);
            alert(`${itemType} ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);

        } catch (error) {
            console.error("Error saving item:", error);
            alert(`Failed to save ${itemType}: ${error.message}`);
        }
    };

    const openModal = (type, item = null) => {
        setItemType(type);
        setCurrentItem(item);
        setModalMode(item ? 'edit' : 'add');
        setIsModalOpen(true);
    };

    if (loading) return <div className="loading-spinner">Loading Admin Console...</div>;

    return (
        <div className="admin-container-pro">
            {/* Professional Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-orb-sm" style={{background: 'var(--accent)'}}>
                        <Shield size={20} color="white" />
                    </div>
                    <span>Admin</span>
                </div>

                <div className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <Activity size={18} /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
                        <Database size={18} /> Courses Library
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={18} /> User Management
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
                        <Zap size={18} /> Assessments
                    </button>
                    <div className="nav-divider"></div>
                    <button className="admin-nav-item">
                        <Settings size={18} /> Settings
                    </button>
                </div>

                <div className="admin-user-profile">
                    <div className="admin-avatar">A</div>
                    <div className="admin-info">
                        <h4>Administrator</h4>
                        <p>Super User</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <div className="header-title">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p className="breadcrumb">Admin / {activeTab}</p>
                    </div>
                    <div className="header-actions">
                        <div className="admin-search">
                            <Search size={16} />
                            <input type="text" placeholder="Search..." />
                        </div>
                        
                        {/* Notification Bell with Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                className="icon-btn-circle" 
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ position: 'relative' }}
                            >
                                <Bell size={18} />
                                {notifications.length > 0 && (
                                    <span style={{
                                        position: 'absolute', top: 0, right: 0,
                                        width: '10px', height: '10px',
                                        background: '#ef4444', borderRadius: '50%',
                                        border: '2px solid var(--background)'
                                    }}></span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <div className="notification-dropdown animate-slide-up" style={{
                                    position: 'absolute', top: '120%', right: 0,
                                    width: '300px', background: 'var(--surface)',
                                    border: '1px solid var(--border)', borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)', zIndex: 100,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
                                        Notifications
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div key={notif.id} style={{
                                                    padding: '1rem', borderBottom: '1px solid var(--border)',
                                                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                                    background: 'rgba(99, 102, 241, 0.05)'
                                                }}>
                                                    <div style={{ 
                                                        minWidth: '32px', height: '32px', borderRadius: '50%', 
                                                        background: 'var(--primary)', display: 'flex', 
                                                        alignItems: 'center', justifyContent: 'center', color: 'white'
                                                    }}>
                                                        <Users size={14} />
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{notif.message}</p>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {/* Dynamic Content */}
                    {activeTab === 'overview' && (
                        <div className="animate-slide-up">
                            {/* Summary Cards */}
                            <div className="stats-grid-pro">
                                <StatCardPro icon={<Users size={24} />} label="Total Students" value={stats?.totalStudents} trend="+12%" color="indigo" />
                                <StatCardPro icon={<Activity size={24} />} label="Active Sessions" value={stats?.activeNow} trend="+5%" color="emerald" />
                                <StatCardPro icon={<CheckCircle size={24} />} label="Success Rate" value={`${stats?.completionRate}%`} trend="+2%" color="blue" />
                                <StatCardPro icon={<AlertTriangle size={24} />} label="At Risk" value={stats?.atRisk} trend="-1%" color="rose" />
                            </div>

                            {/* Main Charts */}
                            <div className="charts-row">
                                <div className="chart-card-pro span-2">
                                    <div className="card-header">
                                        <h3>Platform Growth</h3>
                                        <button className="btn-icon-sm"><MoreHorizontal size={16}/></button>
                                    </div>
                                    <div className="chart-area-wrapper">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <AreaChart data={activeStudentsData}>
                                                <defs>
                                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px'}} />
                                                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="chart-card-pro">
                                    <div className="card-header">
                                        <h3>Completion Status</h3>
                                    </div>
                                    <div className="chart-area-wrapper">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={completionData} innerRadius={70} outerRadius={90} dataKey="value" paddingAngle={5}>
                                                    {completionData.map((entry, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="chart-legend-center">
                                            <span className="legend-value">{stats?.completionRate}%</span>
                                            <span className="legend-label">Avg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div className="table-card-pro animate-slide-up">
                            <div className="table-header">
                                <h3>All Courses</h3>
                                <button className="btn-primary-sm" onClick={() => openModal('course')}><Plus size={16} /> Add Course</button>
                            </div>
                             <table className="table-pro">
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Instructor</th>
                                        <th>Students</th>
                                        <th>Rating</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course._id || course.id}>
                                            <td>
                                                <div className="cell-flex">
                                                    <div className="table-icon bg-indigo"><Book size={16}/></div>
                                                    <span className="font-medium">{course.title}</span>
                                                </div>
                                            </td>
                                            <td>{course.instructor}</td>
                                            <td>{course.students}</td>
                                            <td>
                                                <span className="badge-rating">★ {course.rating}</span>
                                            </td>
                                            <td><span className="status-badge active">{course.status || 'Active'}</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-action edit" onClick={() => openModal('course', course)}><Edit2 size={14}/></button>
                                                    <button className="btn-action delete" onClick={() => handleDelete('course', course._id || course.id)}><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="table-card-pro animate-slide-up">
                            <div className="table-header">
                                <h3>Platform Users</h3>
                                <div className="table-actions">
                                    <button className="btn-primary-sm" onClick={() => openModal('user')}><Plus size={16} /> Add User</button>
                                    <button className="btn-icon-outline"><Filter size={16}/></button>
                                    <button className="btn-icon-outline"><Download size={16}/></button>
                                </div>
                            </div>
                             <table className="table-pro">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Last Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id || user.id}>
                                            <td>
                                                <div className="cell-flex">
                                                    <div className="user-avatar-sm">{user.name.charAt(0)}</div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sub">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                            <td><span className={`status-badge ${user.status?.toLowerCase() || 'active'}`}>{user.status || 'Active'}</span></td>
                                            <td>2 hours ago</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-action edit" onClick={() => openModal('user', user)}><Edit2 size={14}/></button>
                                                    <button className="btn-action delete" onClick={() => handleDelete('user', user._id || user.id)}><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {activeTab === 'quizzes' && (
                        <div className="table-card-pro animate-slide-up">
                            <div className="table-header">
                                <h3>Quiz Management</h3>
                                <button className="btn-primary-sm" onClick={() => openModal('quiz')}><Plus size={16} /> Add Quiz</button>
                            </div>
                             <table className="table-pro">
                                <thead>
                                    <tr>
                                        <th>Quiz Title</th>
                                        <th>Course</th>
                                        <th>Questions</th>
                                        <th>Completions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizzes.map(quiz => (
                                        <tr key={quiz._id || quiz.id}>
                                            <td><span className="font-medium">{quiz.title}</span></td>
                                            <td>{quiz.category || 'General'}</td>
                                            <td>
                                                <div className="limit-chip">
                                                    <Zap size={14} /> {quiz.questionCount || 5} Questions
                                                </div>
                                            </td>
                                            <td>{quiz.completions || 0}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-action edit" onClick={() => openModal('quiz', quiz)}><Edit2 size={14}/></button>
                                                    <button className="btn-action delete" onClick={() => handleDelete('quiz', quiz._id || quiz.id)}><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal remains similar but styled professionally */}
             {isModalOpen && (
                <div className="modal-overlay-premium">
                    <form 
                        key={`${itemType}-${currentItem?._id || 'new'}-${modalMode}`} 
                        onSubmit={handleSave} 
                        className="modal-card-attractive animate-fade-in"
                        style={{ padding: 0, overflow: 'hidden', border: 'none' }}
                    >
                        <div className="modal-banner-accent">
                            <div className="modal-title-group">
                                <span className="modal-subtitle">Management Console</span>
                                <h2>{modalMode === 'add' ? 'Create New' : 'Refine'} {itemType}</h2>
                            </div>
                            <button type="button" className="btn-close-glass" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="modal-body-custom" style={{ padding: '2.5rem' }}>
                            <div className="modal-form-grid">
                            {itemType === 'course' && (
                                <>
                                    <div className="form-group-custom">
                                        <label>Course Title</label>
                                        <div className="input-wrapper-custom">
                                            <Book size={18} />
                                            <input name="title" defaultValue={currentItem?.title} required placeholder="e.g., Advanced React" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Instructor Name</label>
                                        <div className="input-wrapper-custom">
                                            <Users size={18} />
                                            <input name="instructor" defaultValue={currentItem?.instructor} required placeholder="e.g., Dr. Smith" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Initial Students</label>
                                        <div className="input-wrapper-custom">
                                            <Activity size={18} />
                                            <input name="students" type="number" defaultValue={currentItem?.students || 0} />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Course Status</label>
                                        <select name="status" defaultValue={currentItem?.status || 'Active'} className="select-custom">
                                            <option value="Active">Operational / Active</option>
                                            <option value="Draft">Design Phase / Draft</option>
                                            <option value="Archived">Archived / Legacy</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            {itemType === 'user' && (
                                <>
                                    <div className="form-group-custom">
                                        <label>User Full Identity</label>
                                        <div className="input-wrapper-custom">
                                            <Users size={18} />
                                            <input name="name" defaultValue={currentItem?.name} required placeholder="Full name of the user" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Communication Email</label>
                                        <div className="input-wrapper-custom">
                                            <Mail size={18} />
                                            <input name="email" type="email" defaultValue={currentItem?.email} required placeholder="user@platform.com" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Platform Privileges</label>
                                        <select name="role" defaultValue={currentItem?.role || 'student'} className="select-custom">
                                            <option value="student">Knowledge Seeker (Student)</option>
                                            <option value="admin">Platform Guardian (Admin)</option>
                                            <option value="instructor">Content Curator (Instructor)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                             {itemType === 'quiz' && (
                                <>
                                    <div className="form-group-custom full-width">
                                        <label>Assessment Title</label>
                                        <div className="input-wrapper-custom">
                                            <Zap size={18} />
                                            <input name="title" defaultValue={currentItem?.title} required placeholder="e.g. Logic Mastery Quiz" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Domain / Technology</label>
                                        <div className="input-wrapper-custom">
                                            <Database size={18} />
                                            <input name="category" defaultValue={currentItem?.category || currentItem?.relatedSkill?.name} required placeholder="e.g. AI, React, UI Design" />
                                        </div>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Cognitive Difficulty</label>
                                        <select name="difficulty" defaultValue={currentItem?.difficulty || 'Beginner'} className="select-custom">
                                            <option value="Beginner">Fundamental (Beginner)</option>
                                            <option value="Intermediate">Competent (Intermediate)</option>
                                            <option value="Advanced">Master (Advanced)</option>
                                        </select>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>Point Allocation</label>
                                        <div className="input-wrapper-custom">
                                            <Activity size={18} />
                                            <input name="points" type="number" defaultValue={currentItem?.points || 100} required />
                                        </div>
                                    </div>
                                     <div className="form-group-custom">
                                        <label>Question Limit</label>
                                        <div className="input-wrapper-custom">
                                            <List size={18} />
                                            <input name="questionCount" type="number" defaultValue={currentItem?.questionCount || 5} required />
                                        </div>
                                    </div>
                                     <div className="form-group-custom">
                                        <label>Estimated Duration</label>
                                        <div className="input-wrapper-custom">
                                            <Zap size={18} />
                                            <input name="duration" defaultValue={currentItem?.duration || '15 mins'} placeholder="e.g. 15 mins" />
                                        </div>
                                    </div>
                                </>
                            )}
                            </div>
                            <div className="modal-footer-custom" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn-cancel-flat" onClick={() => setIsModalOpen(false)}>Dismiss</button>
                                <button type="submit" className="btn-save-glow" style={{ margin: 0 }}>
                                    Confirm Changes <CheckCircle size={18} style={{ marginLeft: '8px' }} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const StatCardPro = ({ icon, label, value, trend, color }) => (
    <div className="stat-card-pro">
        <div className="stat-header">
            <div className={`stat-icon-box bg-${color}`}>{icon}</div>
            <span className={`stat-trend ${trend.includes('+') ? 'positive' : 'negative'}`}>{trend}</span>
        </div>
        <div className="stat-body">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

export default AdminDashboard;
