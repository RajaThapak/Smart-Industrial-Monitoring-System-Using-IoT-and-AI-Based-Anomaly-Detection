import pandas as pd
import random
from datetime import datetime, timedelta

data = []
current_time = datetime.now()

for _ in range(500):   # 500 rows
    row = {
        "timestamp": current_time.strftime("%H:%M:%S"),
        "temperature": random.randint(30, 70),
        "pressure": random.randint(20, 40),
        "vibration": round(random.uniform(0.1, 0.5), 2),
        "rpm": random.randint(1000, 2000)
    }
    
    data.append(row)
    current_time += timedelta(seconds=5)

df = pd.DataFrame(data)
df.to_csv("data.csv", index=False)