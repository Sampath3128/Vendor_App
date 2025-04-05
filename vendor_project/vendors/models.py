from django.db import models

class Organization(models.Model):
    organization_id = models.AutoField(primary_key=True)
    organization_name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.organization_name


class Vendor(models.Model):
    vendor_id = models.AutoField(primary_key=True)
    vendor_name = models.CharField(max_length=255)
    vendor_address = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    mobile_number = models.CharField(max_length=20, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    status = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.vendor_name


class VendorRole(models.Model):
    vendor_role_id = models.AutoField(primary_key=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='roles')
    role = models.CharField(max_length=50)  # e.g., 'Admin', 'Approver', 'Editor'
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.username} - {self.role}"


class Bank(models.Model):
    bank_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    bank_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    branch = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.bank_name


class MSP(models.Model):
    mspid = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    msp_name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=100, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.msp_name


class ComplianceRecord(models.Model):
    compliance_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    compliance_type = models.CharField(max_length=100)
    status = models.CharField(max_length=50, null=True, blank=True)
    review_date = models.DateField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.compliance_type} - {self.vendor.vendor_name}"
