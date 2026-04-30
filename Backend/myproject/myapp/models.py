from django.db import models

# myapp/models.py
from django.db import models

class PredictionHistory(models.Model):
    """Store prediction history for analytics"""
    
    # Sensor readings
    temperature = models.FloatField()
    vibration = models.FloatField()
    rpm = models.IntegerField()
    pressure = models.FloatField()
    
    # Prediction results
    prediction = models.IntegerField()  # 1 or -1
    label = models.CharField(
        max_length=10, 
        choices=[('Normal', 'Normal'), ('Anomaly', 'Anomaly')]
    )
    anomaly_score = models.FloatField(default=0.0)  # 0-1, higher = more anomalous
    
    # Metadata
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.label} at {self.timestamp}"
    
    class Meta:
        ordering = ['-timestamp']
