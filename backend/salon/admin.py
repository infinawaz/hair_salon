from django.contrib import admin
from .models import Service, Customer, StaffProfile, Appointment, Bill, BillItem


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "duration_minutes", "active")
    list_filter = ("active",)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "phone", "created_at")


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    filter_horizontal = ("services",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("id", "service", "customer", "staff", "start_datetime", "status")
    list_filter = ("status",)


class BillItemInline(admin.TabularInline):
    model = BillItem
    extra = 0


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "created_at", "total")
    inlines = [BillItemInline]
