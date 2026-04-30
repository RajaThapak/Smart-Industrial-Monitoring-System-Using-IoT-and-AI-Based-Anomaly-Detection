from django.urls import path

from .views import auth_status, get_predictions, login_user, logout_user, predict_anomaly, register_user

urlpatterns = [
    path("api/auth/register/", register_user, name="register"),
    path("api/auth/login/", login_user, name="login"),
    path("api/auth/logout/", logout_user, name="logout"),
    path("api/auth/status/", auth_status, name="auth-status"),
    path("api/predict/", predict_anomaly, name="predict"),
    path("api/predictions/", get_predictions, name="predictions"),
]