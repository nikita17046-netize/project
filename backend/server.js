const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const { User, Skill, Progress, Quiz, QuizAttempt, Course } = require('./models/Schemas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB (ALME Database)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: role || 'student' });

        // Seed initial progress for new student users
        if (user.role === 'student') {
            const skills = await Skill.find();
            if (skills.length > 0) {
                const progressData = skills.map(skill => ({
                    user: user._id,
                    skill: skill._id,
                    status: skill.dependencies.length === 0 ? 'in-progress' : 'locked'
                }));
                await Progress.insertMany(progressData);
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 0. Demo Mock Route (Gets first student)
app.get('/api/student/dashboard/mock', async (req, res) => {
    try {
        const user = await User.findOne({ role: 'student' });
        if (!user) return res.status(404).json({ error: 'No student found. Please run seed script.' });

        const progress = await Progress.find({ user: user._id }).populate('skill');
        const completedSkillIds = progress.filter(p => p.status === 'completed').map(p => p.skill._id.toString());
        const nextRecommended = progress.find(p =>
            p.status === 'locked' &&
            p.skill.dependencies.every(dep => completedSkillIds.includes(dep.toString()))
        );

        res.json({
            user,
            progress,
            recommendation: nextRecommended ? nextRecommended.skill.name : 'Mastery Achieved!',
            overallCompletion: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100),
            weakSpot: "JS Loops",
            forecast: "April 2026",
            progressOverTime: [
                { date: '12 Feb', p: 10 }, { date: '14 Feb', p: 15 }, { date: '16 Feb', p: 22 }, { date: '18 Feb', p: 35 }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Get Student Dashboard Data
app.get('/api/quiz/mock', async (req, res) => {
    try {
        const quiz = await Quiz.findOne().populate('relatedSkill');
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/student/:userId/dashboard', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const progress = await Progress.find({ user: userId }).populate('skill');
        const attempts = await QuizAttempt.find({ user: userId }).populate({
            path: 'quiz',
            populate: { path: 'relatedSkill' }
        });

        // 1. Calculate Weak Spot (Lowest scoring skill)
        let weakSpot = "None detected";
        if (attempts.length > 0) {
            const skillScores = {};
            attempts.forEach(att => {
                const skillName = att.quiz.relatedSkill?.name || "General";
                if (!skillScores[skillName]) skillScores[skillName] = { total: 0, count: 0 };
                skillScores[skillName].total += att.score;
                skillScores[skillName].count += 1;
            });
            const averages = Object.keys(skillScores).map(name => ({
                name,
                avg: skillScores[name].total / skillScores[name].count
            }));
            const lowest = averages.reduce((prev, curr) => prev.avg < curr.avg ? prev : curr);
            if (lowest.avg < 60) weakSpot = lowest.name;
        }

        // 2. Identify Next Recommended Skill
        const completedSkillIds = progress.filter(p => p.status === 'completed').map(p => p.skill._id.toString());
        const nextRecommended = progress.find(p =>
            p.status === 'locked' &&
            p.skill.dependencies.every(dep => completedSkillIds.includes(dep.toString()))
        );

        // 3. Mock Progress Over Time (for chart)
        const progressOverTime = [
            { date: '12 Feb', p: 10 },
            { date: '14 Feb', p: 18 },
            { date: '16 Feb', p: 25 },
            { date: '18 Feb', p: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100) || 30 }
        ];

        // 4. Forecast Logic
        const completionRate = progress.filter(p => p.status === 'completed').length;
        const forecastDate = completionRate > 0 ? "April 2026" : "May 2026";

        res.json({
            user,
            progress,
            recommendation: nextRecommended ? nextRecommended.skill.name : 'Mastery Achieved!',
            overallCompletion: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100),
            weakSpot,
            forecast: forecastDate,
            progressOverTime
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Submit Quiz (Rule Engine Integration)
app.post('/api/quiz/submit', async (req, res) => {
    const { userId, quizId, score, timeSpent } = req.body;

    // AI Rule Engine Implementation:
    // Admin defined: Score < 50 -> Remedial, Score > 80 -> Fast track
    let feedback = "";
    if (score < 50) {
        feedback = "Our AI suggests revisiting the fundamentals of this topic. Remedial content unlocked.";
    } else if (score >= 80) {
        feedback = "Excellent! You've mastered this topic. Fast-tracking the next module.";
    } else {
        feedback = "Good progress. Keep practicing.";
    }

    const attempt = await QuizAttempt.create({ user: userId, quiz: quizId, score, timeSpent, feedback });
    res.json({ success: true, feedback, attempt });
});

// 3. Admin: Platform Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const atRisk = await QuizAttempt.countDocuments({ score: { $lt: 50 } }); // Simple proxy for at-risk
        const activeCourses = await Course.countDocuments({ status: 'Active' });

        res.json({
            totalStudents,
            activeNow: Math.floor(totalStudents * 0.15), // Mock live sessions
            completionRate: 72.4, // Simplified
            atRisk,
            activeCourses
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN MANAGEMENT ROUTES ---

// COURSES
app.get('/api/admin/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/courses', async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/courses/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// USERS
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// QUIZZES
app.get('/api/admin/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('relatedSkill');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/quizzes/:id', async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedQuiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Quiz
app.post('/api/admin/quizzes', async (req, res) => {
    try {
        const { title, category, difficulty, points } = req.body;
        
        // Generate default questions if none provided (since Admin UI doesn't support adding questions yet)
        const defaultQuestions = [
            {
                questionText: `What is a key feature of ${category || 'this topic'}?`,
                options: ["Scalability", "Low Performance", "Complexity", "Rigidity"],
                correctOption: 0,
                explanation: "Scalability is a core advantage."
            },
            {
                questionText: "Which of the following is NOT a best practice?",
                options: ["Clean Code", "Spaghetti Code", "Modular Design", "Testing"],
                correctOption: 1,
                explanation: "Spaghetti code is hard to maintain."
            },
            {
                questionText: "What is the primary purpose of this technology?",
                options: ["Data Processing", "UI Rendering", "Problem Solving", "All of the above"],
                correctOption: 3,
                explanation: "It serves multiple purposes effectively."
            },
             {
                questionText: "In which scenario would you use this?",
                options: ["Real-time apps", "Static sites", "Batch processing", "None"],
                correctOption: 0,
                explanation: "It excels in real-time scenarios."
            },
            {
                questionText: "What is the complexity level?",
                options: ["O(1)", "O(n)", "O(n^2)", "Varies"],
                correctOption: 3,
                explanation: "It depends on the implementation."
            }
        ];

        const quiz = new Quiz({
            title,
            category,
            difficulty,
            points,
            questions: defaultQuestions // Auto-populate
        });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error("Error creating quiz:", err);
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/admin/quizzes/:id', async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quiz deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
