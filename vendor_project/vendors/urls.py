from django.urls import path
from pkg_resources.extern import names

from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('snowflake/', views.snowflake_data, name='snowflake_data'),
    path('all_vendors/', views.get_all_vendors, name='get_all_vendors'),
    path('all_orgs/', views.get_all_organizations, name='get_all_orgs'),
    path('register-vendor/', views.register_vendor, name='get_all_orgs'),
    path('login/', views.login_vendor, name='vendor_login'),
    path('vendor_info/<int:vendor_id>/', views.get_vendor_info, name='get_vendor_information')
]