from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import BillItem, Bill


@receiver(post_save, sender=BillItem)
def on_billitem_saved(sender, instance, created, **kwargs):
    # Recalculate the parent bill whenever items change
    bill = instance.bill
    bill.recalc()
    bill.save()


@receiver(post_delete, sender=BillItem)
def on_billitem_deleted(sender, instance, **kwargs):
    bill = instance.bill
    bill.recalc()
    bill.save()
