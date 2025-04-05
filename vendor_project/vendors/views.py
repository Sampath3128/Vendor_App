from linecache import cache

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from vendors.snowflake_connection import get_snowflake_connection
from vendors.utils import get_vendors_from_snowflake
from datetime import datetime
import bcrypt
import json

def hello_world(request):
    return HttpResponse("Hello, World!")


def snowflake_data(request):
    conn = get_snowflake_connection()
    cur = conn.cursor()
    cur.execute("SELECT CURRENT_VERSION()")
    row = cur.fetchone()
    cur.close()
    conn.close()

    return JsonResponse({"snowflake_version": row[0]})

def get_all_vendors(request):
    try:
        return get_vendors_from_snowflake(request)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def register_vendor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            conn = get_snowflake_connection()
            cursor = conn.cursor()

            insert_query = """
                INSERT INTO VENDORS (
                    VENDORNAME, VENDORADDRESS, EMAIL, MOBILENUMBER, USERNAME, PASSWORDHASH, STATUS, CREATEDAT, UPDATEDAT, OrganizationID
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            now = datetime.utcnow()

            hashed_password = hash_password(data.get('password'))

            values = (
                data.get('vendorName'),
                data.get('vendorAddress'),
                data.get('email'),
                data.get('mobileNumber'),
                data.get('username'),
                hashed_password,
                'Active',
                now,
                now,
                int(data.get('org_id'))
            )

            cursor.execute(insert_query, values)
            conn.commit()
            cursor.close()
            conn.close()

            return JsonResponse({'message': 'Vendor registered successfully', 'status': 200}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': 201}, status=400)

    return JsonResponse({'error': 'Invalid request method', 'status': 201}, status=405)

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def get_all_organizations(request):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    if request.method == 'GET':
        try:
            cursor.execute(
                "SELECT OrganizationID, OrganizationName FROM Organizations")
            rows = cursor.fetchall()
            print(rows)
            orgs = []
            for row in rows:
                org = {
                    "organization_id" : row[0],
                    "organization_name" : row[1]
                }
                orgs.append(org)

            return JsonResponse(orgs, safe=False)
        finally:
            cursor.close()
            conn.close()

@csrf_exempt
def login_vendor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = data.get('username')
            input_password = data.get('password')
            org_id = int(data.get('orgCode'))
            role = data.get('role')

            conn = get_snowflake_connection()
            cursor = conn.cursor()

            query = """
                SELECT VendorID, USERNAME, PASSWORDHASH
                FROM VENDORS
                WHERE USERNAME = %s AND OrganizationID = %s
            """

            cursor.execute(query, (username, org_id))
            user_record = cursor.fetchone()

            cursor.close()
            conn.close()

            if user_record:
                vendor_id, db_username, db_password_hash = user_record

                # Check password
                if bcrypt.checkpw(input_password.encode('utf-8'), db_password_hash.encode('utf-8')):
                    return JsonResponse({
                        'message': 'Login successful',
                        'vendor_id': vendor_id,
                        'username': db_username,
                        'organization_id': org_id,
                        'role': role,
                        'status': 200
                    }, status=200)
                else:
                    return JsonResponse({'error': 'Invalid password', 'status': 201}, status=401)
            else:
                return JsonResponse({'error': 'User not found', 'status': 201}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': 201}, status=400)

    return JsonResponse({'error': 'Invalid request method', 'status': 201}, status=405)

@csrf_exempt
def get_vendor_info(request, vendor_id):
    if request.method == 'GET':
        try:
            conn = get_snowflake_connection()
            cursor = conn.cursor()

            query = "SELECT * FROM VENDORS WHERE VENDORID = %s"
            cursor.execute(query, (vendor_id,))
            result = cursor.fetchone()

            if not result:
                return JsonResponse({'error': 'Vendor not found'}, status=404)

            # Convert result to a dictionary if needed
            columns = [col[0] for col in cursor.description]
            vendor_info = dict(zip(columns, result))

            cursor.close()
            conn.close()

            return JsonResponse(vendor_info)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
