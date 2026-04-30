"""
CORS middleware for handling cross-origin requests
"""

class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle simple OPTIONS preflight here by returning an empty response
        if request.method == "OPTIONS":
            from django.http import HttpResponse

            origin = request.META.get("HTTP_ORIGIN")
            resp = HttpResponse()
            # Echo the Origin header when present (don't use wildcard with credentials)
            if origin:
                resp["Access-Control-Allow-Origin"] = origin
            resp["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            resp["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            resp["Access-Control-Allow-Credentials"] = "true"
            return resp

        response = self.get_response(request)

        # Echo the Origin header when present (browsers disallow '*' with credentials)
        origin = request.META.get("HTTP_ORIGIN")
        if origin:
            response["Access-Control-Allow-Origin"] = origin
        else:
            response["Access-Control-Allow-Origin"] = "*"

        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"

        return response
