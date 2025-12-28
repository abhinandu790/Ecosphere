from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from accounts.views import EmailTokenObtainPairView, ProfileView, RegisterView
from ecoactions.views import EcoActionViewSet, ImpactSummaryView, ReceiptUploadView, ReminderViewSet
from community.views import CommunityEventViewSet, LeaderboardView
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r'actions', EcoActionViewSet, basename='actions')
router.register(r'reminders', ReminderViewSet, basename='reminders')
router.register(r'events', CommunityEventViewSet, basename='events')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', ProfileView.as_view(), name='profile'),
    path('api/uploads/receipt/', ReceiptUploadView.as_view(), name='receipt-upload'),
    path('api/leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('api/impact/', ImpactSummaryView.as_view(), name='impact-summary'),
    path('api/', include(router.urls)),
]
