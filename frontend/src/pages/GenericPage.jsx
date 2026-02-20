import React from 'react';
import { useParams } from 'react-router-dom';
import { Rocket, Globe, Zap, Users, Book, ArrowRight } from 'lucide-react';
import '../index.css';

const pageData = {
    enterprise: {
        title: "Enterprise Ecosystem",
        subtitle: "Scale learning across your global workforce.",
        icon: <Globe size={48} />,
        content: "Our enterprise solutions provide a comprehensive infrastructure for employee training, skill tracking, and performance analytics. Empower your teams with AI-driven learning paths tailored to your business goals.",
        stats: [
            { label: "Active Learners", value: "50k+" },
            { label: "Completion Rate", value: "94%" },
            { label: "ROI Increase", value: "3x" }
        ]
    },
    startups: {
        title: "Startup Accelerator",
        subtitle: "Rapid skill acquisition for high-growth teams.",
        icon: <Rocket size={48} />,
        content: "Speed is everything. Our accelerator program gives your startup team the technical edge they need to ship faster. Access curated crash courses on the latest tech stacks.",
        stats: [
            { label: "Startups Onboarded", value: "200+" },
            { label: "Time to Impact", value: "2 Weeks" },
            { label: "Courses Available", value: "150+" }
        ]
    },
    students: {
        title: "High-Performance Learning",
        subtitle: "Master complex domains with AI assistance.",
        icon: <Zap size={48} />,
        content: "Forget passive lectures. ALME's AI tutor adapts to your learning style, focusing on your weak spots and accelerating your mastery of complex topics.",
        stats: [
            { label: "Avg. Grade Improvement", value: "25%" },
            { label: "Hours Saved", value: "100+" },
            { label: "Student Success", value: "98%" }
        ]
    },
    mentors: {
        title: "Mentor Network",
        subtitle: "Monetize your expertise globally.",
        icon: <Users size={48} />,
        content: "Join our elite network of educators and industry experts. Share your knowledge through courses and live sessions, and earn competitive revenue shares.",
        stats: [
            { label: "Active Mentors", value: "500+" },
            { label: "Total Payouts", value: "$2M+" },
            { label: "Global Reach", value: "30 Countries" }
        ]
    },
    blog: {
        title: "ALME Insights",
        subtitle: "Latest updates and guides on AI learning.",
        icon: <Book size={48} />,
        content: "Stay ahead of the curve with our in-depth articles on the future of education, AI technology, and career development strategies.",
        stats: [
            { label: "Monthly Readers", value: "100k+" },
            { label: "Articles Published", value: "500+" },
            { label: "Guest Authors", value: "50+" }
        ]
    },
    community: {
        title: "Global Brain Trust",
        subtitle: "Connect with thousands of learners worldwide.",
        icon: <Users size={48} />,
        content: "Learning is better together. Join our vibrant community to collaborate on projects, get peer reviews, and network with like-minded individuals.",
        stats: [
            { label: "Community Members", value: "10k+" },
            { label: "Daily Messages", value: "50k+" },
            { label: "Projects Shipped", value: "1k+" }
        ]
    }
};

const GenericPage = () => {
    const { slug } = useParams();
    const data = pageData[slug] || {
        title: "Page Not Found",
        subtitle: "The content you are looking for does not exist.",
        icon: <FileQuestion size={48} />,
        content: "Please check the URL or return to the home page.",
        stats: []
    };

    return (
        <div className="generic-page-container" style={{paddingTop: '80px', minHeight: '100vh', background: 'var(--background)'}}>
            {/* Hero Section */}
            <section className="hero-section" style={{minHeight: '60vh', padding: '4rem 2rem'}}>
                <div className="hero-content" style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
                    <div className="visual-orb-container" style={{margin: '0 auto 2rem', width: '100px', height: '100px'}}>
                        <div className="visual-orb main" style={{width: '100%', height: '100%'}}>
                            {data.icon}
                        </div>
                    </div>
                    <h1>{data.title}</h1>
                    <p className="hero-subtitle">{data.subtitle}</p>
                </div>
            </section>

            {/* Conditional Content for Blog */}
            {slug === 'blog' && (
                <section className="blog-section" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                    <h2 style={{textAlign: 'center', marginBottom: '2rem', fontSize: '2rem'}}>Recent Articles</h2>
                    <div className="blog-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
                        {[
                            {
                                id: 1,
                                title: "The Rise of AI Tutors",
                                excerpt: "How personalized AI is reshaping the educational landscape for students worldwide.",
                                author: "Dr. Sarah Logic",
                                date: "Feb 18, 2026",
                                image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop&q=60"
                            },
                            {
                                id: 2,
                                title: "Mastering Full Stack in 2026",
                                excerpt: "Key technologies you need to know to stay competitive in the job market.",
                                author: "Prof. James Byte",
                                date: "Feb 15, 2026",
                                image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&auto=format&fit=crop&q=60"
                            },
                            {
                                id: 3,
                                title: "Neuroplasticity & Learning",
                                excerpt: "Scientific methods to optimize your brain for rapid skill acquisition.",
                                author: "Elena Flow",
                                date: "Feb 10, 2026",
                                image: "https://images.unsplash.com/photo-1559757606-23479297d881?w=500&auto=format&fit=crop&q=60"
                            }
                        ].map(post => (
                            <div key={post.id} className="blog-card glass" style={{borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s'}}>
                                <img src={post.image} alt={post.title} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                                <div className="blog-content" style={{padding: '1.5rem'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>
                                        <span>{post.author}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)'}}>{post.title}</h3>
                                    <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5'}}>{post.excerpt}</p>
                                    <div style={{marginTop: '1rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                                        Read More <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Rich Content for Solutions Pages */}
            {slug === 'enterprise' && (
                 <section className="solution-details" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                    <div className="features-grid">
                        <div className="feature-card glass">
                            <h3>Skill Gap Analysis</h3>
                            <p>AI identifies proficiency gaps across your tech teams and recommends targeted paths.</p>
                        </div>
                        <div className="feature-card glass">
                            <h3>Custom Onboarding</h3>
                            <p>Turn your internal documentation into interactive courses automatically.</p>
                        </div>
                         <div className="feature-card glass">
                            <h3>Manager Dashboards</h3>
                            <p>Track ROI and learning hours with granular reporting tools.</p>
                        </div>
                    </div>
                </section>
            )}

            {slug === 'startups' && (
                 <section className="solution-details" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                     <div style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(244, 63, 94, 0.1))', padding: '3rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                        <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>Build Faster, break things less.</h2>
                        <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto'}}>
                            Get access to our "CTO in a Box" curriculum. From System Design to Scalable databases.
                        </p>
                     </div>
                </section>
            )}
            
            {slug === 'students' && (
                 <section className="solution-details" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center'}}>
                        <div>
                            <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>Adaptive Intelligence</h2>
                            <p style={{marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)'}}>
                                Our engine learns how you learn. Visual learner? We show diagrams. Practical? We give code labs.
                            </p>
                            <ul style={{listStyle: 'none', space: '1rem'}}>
                                <li style={{marginBottom: '0.5rem'}}>✅ Dynamic Flashcards</li>
                                <li style={{marginBottom: '0.5rem'}}>✅ Spaced Repetition</li>
                                <li style={{marginBottom: '0.5rem'}}>✅ Code Sandboxes</li>
                            </ul>
                        </div>
                        <div className="glass" style={{height: '300px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Zap size={64} color="var(--accent)" />
                        </div>
                    </div>
                </section>
            )}

            {slug === 'mentors' && (
                 <section className="solution-details" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                    <div className="stats-container glass">
                        <div className="stat-item">
                            <h3>85%</h3>
                            <p>Revenue Share</p>
                        </div>
                        <div className="stat-separator"></div>
                        <div className="stat-item">
                            <h3>Global</h3>
                            <p>Audience Reach</p>
                        </div>
                         <div className="stat-separator"></div>
                        <div className="stat-item">
                            <h3>Zero</h3>
                            <p>Platform Fees</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Conditional Content for Community */}
            {slug === 'community' && (
                <section className="community-hub" style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                    
                    <div className="community-grid" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
                        {/* Discussion Forums */}
                        <div className="forum-section">
                            <h2 style={{marginBottom: '1.5rem'}}>Active Discussions</h2>
                            {[
                                { title: "Best resources for learning Rust?", author: "dev_guru", replies: 45, tag: "Programming" },
                                { title: "How I landed a job at Google in 6 months", author: "code_ninja", replies: 120, tag: "Career" },
                                { title: "AI ethics discussion: The alignment problem", author: "ai_researcher", replies: 89, tag: "AI/ML" },
                                { title: "Help with React useEffect dependency array", author: "frontend_newbie", replies: 12, tag: "Help" }
                            ].map((topic, i) => (
                                <div key={i} className="forum-card glass" style={{padding: '1.5rem', marginBottom: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <h4 style={{marginBottom: '0.5rem', fontSize: '1.1rem'}}>{topic.title}</h4>
                                        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                                            Posted by <span style={{color: 'var(--primary)'}}>{topic.author}</span> • <span style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px'}}>{topic.tag}</span>
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                                        <span style={{display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text)'}}>{topic.replies}</span>
                                        <span style={{fontSize: '0.8rem'}}>Replies</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar: Events & Top Contributors */}
                        <div className="community-sidebar">
                            <div className="glass" style={{padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem'}}>
                                <h3 style={{marginBottom: '1rem'}}>Upcoming Events</h3>
                                <div style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                                    <div style={{fontWeight: 'bold', color: 'var(--secondary)'}}>FEB 22</div>
                                    <div>Live Q&A with Dr. Logic</div>
                                </div>
                                <div>
                                    <div style={{fontWeight: 'bold', color: 'var(--secondary)'}}>FEB 25</div>
                                    <div>Hackathon: AI for Good</div>
                                </div>
                            </div>

                            <div className="glass" style={{padding: '1.5rem', borderRadius: '16px', textAlign: 'center'}}>
                                <h3 style={{marginBottom: '1rem'}}>Join the Server</h3>
                                <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Chat live with 10,000+ developers.</p>
                                <button className="btn-primary-lg" style={{width: '100%', justifyContent: 'center'}}>
                                    Join Discord <Users size={18} style={{marginLeft: '8px'}}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section className="features-section">
                <div className="feature-card glass" style={{maxWidth: '900px', margin: '0 auto', padding: '3rem'}}>
                    <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Overview</h3>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)'}}>
                        {data.content}
                    </p>

                    {/* Stats Grid */}
                    {data.stats.length > 0 && (
                        <div className="stats-grid" style={{marginTop: '3rem', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                            {data.stats.map((stat, index) => (
                                <div key={index} className="stat-card" style={{textAlign: 'center'}}>
                                    <h3 style={{fontSize: '2rem', color: 'var(--primary)'}}>{stat.value}</h3>
                                    <p>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default GenericPage;
