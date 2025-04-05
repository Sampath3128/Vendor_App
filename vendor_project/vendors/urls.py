from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('snowflake/', views.snowflake_data, name='snowflake_data'),
    path('all/', views.get_all_vendors, name='get_all_vendors'),
]