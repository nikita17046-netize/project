const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    avatar: { type: String },
    joinedAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    difficulty: { type: Number, min: 1, max: 10 },
    content: { type: String }
});

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    masteryPercentage: { type: Number, default: 0 },
    status: { type: String, enum: ['locked', 'in-progress', 'completed'], default: 'locked' },
    lastAccessed: { type: Date, default: Date.now }
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    relatedSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    relatedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Link to course for "Go to Course" button
    category: { type: String }, // specific technology or field
    questions: [{
        questionText: String,
        options: [String],
        correctOption: Number,
        difficulty: Number
    }],
    difficulty: { type: String }, // Removed enum to allow Beginner/Easy flexibility
    points: { type: Number, default: 100 },
    duration: { type: String, default: '10 min' }
});

const QuizAttemptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number },
    timeSpent: { type: Number }, // in seconds
    feedback: { type: String },
    attemptedAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    students: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Skill: mongoose.model('Skill', SkillSchema),
    Progress: mongoose.model('Progress', ProgressSchema),
    Quiz: mongoose.model('Quiz', QuizSchema),
    QuizAttempt: mongoose.model('QuizAttempt', QuizAttemptSchema),
    Course: mongoose.model('Course', CourseSchema)
};
