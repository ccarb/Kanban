"""kanban URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from checklist import views as clViews
from board import views as bViews

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/checklists/$', clViews.checklists),
    re_path(r'^api/checklists/([0-9]{1,})$', clViews.checklist),
    re_path(r'^api/checklists/([0-9]{1,})/items/$', clViews.checklistItems),
    re_path(r'^api/checklists/item/([0-9]{1,})$',clViews.checklistItem),
    re_path(r'^api/kanban/([0-9]{1,})$',bViews.kanban),
    re_path(r'^api/boards/$',bViews.boards),
    re_path(r'^api/boards/([0-9]{1,})$', bViews.board),
    re_path(r'^api/boards/([0-9]{1,})/columns$',bViews.columns),
    re_path(r'^api/boards/columns/([0-9]{1,})$',bViews.column),
    re_path(r'^api/boards/columns/([0-9]{1,})/cards$',bViews.cards),
    re_path(r'^api/boards/columns/cards/([0-9]{1,})$',bViews.card)
    
]
