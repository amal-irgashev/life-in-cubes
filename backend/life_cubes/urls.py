from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    TagViewSet,
    EventViewSet,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    DashboardView,
    register,
    logout
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'events', EventViewSet, basename='event')

# API URL patterns
urlpatterns = [
    # Auth endpoints
    path('api/v1/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/register/', register, name='register'),
    path('api/v1/auth/logout/', logout, name='logout'),
    
    # Dashboard endpoint
    path('api/v1/dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # API endpoints
    path('api/v1/', include((router.urls, 'api_v1'))),
] 