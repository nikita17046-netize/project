import React, { useState } from 'react';
import { BookOpen, Clock, PlayCircle, Trophy, Star, X } from 'lucide-react';

const MyCourses = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const courses = [
        {
            id: 1,
            title: "Advanced React Patterns",
            instructor: "Dr. Logic",
            progress: 75,
            lessons: 24,
            duration: "12h 30m",
            category: "Development",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk" // Sample React Video
        },
        {
            id: 2,
            title: "Full Stack Ecosystems",
            instructor: "Prof. Byte",
            progress: 30,
            lessons: 42,
            duration: "22h 15m",
            category: "Full Stack",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
            videoUrl: "https://www.youtube.com/embed/y663t6H670w" // Sample Full Stack Video
        },
        {
            id: 3,
            title: "AI & Neural Networks",
            instructor: "Neural AI",
            progress: 10,
            lessons: 15,
            duration: "8h 45m",
            category: "AI",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
            videoUrl: "https://www.youtube.com/embed/aircAruvnKk" // Sample AI Video
        }
    ];

    return (
        <div className="courses-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Academic Path 📚</h1>
                <p className="text-muted">Currently enrolled in {courses.length} ecosystem courses.</p>
            </header>

            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {courses.map(course => (
                    <div key={course.id} className="card course-card">
                        <div className="course-image" style={{ height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                            <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="category-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>{course.category}</div>
                            <div className="play-overlay" onClick={() => setSelectedVideo(course.videoUrl)}>
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>

                        <div className="course-info">
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem', fontWeight: 700 }}>{course.title}</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>By {course.instructor}</p>

                            <div className="progress-section" style={{ marginBottom: '1.5rem' }}>
                                <div className="progress-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <span>Course Progress</span>
                                    <span style={{ color: 'var(--primary)' }}>{course.progress}%</span>
                                </div>
                                <div className="p-bar-bg" style={{ height: '10px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div className="p-bar-fill" style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}></div>
                                </div>
                            </div>

                            <div className="course-meta" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {course.duration}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><PlayCircle size={16} /> {course.lessons} Lessons</span>
                            </div>

                            <button className="auth-btn" style={{ padding: '0.9rem', marginTop: 0 }} onClick={() => setSelectedVideo(course.videoUrl)}>
                                <PlayCircle size={18} /> Resume Learning
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
                    <div className="video-container animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button className="video-close" onClick={() => setSelectedVideo(null)}><X size={24} /></button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={selectedVideo}
                            title="Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <style jsx>{`
                .course-card { transition: all 0.3s ease; cursor: default; }
                .course-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
                .course-image { position: relative; }
                .play-overlay { 
                    position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
                    display: flex; align-items: center; justify-content: center; 
                    opacity: 0; transition: opacity 0.3s; cursor: pointer;
                }
                .course-image:hover .play-overlay { opacity: 1; }
                
                .video-modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.9);
                    z-index: 9999; display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(10px); padding: 2rem;
                }
                .video-container {
                    width: 100%; max-width: 1000px; aspect-ratio: 16/9;
                    background: black; border-radius: 20px; position: relative;
                    border: 1px solid var(--border); overflow: hidden;
                }
                .video-close {
                    position: absolute; top: 1.5rem; right: 1.5rem;
                    background: rgba(255,255,255,0.1); border: none; color: white;
                    width: 45px; height: 45px; border-radius: 50%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; z-index: 10;
                    transition: all 0.2s;
                }
                .video-close:hover { background: var(--accent); }
            `}</style>
        </div>
    );
};

export default MyCourses;
