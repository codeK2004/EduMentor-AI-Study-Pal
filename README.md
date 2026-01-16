# 🎓 EduMentor AI - Let's Plan and Study Together

<div align="center">

![EduMentor AI](https://img.shields.io/badge/EduMentor-AI%20Powered-6366f1?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)

**Your intelligent learning companion that creates personalized study plans, generates interactive quizzes, and provides instant explanations to accelerate your learning journey.**

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📱 Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🎯 **Smart Study Planner**
- **AI-Generated Plans**: Personalized study schedules based on your subject and focus areas
- **Flexible Duration**: Choose from 3 days to 1 month study plans
- **Interactive Tasks**: Check off completed tasks and track daily progress
- **Progress Visualization**: Beautiful progress bars and completion statistics

### 🧠 **Interactive Quiz System**
- **Dynamic Questions**: AI-generated multiple-choice questions on any topic
- **Instant Feedback**: Detailed explanations for each answer
- **Progress Integration**: Quiz completion automatically updates your study progress
- **Smart Scoring**: 60% pass rate with encouraging feedback

### 🤖 **AI Explain**
- **Simple Explanations**: Complex topics broken down into easy-to-understand language
- **Examples & Analogies**: Real-world examples to reinforce learning
- **Instant Responses**: Get explanations in seconds, not minutes

### 📚 **Learning Resources**
- **Curated Content**: AI-suggested videos, articles, and documentation
- **Subject-Specific**: Tailored resources for your exact learning needs
- **Organized Format**: Clean categorization by resource type

### 📝 **Smart Notes**
- **Organized Storage**: Save and categorize your study notes
- **Subject Grouping**: Automatic organization by subject and topic
- **Quick Access**: Find your notes instantly when you need them

### 📊 **Progress Dashboard**
- **Visual Analytics**: Beautiful charts and progress indicators
- **Achievement Tracking**: Monitor your learning milestones
- **Completion Stats**: See exactly how far you've come

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **PostgreSQL** database server

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd EduMentor-AI
```

### 2. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE edumentor_db;"
psql -U postgres -c "CREATE USER edumentor_user WITH PASSWORD 'edumentor_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE edumentor_db TO edumentor_user;"
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create database tables
python create_tables.py

# Start the server
uvicorn main:app --reload
```
🌐 Backend runs at: **http://127.0.0.1:8000**

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
🌐 Frontend runs at: **http://localhost:5173**

### 5. Start Learning! 🎉
1. Open http://localhost:5173
2. Create your account
3. Generate your first study plan
4. Take quizzes and track progress

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** - Modern UI framework
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Framer Motion** - Smooth animations
- **📊 Recharts** - Beautiful data visualization
- **🌐 Axios** - HTTP client with interceptors

### Backend
- **🚀 FastAPI** - High-performance Python web framework
- **🤖 Google Gemini AI** - Advanced AI text generation
- **🗄️ PostgreSQL** - Robust relational database
- **🔐 JWT Authentication** - Secure user sessions
- **🛡️ Argon2** - Industry-standard password hashing

### DevOps & Tools
- **🐍 Uvicorn** - ASGI server for production
- **📦 SQLAlchemy** - Python ORM
- **🔧 Pydantic** - Data validation and serialization

---

## 📱 Screenshots

### 🔐 Beautiful Authentication
<div align="center">
<img src="https://via.placeholder.com/800x500/6366f1/ffffff?text=Login+Page" alt="Login Page" width="400"/>
<img src="https://via.placeholder.com/800x500/10b981/ffffff?text=Signup+Page" alt="Signup Page" width="400"/>
</div>

*Stunning gradient backgrounds with glassmorphism design*

### 🏠 Modern Dashboard
<div align="center">
<img src="https://via.placeholder.com/800x500/f59e0b/ffffff?text=Home+Dashboard" alt="Dashboard" width="600"/>
</div>

*Clean, intuitive interface with feature cards and statistics*

### 📅 Smart Planner
<div align="center">
<img src="https://via.placeholder.com/800x500/8b5cf6/ffffff?text=Study+Planner" alt="Study Planner" width="600"/>
</div>

*AI-generated study plans with interactive task completion*

---

## 🎨 Design Features

### 🌈 **Modern UI/UX**
- **Gradient Backgrounds**: Beautiful color transitions
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### 🎯 **User Experience**
- **Intuitive Navigation**: Clear sidebar with active states
- **Loading States**: Elegant spinners and progress indicators
- **Error Handling**: Friendly error messages with helpful icons
- **Accessibility**: Keyboard navigation and screen reader support

### 🚀 **Performance**
- **Optimized Animations**: GPU-accelerated transforms
- **Lazy Loading**: Components load when needed
- **Efficient API Calls**: Automatic token management
- **Fast Builds**: Vite for lightning-fast development

---

## 🔧 Configuration

### Environment Variables
Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://edumentor_user:edumentor_pass@localhost:5432/edumentor_db
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### API Endpoints
- **Authentication**: `/auth/login`, `/auth/signup`
- **Study Plans**: `/study/plan`, `/study/plans`
- **Quizzes**: `/quiz/generate`
- **Progress**: `/progress/`, `/progress/complete-day`
- **AI Features**: `/explain/`, `/resources/`
- **Notes**: `/notes/`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful text generation
- **React Team** for the amazing framework
- **FastAPI** for the incredible Python web framework
- **Framer Motion** for beautiful animations
- **All contributors** who help make this project better

---

<div align="center">

**Made with ❤️ by the EduMentor AI Team**

[⭐ Star this repo](https://github.com/your-username/edumentor-ai) • [🐛 Report Bug](https://github.com/your-username/edumentor-ai/issues) • [💡 Request Feature](https://github.com/your-username/edumentor-ai/issues)

</div>