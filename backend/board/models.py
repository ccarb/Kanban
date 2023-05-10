from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _

class Card(models.Model):
     name = models.CharField("Name", max_length=80)
     description = models.CharField("Description", max_length=240,blank=True)
     created = models.DateField("Created",auto_now_add=True)
     dueDate = models.DateField("DueDate",blank=True,null=True)
     cover = models.ImageField("Cover",blank=True,null=True)
     order = models.IntegerField("Order", validators=[MinValueValidator(0),MaxValueValidator(101)])
     column = models.ForeignKey("Column", on_delete=models.CASCADE)

class Column(models.Model):
    class ColType(models.TextChoices):
          ARCHIVE = 'A', _('Archive')
          BACKLOG = 'B', _('Backlog')
          NORMAL = 'N', _('Normal')
    name = models.CharField("Name", max_length=80)
    created = models.DateField("Created", auto_now_add=True)
    colType = models.CharField("Type",max_length=1,choices=ColType.choices,default=ColType.NORMAL)
    order = models.IntegerField("Order", validators=[MinValueValidator(0),MaxValueValidator(11)])
    board = models.ForeignKey("Board", on_delete=models.CASCADE)

class Board(models.Model):
     name = models.CharField("Name", max_length=80)
     created = models.DateField("Created", auto_now_add=True)
    # TODO user foreign key