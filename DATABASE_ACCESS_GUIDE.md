# 🗄️ EduMentor AI - Database Storage Guide

## 📍 **Where Data is Stored**

### **Database Type:** PostgreSQL
### **Database Name:** `edumentor_db`
### **Host:** `localhost:5432`
### **User:** `edumentor_user`
### **Password:** `edumentor_pass`

---

## 🏗️ **Database Tables Structure**

### **1. User Management**
```sql
-- Users table
users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    hashed_password VARCHAR,
    created_at TIMESTAMP
)
```

### **2. Study Plans**
```sql
-- Study plans created by users
study_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR,
    duration_days INTEGER,
    plan_content TEXT,
    created_at TIMESTAMP
)
```

### **3. Progress Tracking**
```sql
-- User progress on study plans
user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    study_plan_id INTEGER REFERENCES study_plans(id),
    total_days INTEGER,
    completed_days INTEGER,
    completed_day_numbers TEXT, -- JSON array of completed days
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### **4. Saved Content System**
```sql
-- Saved quiz results
saved_quizzes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic VARCHAR,
    questions JSON, -- Full quiz data
    score INTEGER,
    total_questions INTEGER,
    created_at TIMESTAMP
)

-- Saved learning resources
saved_resources (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    url VARCHAR,
    description TEXT,
    category VARCHAR DEFAULT 'General',
    created_at TIMESTAMP
)

-- Saved AI explanations
saved_explanations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic VARCHAR,
    question TEXT,
    explanation TEXT,
    created_at TIMESTAMP
)

-- User personal notes
user_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    content TEXT,
    category VARCHAR DEFAULT 'General',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

---

## 🔍 **How to Access and View Data**

### **Method 1: Using psql Command Line**

1. **Connect to Database:**
```bash
psql -h localhost -p 5432 -U edumentor_user -d edumentor_db
# Enter password: edumentor_pass
```

2. **View All Tables:**
```sql
\dt
```

3. **View Table Structure:**
```sql
\d users
\d study_plans
\d saved_quizzes
```

4. **Query Data Examples:**
```sql
-- See all users
SELECT id, username, email, created_at FROM users;

-- See all study plans
SELECT id, user_id, subject, duration_days, created_at FROM study_plans;

-- See saved quizzes with scores
SELECT id, user_id, topic, score, total_questions, created_at FROM saved_quizzes;

-- See saved resources
SELECT id, user_id, title, url, category, created_at FROM saved_resources;

-- See user progress
SELECT id, user_id, study_plan_id, completed_days, total_days FROM user_progress;
```

### **Method 2: Using pgAdmin (GUI Tool)**

1. **Install pgAdmin:** https://www.pgadmin.org/download/
2. **Connect with these settings:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `edumentor_db`
   - Username: `edumentor_user`
   - Password: `edumentor_pass`

3. **Navigate:** Servers → PostgreSQL → Databases → edumentor_db → Schemas → public → Tables

### **Method 3: Using Database Browser Tools**

**DBeaver (Free):**
1. Download: https://dbeaver.io/download/
2. Create new PostgreSQL connection
3. Use the connection details above

**TablePlus (Mac):**
1. Download: https://tableplus.com/
2. Create PostgreSQL connection
3. Use the connection details above

---

## 📊 **Sample Data Queries for Presentation**

### **Show User Activity:**
```sql
SELECT 
    u.username,
    COUNT(sp.id) as study_plans_created,
    COUNT(sq.id) as quizzes_taken,
    COUNT(sr.id) as resources_saved,
    COUNT(sn.id) as notes_created
FROM users u
LEFT JOIN study_plans sp ON u.id = sp.user_id
LEFT JOIN saved_quizzes sq ON u.id = sq.user_id
LEFT JOIN saved_resources sr ON u.id = sr.user_id
LEFT JOIN user_notes sn ON u.id = sn.user_id
GROUP BY u.id, u.username;
```

### **Show Recent Activity:**
```sql
-- Recent study plans
SELECT subject, duration_days, created_at 
FROM study_plans 
ORDER BY created_at DESC 
LIMIT 5;

-- Recent quiz scores
SELECT topic, score, total_questions, 
       ROUND((score::float/total_questions)*100, 1) as percentage,
       created_at
FROM saved_quizzes 
ORDER BY created_at DESC 
LIMIT 5;
```

### **Show Progress Statistics:**
```sql
-- Progress overview
SELECT 
    sp.subject,
    up.total_days,
    up.completed_days,
    ROUND((up.completed_days::float/up.total_days)*100, 1) as completion_percentage
FROM user_progress up
JOIN study_plans sp ON up.study_plan_id = sp.id
ORDER BY completion_percentage DESC;
```

---

## 🛠️ **Quick Database Access Commands**

### **Connect to Database:**
```bash
# From terminal
psql postgresql://edumentor_user:edumentor_pass@localhost:5432/edumentor_db
```

### **Useful Queries:**
```sql
-- Count all data
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM study_plans) as total_plans,
    (SELECT COUNT(*) FROM saved_quizzes) as total_quizzes,
    (SELECT COUNT(*) FROM saved_resources) as total_resources,
    (SELECT COUNT(*) FROM user_notes) as total_notes;

-- Show table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals
FROM pg_stats 
WHERE schemaname = 'public';
```

---

## 🎯 **For Your Presentation**

### **Demo Flow:**
1. **Show the app creating data** (register user, create plan, take quiz)
2. **Open database tool** (pgAdmin or DBeaver)
3. **Run queries** to show the data was stored
4. **Show relationships** between tables
5. **Demonstrate data persistence** (refresh app, data still there)

### **Key Points to Highlight:**
- ✅ **Persistent Storage:** All data survives app restarts
- ✅ **Relational Database:** Proper foreign key relationships
- ✅ **User Isolation:** Each user's data is separate
- ✅ **Rich Data Types:** JSON for complex data (quiz questions)
- ✅ **Timestamps:** Track when everything was created/updated
- ✅ **Scalable:** PostgreSQL can handle production loads

---

## 🔐 **Security Note**
The database credentials shown here are for development only. In production, use:
- Strong passwords
- Environment variables
- SSL connections
- Proper user permissions