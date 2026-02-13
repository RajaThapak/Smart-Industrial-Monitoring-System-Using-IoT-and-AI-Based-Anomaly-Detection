# Overview

This project focuses on building an IoT-based real-time anomaly detection system for industrial machines. The goal is to identify unusual machine behavior—such as abnormal vibrations, temperature spikes, or irregular motor sounds—before they lead to breakdowns. This helps in predictive maintenance, reduces downtime, and improves machine lifespan.

# Working Principle

Multiple IoT sensors (vibration, temperature, current, and sound) continuously collect live machine data. The data is processed and sent to an AI model—specifically a Decision Tree Classifier—which compares the incoming sensor readings with normal patterns.

If the readings deviate significantly, the system marks the machine state as anomalous and triggers alerts.

The system works in three steps:

1.Data Collection: Real-time sensor data from the machine.

2.AI Processing: ML model classifies the state as Normal or Anomalous.

3.Action: Warning alert, machine status dashboard, or automatic shutdown (optional).

# Key Features

. Real-time monitoring of machine health

. AI-based anomaly detection instead of fixed IF–ELSE rules

. Early fault identification and predictive maintenance

. IoT dashboard for live visualization

. Reduces machine downtime and repair costs

# Technologies Used

. IoT: ESP32, Vibration sensor (ADXL345/MPU6050), Temperature sensor, Sound sensor

. AI Model: Decision Tree Classifier

. Software: Python, MQTT/HTTP, Flask/Firebase (optional)

# Applications

. Manufacturing industries

. Motors & pumps

. CNC machines

. Fans, compressors, turbines

. Any system with predictable operation patterns