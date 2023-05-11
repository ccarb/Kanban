from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext_lazy as _

class Card(models.Model):
     MAX_CARDS_PER_COLUMN = 100
     MIN_ORDER=0
     MAX_ORDER=99
     name = models.CharField("Name", max_length=80)
     description = models.CharField("Description", max_length=240,blank=True)
     created = models.DateField("Created",auto_now_add=True)
     dueDate = models.DateField("DueDate",blank=True,null=True)
     cover = models.ImageField("Cover",blank=True,null=True,upload_to='card_covers')
     order = models.IntegerField("Order", validators=[MinValueValidator(MIN_ORDER),MaxValueValidator(MAX_ORDER)])
     column = models.ForeignKey("Column", on_delete=models.CASCADE)

class Column(models.Model):
    MAX_COLUMNS_PER_BOARD = 12
    MIN_ORDER = 0
    MAX_ORDER = 11
    class ColType(models.TextChoices):
          ARCHIVE = 'A', _('Archive')
          BACKLOG = 'B', _('Backlog')
          NORMAL = 'N', _('Normal')
    name = models.CharField("Name", max_length=80)
    created = models.DateField("Created", auto_now_add=True)
    colType = models.CharField("Type",max_length=1,choices=ColType.choices,default=ColType.NORMAL)
    order = models.IntegerField("Order", validators=[MinValueValidator(MIN_ORDER),MaxValueValidator(MAX_ORDER)])
    board = models.ForeignKey("Board", on_delete=models.CASCADE)

class Board(models.Model):
     name = models.CharField("Name", max_length=80)
     created = models.DateField("Created", auto_now_add=True)
    # TODO user foreign key