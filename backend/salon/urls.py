from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, CustomerViewSet, StaffProfileViewSet, AppointmentViewSet, BillViewSet, ReportsView

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'staff', StaffProfileViewSet, basename='staff')
router.register(r'appointments', AppointmentViewSet)
router.register(r'bills', BillViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reports/', ReportsView.as_view(), name='reports'),
]
