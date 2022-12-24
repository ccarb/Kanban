from django.db import models

class Checklist(models.Model):
    name = models.CharField("Name", max_length=80)
    description = models.CharField("Description",max_length=240)
    created = models.DateField("Created",auto_now_add=True)
    
    def __str__(self):
        return self.name

class ChecklistItem(models.Model):
    checklistId = models.ForeignKey(Checklist,on_delete=models.CASCADE)
    name = models.CharField("Name", max_length=80)
    done = models.BooleanField("Done")
    order = models.IntegerField("Order",auto_created=True,)

    def __str__(self):
        return self.name