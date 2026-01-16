from database.session import engine
from database.base import Base

import models.user
import models.study_plan
import models.progress

Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully")
