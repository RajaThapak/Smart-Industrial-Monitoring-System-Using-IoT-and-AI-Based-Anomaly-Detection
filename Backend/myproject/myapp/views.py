from django.shortcuts import render

# myapp/views.py
import joblib
import json
import pickle
import numpy as np
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .models import PredictionHistory  # Optional - for database

@csrf_exempt
@require_http_methods(["POST"])
def predict_anomaly(request):
    """
    API endpoint that receives sensor data and returns anomaly prediction
    
    FLOW:
    1. Receive JSON from phone
    2. Validate data
    3. Load trained ML model
    4. Make prediction
    5. Save to database (optional)
    6. Return response
    """
    
    try:
        # STEP 1: Parse incoming JSON from phone
        print("📱 Received request from phone...")
        data = json.loads(request.body)
        
        # Extract sensor values
        temperature = float(data.get('temperature'))
        vibration = float(data.get('vibration'))
        rpm = float(data.get('rpm'))
        pressure = float(data.get('pressure'))
        
        print(f"📊 Sensor values: Temp={temperature}, Vib={vibration}, RPM={rpm}, Press={pressure}")
        
        # STEP 2: Validate data
        if any(v is None for v in [temperature, vibration, rpm, pressure]):
            return JsonResponse({
                'status': 'error',
                'message': 'Missing required fields'
            }, status=400)
        
        # STEP 3: Load pre-trained ML model
        print("🤖 Loading trained ML model...")
        try:
            # Load the model saved from your notebook
            model = joblib.load(r"e:\Mini_Project\Backend\ml_model\model.pkl")
            print("✓ Model loaded successfully")
        except FileNotFoundError:
            return JsonResponse({
                'status': 'error',
                'message': 'ML model not found. Train and save model first.'
            }, status=500)
        
        # STEP 4: Prepare data in same format as training
        # Must match Cell 4 format: ['temperature', 'vibration', 'rpm', 'pressure']
        features = np.array([[temperature, vibration, rpm, pressure]])
        print(f"🔍 Features shape: {features.shape}")
        
        # STEP 5: Make prediction using ML model (Like Cell 6)
        print("🎯 Running model prediction...")
        prediction = model.predict(features)[0]  # Returns: 1 (Normal) or -1 (Anomaly)
        
        # Convert to readable label
        label = "Normal" if prediction == 1 else "Anomaly"
        confidence = "High" if abs(prediction) == 1 else "Medium"
        
        print(f"📈 Prediction: {label} (Raw: {prediction})")
        
        # STEP 6: (Optional) Save to database
        PredictionHistory.objects.create(
            temperature=temperature,
            vibration=vibration,
            rpm=rpm,
            pressure=pressure,
            prediction=prediction,
            label=label,
            timestamp=datetime.now()
        )
        
        # STEP 7: Return response to phone
        response_data = {
            'status': 'success',
            'temperature': temperature,
            'vibration': vibration,
            'rpm': rpm,
            'pressure': pressure,
            'prediction': int(prediction),
            'label': label,
            'confidence': confidence,
            'message': f'Reading is {label}',
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"✅ Sending response: {response_data}")
        return JsonResponse(response_data)
    
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON format'
        }, status=400)
    
    except ValueError as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Invalid data type: {str(e)}'
        }, status=400)
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
