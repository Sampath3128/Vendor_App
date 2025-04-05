from django.http import HttpResponse, JsonResponse

from vendors.models import Vendor
from vendors.snowflake_connection import get_snowflake_connection
from vendors.utils import get_vendors_from_snowflake


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