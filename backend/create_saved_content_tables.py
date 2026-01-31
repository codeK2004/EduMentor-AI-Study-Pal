from database.session import engine
from database.base import Base
from sqlalchemy import text

# Import only the saved content models
import models.saved_content

def create_saved_content_tables():
    """Create only the saved content tables"""
    try:
        # Create tables for saved content models only
        from models.saved_content import SavedQuiz, SavedResource, SavedExplanation, UserNote
        
        # Create tables individually
        SavedQuiz.__table__.create(bind=engine, checkfirst=True)
        SavedResource.__table__.create(bind=engine, checkfirst=True)
        SavedExplanation.__table__.create(bind=engine, checkfirst=True)
        UserNote.__table__.create(bind=engine, checkfirst=True)
        
        print("✅ Saved content tables created successfully")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        # Try alternative approach with raw SQL
        try:
            with engine.connect() as conn:
                # Create saved_quizzes table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS saved_quizzes (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        topic VARCHAR NOT NULL,
                        questions JSON NOT NULL,
                        score INTEGER NOT NULL,
                        total_questions INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """))
                
                # Create saved_resources table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS saved_resources (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        title VARCHAR NOT NULL,
                        url VARCHAR NOT NULL,
                        description TEXT,
                        category VARCHAR DEFAULT 'General',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """))
                
                # Create saved_explanations table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS saved_explanations (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        topic VARCHAR NOT NULL,
                        question TEXT NOT NULL,
                        explanation TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """))
                
                # Create user_notes table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS user_notes (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        title VARCHAR NOT NULL,
                        content TEXT NOT NULL,
                        category VARCHAR DEFAULT 'General',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """))
                
                conn.commit()
                print("✅ Saved content tables created successfully using raw SQL")
                
        except Exception as e2:
            print(f"❌ Failed with raw SQL too: {e2}")

if __name__ == "__main__":
    create_saved_content_tables()