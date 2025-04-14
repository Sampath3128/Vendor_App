from linecache import cache

from OpenSSL.rand import status
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
            vendor_info.pop('PASSWORDHASH')

            cursor.close()
            conn.close()

            return JsonResponse(vendor_info)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime

@csrf_exempt
def create_vendor_change_request(request, vendor_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            conn = get_snowflake_connection()
            cursor = conn.cursor()

            now = datetime.utcnow()

            insert_query = """
                INSERT INTO VendorChangeRequests (
                    VendorID,
                    VendorName,
                    VendorAddress,
                    Email,
                    MobileNumber,
                    Username,
                    Status,
                    RequestStatus,
                    CreatedAt,
                    RequestedBy
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', %s, %s)
            """

            # Example: assume the logged-in user ID is passed via headers or session
            requested_by = vendor_id

            values = (
                int(vendor_id),
                data.get('vendorName'),
                data.get('vendorAddress'),
                data.get('email'),
                data.get('mobileNumber'),
                data.get('username'),
                data.get('status', 'Active'),  # Optional field
                now,
                int(requested_by)
            )

            cursor.execute(insert_query, values)
            conn.commit()

            cursor.close()
            conn.close()

            return JsonResponse({'message': 'Change request submitted to admin', 'status': 200}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': 500}, status=500)

    return JsonResponse({'error': 'Invalid request method', 'status': 405}, status=405)

@csrf_exempt
def update_vendor(request, vendor_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            conn = get_snowflake_connection()
            cursor = conn.cursor()

            update_query = """
                UPDATE VENDORS
                SET VENDORNAME = %s,
                    VENDORADDRESS = %s,
                    EMAIL = %s,
                    MOBILENUMBER = %s,
                    USERNAME = %s,
                    UPDATEDAT = %s
                WHERE VENDORID = %s
            """

            now = datetime.utcnow()

            values = (
                data.get('vendorName'),
                data.get('vendorAddress'),
                data.get('email'),
                data.get('mobileNumber'),
                data.get('username'),
                now,
                int(vendor_id)
            )

            cursor.execute(update_query, values)
            conn.commit()
            cursor.close()
            conn.close()

            return JsonResponse({'message': 'Vendor updated successfully', 'status': 200}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e), 'status': 201}, status=400)

    return JsonResponse({'error': 'Invalid request method', 'status': 201}, status=405)

@csrf_exempt
def get_bank_details(request, vendor_id):
    if request.method == 'GET':
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:
            query = f"""
                SELECT BankName, AccountNumber, AccountHolderName, IFSCCode, Branch
                FROM Banks
                WHERE VendorID = %s
                ORDER BY UpdatedAt DESC
                LIMIT 1
            """
            cursor.execute(query, (vendor_id,))
            row = cursor.fetchone()
            if row:
                response = {
                    'status': 200,
                    'bankName': row[0],
                    'accountNumber': row[1],
                    'accountHolderName': row[2],
                    'ifsccode': row[3],
                    'branchName': row[4],
                }
            else:
                response = {'status': 201, 'message': 'No data found'}
            return JsonResponse(response, safe=False)
        finally:
            cursor.close()
            conn.close()


@csrf_exempt
def create_bank_change_request(request, vendor_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        bank_name = data.get('bankName')
        account_number = data.get('accountNumber')
        account_holder_name = data.get('accountHolderName')
        ifsc_code = data.get('ifsccode')
        branch = data.get('branchName')

        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:
            # Check if vendor exists and get organization_id
            cursor.execute("SELECT OrganizationID FROM Vendors WHERE VendorID = %s", (vendor_id,))
            vendor_row = cursor.fetchone()
            if not vendor_row:
                return JsonResponse({'status': 404, 'message': 'Vendor not found'})

            organization_id = vendor_row[0]

            # Get the current user making the change
            requested_by = vendor_id

            # Check if a bank record exists for the vendor
            cursor.execute("SELECT COUNT(*) FROM Banks WHERE VendorID = %s", (vendor_id,))
            exists = cursor.fetchone()[0] > 0

            # If the bank record exists, prepare to submit a change request
            if exists:
                insert_query = """
                    INSERT INTO BankChangeRequests (
                        VendorID,
                        OrganizationID,
                        BankName,
                        AccountNumber,
                        AccountHolderName,
                        IFSCCode,
                        Branch,
                        RequestStatus,
                        RequestedBy,
                        CreatedAt
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', %s, CURRENT_TIMESTAMP)
                """
            else:
                # If no bank record exists, create a new change request
                insert_query = """
                    INSERT INTO BankChangeRequests (
                        VendorID,
                        OrganizationID,
                        BankName,
                        AccountNumber,
                        AccountHolderName,
                        IFSCCode,
                        Branch,
                        RequestStatus,
                        RequestedBy,
                        CreatedAt
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending', %s, CURRENT_TIMESTAMP)
                """

            # Insert the change request
            cursor.execute(insert_query, (
                vendor_id,
                organization_id,
                bank_name,
                account_number,
                account_holder_name,
                ifsc_code,
                branch,
                requested_by
            ))

            conn.commit()
            return JsonResponse({'status': 200, 'message': 'Bank change request submitted successfully'})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'status': 500, 'message': 'Internal server error while creating bank change request'})
        finally:
            cursor.close()
            conn.close()



@csrf_exempt
def update_bank_details(request, vendor_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        bank_name = data.get('bankName')
        account_number = data.get('accountNumber')
        account_holder_Name = data.get('accountHolderName')
        ifsc_code = data.get('ifsccode')
        branch = data.get('branchName')

        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:
            # Check if vendor exists and get organization_id
            cursor.execute("SELECT OrganizationID FROM Vendors WHERE VendorID = %s", (vendor_id,))
            vendor_row = cursor.fetchone()
            if not vendor_row:
                return JsonResponse({'status': 404, 'message': 'Vendor not found'})

            organization_id = vendor_row[0]

            # Check if bank record exists for the vendor
            cursor.execute("SELECT COUNT(*) FROM Banks WHERE VendorID = %s", (vendor_id,))
            exists = cursor.fetchone()[0] > 0

            if exists:
                # Update existing bank record
                update_query = """
                    UPDATE Banks
                    SET BankName = %s,
                        AccountNumber = %s,
                        AccountHolderName = %s,
                        IFSCCode = %s,
                        Branch = %s,
                        UpdatedAt = CURRENT_TIMESTAMP
                    WHERE VendorID = %s
                """
                cursor.execute(update_query, (bank_name, account_number, account_holder_Name, ifsc_code, branch, vendor_id))
            else:
                # Insert new bank record with organization_id from Vendors table
                insert_query = """
                    INSERT INTO Banks (OrganizationID, VendorID, BankName, AccountNumber, AccountHolderName, IFSCCode, Branch)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (organization_id, vendor_id, bank_name, account_number, account_holder_Name, ifsc_code, branch))

            conn.commit()
            return JsonResponse({'status': 200, 'message': 'Bank details updated successfully'})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'status': 500, 'message': 'Internal server error while updating bank details'})
        finally:
            cursor.close()
            conn.close()

@csrf_exempt
def get_vendor_msp_details(request, vendor_id):
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    try:
        if request.method == 'GET':
            query = f"""
                select mspid, mspname, contactemail, contactphone, status from MSPs where vendorid = %s
            """
            cursor.execute(query, (vendor_id,))
            row = cursor.fetchone()

            if row:
                response = {
                    'status': 200,
                    'mspid': row[0],
                    'mspname': row[1],
                    'contactemail': row[2],
                    'contactphone': row[3],
                    'mspstatus': row[4]
                }

                return JsonResponse(response, status=200)
            else:
                return JsonResponse({'message': "No MSP details found", 'status': 200}, status=200)
        else:
            return JsonResponse({'message': 'failure. Method not supported', 'status': 400}, status=200)
    except Exception as e:
        return JsonResponse({'message': 'Internal error occurred', 'status': 201}, status=400)
    finally:
        cursor.close()
        conn.close()


@csrf_exempt
def create_msp_change_request(request, vendor_id):
    if request.method == 'PUT':

        conn = get_snowflake_connection()
        cursor = conn.cursor()

        try:
            data = json.loads(request.body)
            msp_name = data.get('mspName')
            contact_email = data.get('contactemail')
            mobile_number = data.get('mobileNumber')

            # Get organization ID from vendor
            cursor.execute("SELECT OrganizationID FROM Vendors WHERE VendorID = %s", (vendor_id,))
            vendor_row = cursor.fetchone()
            if not vendor_row:
                return JsonResponse({'status': 404, 'message': 'Vendor not found'})

            organization_id = vendor_row[0]
            requested_by = vendor_id

            insert_query = """
                INSERT INTO MSPChangeRequests (
                    VendorID,
                    OrganizationID,
                    MSPName,
                    ContactEmail,
                    ContactPhone,
                    RequestStatus,
                    CreatedAt,
                    RequestedBy
                )
                VALUES (%s, %s, %s, %s, %s, 'Pending', CURRENT_TIMESTAMP, %s)
            """
            cursor.execute(insert_query, (
                vendor_id,
                organization_id,
                msp_name,
                contact_email,
                mobile_number,
                requested_by
            ))

            conn.commit()
            return JsonResponse({'status': 200, 'message': 'MSP change request submitted for approval'})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'status': 500, 'message': 'Internal server error while creating MSP change request'})
        finally:
            cursor.close()
            conn.close()


@csrf_exempt
def update_msp_details(request, vendor_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        msp_name = data.get('mspName')
        contact_email = data.get('contactemail')
        mobile_number = data.get('mobileNumber')
        
        

        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:
            # Check if vendor exists and get organization_id
            cursor.execute("SELECT OrganizationID FROM Vendors WHERE VendorID = %s", (vendor_id,))
            vendor_row = cursor.fetchone()
            if not vendor_row:
                return JsonResponse({'status': 404, 'message': 'Vendor not found'})

            organization_id = vendor_row[0]

            # Check if msp record exists for the vendor
            cursor.execute("SELECT COUNT(*) FROM MSPs WHERE VendorID = %s", (vendor_id,))
            exists = cursor.fetchone()[0] > 0
    

            if exists:
                # Update existing bank record
                update_query = """
                    UPDATE MSPs
                    SET MSPName = %s,
                        ContactEmail = %s,
                        ContactPhone = %s,
                        UpdatedAt = CURRENT_TIMESTAMP
                    WHERE VendorID = %s
                """
                cursor.execute(update_query, (msp_name, contact_email,mobile_number, vendor_id))
            else:
                # Insert new bank record with organization_id from Vendors table
                insert_query = """
                    INSERT INTO MSPs (OrganizationID, MSPName, ContactEmail, ContactPhone, CreatedAt, UpdatedAt, VendorID)
                    VALUES (%s, %s, %s, %s, current_timestamp, current_timestamp, %s)
                """
                cursor.execute(insert_query, (organization_id,msp_name,contact_email,mobile_number, vendor_id))

            conn.commit()
            return JsonResponse({'status': 200, 'message': 'MSP details updated successfully'})
        except Exception as e:
            print(e)
            print("Error:", str(e))
            return JsonResponse({'status': 500, 'message': 'Internal server error while updating MSP details'})
        finally:
            cursor.close()
            conn.close()

@csrf_exempt
def get_all_vendor_change_requests(request):
    if request.method == 'GET':
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:
            # SQL query to fetch vendor change requests from all tables (Bank, Basic, MSP)
            query = """
                SELECT 
                    'Basic' AS request_type,
                    vcr.VendorID AS vendor_id,
                    vcr.VendorName AS vendor_name
                FROM 
                    VendorChangeRequests vcr
                JOIN 
                    Vendors v ON v.VendorID = vcr.VendorID
                WHERE 
                    vcr.RequestStatus = 'Pending'

                UNION ALL

                SELECT 
                    'Bank' AS request_type,
                    vcq.VendorID AS vendor_id,
                    vcr.VendorName AS vendor_name
                FROM 
                    BankChangeRequests vcq
                JOIN 
                    Banks b ON b.BankID = vcq.BankID
                JOIN 
                    Vendors vcr ON vcr.VendorID = vcq.VendorID
                WHERE 
                    vcq.RequestStatus = 'Pending'
                    
                UNION ALL
                
                SELECT 
                    'MSP' AS request_type,
                    vcr.VendorID AS vendor_id,
                    vcr.VendorName AS vendor_name
                FROM 
                    MSPChangeRequests mcr
                JOIN 
                    MSPs m ON m.MSPID = mcr.MSPID
                JOIN 
                    Vendors vcr ON vcr.VendorID = m.VendorID
                WHERE 
                    mcr.RequestStatus = 'Pending'
            """

            cursor.execute(query)
            rows = cursor.fetchall()

            # Format the rows into a response
            change_requests = []
            for row in rows:
                change_requests.append({
                    'requestType': row[0],
                    'vendorId': row[1],
                    'vendorName': row[2],
                    'status': 'pending'
                })

            return JsonResponse({'status': 200, 'changeRequests': change_requests})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 500, 'message': 'Internal Server Error'})
        finally:
            cursor.close()
            conn.close()


@csrf_exempt
def update_change_request_status(request, request_id, action):
    if request.method == 'PUT':
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        try:

            # Determine the status based on action
            if action == 'approve':
                new_status = 'Approved'
            elif action == 'reject':
                new_status = 'Rejected'
            else:
                return JsonResponse({'status': 400, 'message': 'Invalid action'})

            # Update the status of the change request based on its ID
            update_query = """
                UPDATE ChangeRequests
                SET RequestStatus = %s
                WHERE RequestID = %s
            """
            cursor.execute(update_query, (new_status, request_id))

            conn.commit()
            return JsonResponse({'status': 200, 'message': f'Change request {action}d successfully'})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'status': 500, 'message': 'Internal Server Error'})
        finally:
            cursor.close()
            conn.close()
