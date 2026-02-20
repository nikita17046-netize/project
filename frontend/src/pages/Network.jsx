import React from 'react';
import { Users, MessageSquare, ShieldCheck, Heart, Share2, Search, Send } from 'lucide-react';

const Network = () => {
    const [inputText, setInputText] = React.useState('');
    const [feeds, setFeeds] = React.useState([
        {
            id: 1,
            user: "Sarah Jenkins",
            role: "Senior Student",
            avatar: "SJ",
            content: "Just completed the Neural Network module! The visual path tree really helped me understand the dependencies. Anyone up for a study group session on React Hooks tomorrow? 🚀",
            likes: 24,
            comments: 8,
            time: "2h ago",
            topic: "#LearningPath",
            color: "#6366f1"
        },
        {
            id: 2,
            user: "Alex Chen",
            role: "Full Stack Learner",
            avatar: "AC",
            content: "The AI suggestions recommended 'Advanced Node Streams' based on my last quiz performance. Incredible how accurate the system is at identifying weak spots! @NeuralAI",
            likes: 42,
            comments: 15,
            time: "5h ago",
            topic: "#AISuggestions",
            color: "#0ea5e9"
        }
    ]);

    const handlePost = () => {
        if (!inputText.trim()) return;

        const newPost = {
            id: Date.now(),
            user: "You",
            role: "Student",
            avatar: "ME",
            content: inputText,
            likes: 0,
            comments: 0,
            time: "Just now",
            topic: "#General",
            color: "#10b981"
        };

        setFeeds([newPost, ...feeds]);
        setInputText('');
    };

    // Study Circle State
    const [joinedCircles, setJoinedCircles] = React.useState([]);

    React.useEffect(() => {
        const saved = localStorage.getItem('joinedCircles');
        if (saved) setJoinedCircles(JSON.parse(saved));
    }, []);

    const handleJoin = (circleName) => {
        let updatedCircles;
        if (joinedCircles.includes(circleName)) {
            updatedCircles = joinedCircles.filter(c => c !== circleName);
        } else {
            updatedCircles = [...joinedCircles, circleName];
            // Simulate Admin Notification Trigger (in a real app, this would be an API call)
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(`Notification sent to admin: ${user?.name} joined ${circleName}`);
        }
        setJoinedCircles(updatedCircles);
        localStorage.setItem('joinedCircles', JSON.stringify(updatedCircles));
    };

    return (
        <div className="network-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>Peer Learning Network 🌐</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Connect with 1,240 active research students in your ecosystem.</p>
                </div>
                <div className="search-bar-modern" style={{ position: 'relative', width: '350px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search researchers, topics..."
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                    />
                </div>
            </header>

            <div className="network-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 350px', gap: '2.5rem' }}>
                <div className="feed-section">
                    <div className="card share-card" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
                        <div style={{ display: 'flex', gap: '1.25rem' }}>
                            <div className="avatar" style={{ width: '50px', height: '50px', flexShrink: 0, background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>ME</div>
                            <div style={{ flex: 1 }}>
                                <textarea
                                    placeholder="What are you learning today?"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    style={{ width: '100%', minHeight: '100px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '1.1rem', resize: 'none' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <button className="auth-btn" onClick={handlePost} style={{ width: 'auto', padding: '0.6rem 2rem', marginTop: 0, cursor: 'pointer' }}>
                                        Post <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {feeds.map(post => (
                        <div key={post.id} className="card post-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                            <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div className="avatar" style={{ width: '50px', height: '50px', background: post.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{post.avatar}</div>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{post.user}</p>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{post.role} • {post.time}</p>
                                    </div>
                                </div>
                                <span className="topic-tag" style={{ color: post.color, background: `${post.color}15`, padding: '6px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}>{post.topic}</span>
                            </div>

                            <p style={{ marginBottom: '2rem', lineHeight: 1.7, fontSize: '1.1rem' }}>{post.content}</p>

                            <div className="post-actions" style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <button className="post-action-btn"><Heart size={20} /> {post.likes} Likes</button>
                                <button className="post-action-btn"><MessageSquare size={20} /> {post.comments} Comments</button>
                                <button className="post-action-btn"><Share2 size={20} /> Share</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sidebar-section">
                    <div className="card sticky-sidebar" style={{ position: 'sticky', top: 'var(--header-height)', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 800 }}>Study Circles 🔥</h3>
                        <div className="circle-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <StudyCircleItem 
                                name="JS Logic Masters" 
                                members="154" 
                                icon={<Users size={20} />} 
                                isJoined={joinedCircles.includes("JS Logic Masters")}
                                onToggle={() => handleJoin("JS Logic Masters")}
                            />
                            <StudyCircleItem 
                                name="Neural Network Hub" 
                                members="82" 
                                icon={<ShieldCheck size={20} />} 
                                isJoined={joinedCircles.includes("Neural Network Hub")}
                                onToggle={() => handleJoin("Neural Network Hub")}
                            />
                            <StudyCircleItem 
                                name="Full Stack Squad" 
                                members="210" 
                                icon={<Users size={20} />} 
                                isJoined={joinedCircles.includes("Full Stack Squad")}
                                onToggle={() => handleJoin("Full Stack Squad")}
                            />
                        </div>
                        <button className="primary-btn-sm" style={{ marginTop: '2rem', width: '100%', height: '50px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 700, transition: 'all 0.2s' }}>
                            Explore All Circles
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .post-card { transition: transform 0.3s; }
                .post-card:hover { transform: translateY(-4px); border-color: var(--primary); }
                .post-action-btn { 
                    display: flex; align-items: center; gap: 0.6rem; 
                    font-weight: 600; font-size: 0.95rem; color: var(--text-muted);
                    transition: all 0.2s;
                }
                .post-action-btn:hover { color: var(--primary); }
                .primary-btn-sm:hover { background: var(--surface); border-color: var(--primary); color: white; }
            `}</style>
        </div>
    );
};

const StudyCircleItem = ({ name, members, icon, isJoined, onToggle }) => (
    <div className="circle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid transparent', transition: 'all 0.2s' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '10px' }}>{icon}</div>
            <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{members} Researchers</p>
            </div>
        </div>
        <button 
            onClick={onToggle}
            style={{ 
                color: isJoined ? '#10b981' : 'var(--primary)', 
                fontWeight: 800, 
                fontSize: '0.85rem',
                border: isJoined ? '1px solid #10b981' : 'none',
                padding: isJoined ? '4px 12px' : '0',
                borderRadius: '6px',
                background: isJoined ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                cursor: 'pointer'
            }}
        >
            {isJoined ? 'Joined' : 'Join'}
        </button>
    </div>
);

export default Network;
