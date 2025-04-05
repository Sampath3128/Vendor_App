from django.http import JsonResponse
from .models import Vendor
from .snowflake_connection import get_snowflake_connection


def get_vendors_from_snowflake(request):
    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT VendorID, VendorName, VendorAddress, Email, MobileNumber, Username, PasswordHash, Status FROM Vendors")
        rows = cursor.fetchall()

        vendors = []
        for row in rows:
            vendor = Vendor(
                vendor_id=row[0],
                vendor_name=row[1],
                vendor_address=row[2],
                email=row[3],
                mobile_number=row[4],
                username=row[5],
                password_hash=row[6],
                status=row[7]
            )
            vendors.append({
                "vendor_id": vendor.vendor_id,
                "vendor_name": vendor.vendor_name,
                "vendor_address": vendor.vendor_address,
                "email": vendor.email,
                "mobile_number": vendor.mobile_number,
                "username": vendor.username,
                "status": vendor.status
            })

        return JsonResponse(vendors, safe=False)

    finally:
        cursor.close()
        conn.close()