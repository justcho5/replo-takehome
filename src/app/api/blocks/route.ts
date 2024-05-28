import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = await fetch("http://localhost:3001/blocks");
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch("http://localhost:3001/blocks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updatedBlock } = body;
  const res = await fetch(`http://localhost:3001/blocks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBlock),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
