from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('send-quotation', views.send_quotation, name='send_quotation'),
]