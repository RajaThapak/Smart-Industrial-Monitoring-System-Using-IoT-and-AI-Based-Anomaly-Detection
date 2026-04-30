import joblib
import json
import numpy as np
from django.contrib.auth import authenticate, get_user_model, login as auth_login, logout as auth_logout
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .models import PredictionHistory  # Optional - for database

User = get_user_model()


def _json_body(request):
    try:
        return json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return None


def _error(message, status=400, **extra):
    payload = {"status": "error", "message": message}
    payload.update(extra)
    return JsonResponse(payload, status=status)

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    data = _json_body(request)
    if data is None:
        return _error("Invalid JSON format")

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    confirm_password = data.get("confirmPassword") or data.get("confirm_password") or ""

    if not username or not email or not password:
        return _error("Username, email, and password are required")

    if password != confirm_password:
        return _error("Passwords do not match")

    if User.objects.filter(username=username).exists():
        return _error("Username already exists")

    if User.objects.filter(email=email).exists():
        return _error("Email already exists")

    try:
        validate_password(password)
    except Exception as exc:
        return _error("Password does not meet requirements", errors=[str(exc)])

    remember_me = bool(data.get("rememberMe") or data.get("remember_me"))

    user = User.objects.create_user(username=username, email=email, password=password)
    auth_login(request, user)
    request.session.set_expiry(60 * 60 * 24 * 30 if remember_me else 0)
    request.session.modified = True

    return JsonResponse(
        {
            "status": "success",
            "message": "Account created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    data = _json_body(request)
    if data is None:
        return _error("Invalid JSON format")

    identifier = (data.get("identifier") or data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        return _error("Username/email and password are required")

    user = None
    if "@" in identifier:
        user = User.objects.filter(email__iexact=identifier).first()
        if user:
            authenticated = authenticate(request, username=user.username, password=password)
        else:
            authenticated = None
    else:
        authenticated = authenticate(request, username=identifier, password=password)
        if authenticated is None:
            user = User.objects.filter(email__iexact=identifier).first()
            if user:
                authenticated = authenticate(request, username=user.username, password=password)

    if authenticated is None:
        return _error("Invalid username/email or password", status=401)

    remember_me = bool(data.get("rememberMe") or data.get("remember_me"))
    auth_login(request, authenticated)
    request.session.set_expiry(60 * 60 * 24 * 30 if remember_me else 0)
    request.session.modified = True
    return JsonResponse(
        {
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": authenticated.id,
                "username": authenticated.username,
                "email": authenticated.email,
            },
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def logout_user(request):
    auth_logout(request)
    return JsonResponse({"status": "success", "message": "Logged out successfully"})


@csrf_exempt
@require_http_methods(["GET"])
def auth_status(request):
    # Debug logging
    print(f"🔍 auth_status called")
    print(f"  User: {request.user}")
    print(f"  Authenticated: {request.user.is_authenticated}")
    print(f"  Session: {request.session.session_key}")
    print(f"  Session data: {dict(request.session)}")
    
    if request.user.is_authenticated:
        return JsonResponse(
            {
                "authenticated": True,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                },
            }
        )

    return JsonResponse({"authenticated": False})


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
        print(f"📈 Prediction: {label} (Raw: {prediction})")
        
        # STEP 5b: Calculate anomaly score (0-1)
        anomaly_scores = model.score_samples(features)
        # Normalize to 0-1 range (higher = more anomalous)
        anomaly_score = 1.0 / (1.0 + np.exp(-anomaly_scores[0]))
        
        print(f"🎯 Anomaly Score: {anomaly_score:.3f} ({'ANOMALY' if anomaly_score > 0.5 else 'NORMAL'})")
        
        # STEP 6: Save to database with score
        PredictionHistory.objects.create(
            temperature=temperature,
            vibration=vibration,
            rpm=rpm,
            pressure=pressure,
            prediction=prediction,
            label=label,
            anomaly_score=anomaly_score,
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
            'anomaly_score': float(anomaly_score),
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


@csrf_exempt
@require_http_methods(["GET"])
def get_predictions(request):
    """
    GET endpoint that returns historical prediction data
    Used by frontend to display real-time charts
    """
    try:
        # Get last 50 predictions from database
        predictions = PredictionHistory.objects.all().order_by('-timestamp')[:50]
        
        # Reverse to get chronological order (oldest first)
        predictions = list(reversed(predictions))
        
        # Convert to JSON-serializable format
        data = [
            {
                'temperature': p.temperature,
                'vibration': p.vibration,
                'rpm': p.rpm,
                'pressure': p.pressure,
                'prediction': p.prediction,
                'label': p.label,
                'anomaly_score': p.anomaly_score,
                'timestamp': p.timestamp.isoformat()
            }
            for p in predictions
        ]


        return JsonResponse(data, safe=False)
    except Exception as e:
        print(f"❌ Error fetching predictions: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
