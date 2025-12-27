from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Service, Customer, StaffProfile, Appointment, Bill
from .serializers import (
    ServiceSerializer,
    CustomerSerializer,
    StaffProfileSerializer,
    AppointmentSerializer,
    BillSerializer,
)
from .permissions import IsAdmin, IsStaffOrReadOnly

User = get_user_model()


class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    # Services can be listed publicly; creation/modification requires staff
    permission_classes = [IsStaffOrReadOnly]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    # Customer management requires staff (or admin)
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]


class StaffProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StaffProfile.objects.select_related('user').all()
    serializer_class = StaffProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    # Customers and staff can create appointments; must be authenticated
    permission_classes = [permissions.IsAuthenticated]


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.prefetch_related('items').all()
    serializer_class = BillSerializer
    # Billing actions should be limited to staff/admin
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    @action(detail=True, methods=['post'])
    def recalc(self, request, pk=None):
        bill = self.get_object()
        bill.recalc()
        bill.save()
        return Response(self.get_serializer(bill).data)

    @action(detail=True, methods=['get'])
    def invoice(self, request, pk=None):
        """Return a simple HTML invoice for printing/downloading."""
        bill = self.get_object()
        items = bill.items.all()
        lines = [f"<tr><td>{it.service.name}</td><td>{it.quantity}</td><td>{it.price}</td><td>{it.line_total}</td></tr>" for it in items]
        html = f"""
        <html><body>
        <h1>Invoice #{bill.id}</h1>
        <p>Customer: {bill.customer}</p>
        <p>Date: {bill.created_at}</p>
        <table border='1' cellpadding='6' cellspacing='0'>
        <thead><tr><th>Service</th><th>Qty</th><th>Price</th><th>Line</th></tr></thead>
        <tbody>{''.join(lines)}</tbody>
        <tfoot>
        <tr><td colspan='3'>Subtotal</td><td>{bill.subtotal}</td></tr>
        <tr><td colspan='3'>Tax</td><td>{bill.tax}</td></tr>
        <tr><td colspan='3'>Discount</td><td>{bill.discount}</td></tr>
        <tr><td colspan='3'><strong>Total</strong></td><td><strong>{bill.total}</strong></td></tr>
        </tfoot>
        </table>
        </body></html>
        """
        return Response({'html': html}, content_type='text/html')


from rest_framework.views import APIView
from django.db.models import Sum
from django.utils import timezone


class ReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # daily sales for last 30 days
        today = timezone.now().date()
        thirty = today - timezone.timedelta(days=30)
        bills = Bill.objects.filter(created_at__date__gte=thirty)
        daily = bills.extra({'day': "date(created_at)"}).values('day').annotate(total=Sum('total')).order_by('day')

        # monthly sales for last 12 months
        one_year = today - timezone.timedelta(days=365)
        monthly = Bill.objects.filter(created_at__date__gte=one_year).extra({'month': "strftime('%%Y-%%m', created_at)"}).values('month').annotate(total=Sum('total')).order_by('month')

        return Response({'daily': list(daily), 'monthly': list(monthly)})
