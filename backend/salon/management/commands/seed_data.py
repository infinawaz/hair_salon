from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from salon.models import Service, Customer

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample services, customers and an admin/staff user.'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
            self.stdout.write(self.style.SUCCESS('Created superuser: admin'))

        if not User.objects.filter(username='staff').exists():
            staff = User.objects.create_user('staff', 'staff@example.com', 'staffpass')
            staff.is_staff = True
            staff.save()
            self.stdout.write(self.style.SUCCESS('Created staff user: staff'))

        services = [
            {'name': 'Haircut', 'description': 'Standard haircut', 'price': 25.00, 'duration_minutes': 30},
            {'name': 'Shampoo & Style', 'description': 'Wash and style', 'price': 35.00, 'duration_minutes': 45},
            {'name': 'Coloring', 'description': 'Full color service', 'price': 75.00, 'duration_minutes': 90},
        ]
        for s in services:
            Service.objects.get_or_create(name=s['name'], defaults={
                'description': s['description'], 'price': s['price'], 'duration_minutes': s['duration_minutes']
            })

        Customer.objects.get_or_create(first_name='Jane', last_name='Doe', defaults={'email': 'jane@example.com', 'phone': '555-0101'})

        self.stdout.write(self.style.SUCCESS('Seed data created.'))
