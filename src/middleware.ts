import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Get the response for the request
    const response = NextResponse.next();

    // Add CORS headers to all responses
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-copilotkit-runtime-client-id, x-copilotkit-sdk-version");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-copilotkit-runtime-client-id, x-copilotkit-sdk-version",
            },
        });
    }

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/api/:path*",
};
