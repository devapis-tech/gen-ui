import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://host.docker.internal:5000';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    try {
        // If it's a relative URL, prepend the backend URL
        const targetUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
        
        console.log(`Proxying request to: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                // Forward any other necessary headers
            },
        });

        const content = await response.text();

        const res = new NextResponse(content, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });

        return res;
    } catch (error) {
        console.error("Proxy error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: "Failed to fetch URL", details: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    const body = await req.text();

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    try {
        const targetUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
        
        console.log(`Proxying POST request to: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': req.headers.get('Content-Type') || 'application/json',
            },
            body: body,
        });

        const content = await response.text();

        return new NextResponse(content, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        console.error("Proxy POST error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: "Failed to fetch URL", details: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    const body = await req.text();

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    try {
        const targetUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
        
        console.log(`Proxying PUT request to: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': req.headers.get('Content-Type') || 'application/json',
            },
            body: body,
        });

        const content = await response.text();

        return new NextResponse(content, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        console.error("Proxy PUT error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: "Failed to fetch URL", details: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    try {
        const targetUrl = url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
        
        console.log(`Proxying DELETE request to: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            method: 'DELETE',
        });

        const content = await response.text();

        return new NextResponse(content, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        console.error("Proxy DELETE error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: "Failed to fetch URL", details: errorMessage }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
