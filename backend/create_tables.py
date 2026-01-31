from database.session import engine
from database.base import Base

import models.user
import models.study_plan
import models.progress
import models.plan_progress
import models.saved_content

Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully")
