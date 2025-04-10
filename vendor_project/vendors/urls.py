from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('snowflake/', views.snowflake_data, name='snowflake_data'),
    path('all_vendors/', views.get_all_vendors, name='get_all_vendors'),
    path('all_orgs/', views.get_all_organizations, name='get_all_orgs'),
    path('register-vendor/', views.register_vendor, name='get_all_orgs'),
    path('login/', views.login_vendor, name='vendor_login'),
    path('vendor_info/<int:vendor_id>/', views.get_vendor_info, name='get_vendor_information'),
    path('vendor_info_update/<int:vendor_id>/', views.update_vendor, name='update_vendor_information'),
    path('bank-details/<int:vendor_id>/', views.get_bank_details, name='get_bank_details'),
    path('update-bank-details/<int:vendor_id>/', views.update_bank_details, name='update_bank_details'),
    path('vendor-msp-details/<int:vendor_id>/', views.get_vendor_msp_details, name='get_bank_details'),
    path('vendor_info_msp_update/<int:vendor_id>/',views.update_msp_details,name='update_msp_details'),
]