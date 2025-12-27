from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Service, Customer, StaffProfile, Appointment, Bill, BillItem

User = get_user_model()


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class StaffProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = StaffProfile
        fields = ('id', 'user', 'bio', 'services')


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        """Prevent overlapping appointments for the same staff member."""
        start = data.get('start_datetime')
        service = data.get('service')
        staff = data.get('staff')

        if not start or not service:
            return data

        duration = service.duration_minutes
        end = start + timezone.timedelta(minutes=duration)

        if staff:
            overlapping = Appointment.objects.filter(
                staff=staff,
                status=Appointment.STATUS_SCHEDULED,
            ).filter(
                start_datetime__lt=end,
                end_datetime__gt=start,
            )
            # exclude current instance when updating
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)
            if overlapping.exists():
                raise serializers.ValidationError("Selected staff has another appointment during this time.")

        return data


class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = ('id', 'service', 'quantity', 'price', 'line_total')


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True)

    class Meta:
        model = Bill
        fields = ('id', 'customer', 'appointment', 'created_at', 'items', 'subtotal', 'tax', 'discount', 'total')
        read_only_fields = ('subtotal', 'total')

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = Bill.objects.create(**validated_data)
        for item in items_data:
            BillItem.objects.create(bill=bill, service=item['service'], quantity=item.get('quantity', 1), price=item.get('price', item['service'].price))
        bill.recalc()
        bill.save()
        return bill

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                BillItem.objects.create(bill=instance, service=item['service'], quantity=item.get('quantity', 1), price=item.get('price', item['service'].price))
        instance.recalc()
        instance.save()
        return instance
