const mongoose = require('mongoose');
require('dotenv').config();
const { User, Skill, Progress, Quiz } = require('./models/Schemas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🌱 Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Skill.deleteMany({});
        await Progress.deleteMany({});
        await Quiz.deleteMany({});

        // 1. Create Skills with Dependencies
        const html = await Skill.create({ name: 'HTML Basics', category: 'Frontend', difficulty: 2 });
        const css = await Skill.create({ name: 'CSS Fundamentals', category: 'Frontend', difficulty: 3, dependencies: [html._id] });
        const js = await Skill.create({ name: 'JavaScript Core', category: 'Language', difficulty: 5, dependencies: [css._id] });
        const react = await Skill.create({ name: 'React Development', category: 'Framework', difficulty: 7, dependencies: [js._id] });
        const node = await Skill.create({ name: 'Node.js Backend', category: 'Backend', difficulty: 8, dependencies: [js._id] });

        console.log('✅ Skills created');

        // 2. Create a Mock User
        const user = await User.create({
            name: 'Aryan Sharma',
            email: 'aryan@example.com',
            password: 'hashed_password_123', // In real app, use bcrypt
            role: 'student',
            skillLevel: 'Intermediate'
        });

        console.log('✅ Mock User created');

        // 3. Create Quizzes
        await Quiz.create({
            title: 'JavaScript Fundamentals Quiz',
            relatedSkill: js._id,
            difficulty: 'medium',
            questions: [
                {
                    questionText: 'What is the use of "let" keyword?',
                    options: ['Block scoped variable', 'Global variable', 'Constant', 'Function'],
                    correctOption: 0,
                    difficulty: 3
                }
            ]
        });

        // 4. Create Initial Progress for Student
        await Progress.create([
            { user: user._id, skill: html._id, masteryPercentage: 100, status: 'completed' },
            { user: user._id, skill: css._id, masteryPercentage: 85, status: 'completed' },
            { user: user._id, skill: js._id, masteryPercentage: 45, status: 'in-progress' },
            { user: user._id, skill: react._id, masteryPercentage: 0, status: 'locked' },
            { user: user._id, skill: node._id, masteryPercentage: 0, status: 'locked' }
        ]);

        console.log('✅ Progress seeded');
        console.log('🚀 Seeding complete! Check MongoDB Compass.');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
