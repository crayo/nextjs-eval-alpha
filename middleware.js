import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  if (!requestHeaders.has("x-request-id")) requestHeaders.set("x-request-id", uuidv4());
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}
