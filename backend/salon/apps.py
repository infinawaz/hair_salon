from django.apps import AppConfig


class SalonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'salon'
    verbose_name = 'Salon Management'

    def ready(self):
        # import signal handlers
        try:
            from . import signals  # noqa: F401
        except Exception:
            pass
