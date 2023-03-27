from django.db import models

class Card(models.Model):
     name = models.CharField("Name", max_length=80)
     description = models.CharField("Description", max_length=240,blank=True)
     created = models.DateField("Created",auto_now_add=True)
     dueDate = models.DateField("DueDate",blank=True,null=True)
     cover = models.ImageField("Cover",blank=True,null=True)
     order = models.IntegerField("Order")
     column = models.ForeignKey("Column", on_delete=models.CASCADE) # TODO on delete mover to default column

class Column(models.Model):
     name = models.CharField("Name", max_length=80)
     created = models.DateField("Created", auto_now_add=True)
     order = models.IntegerField("Order")
     board = models.ForeignKey("Board", on_delete=models.CASCADE)

class Board(models.Model):
     name = models.CharField("Name", max_length=80)
     created = models.DateField("Created", auto_now_add=True)
    # TODO user foreign key