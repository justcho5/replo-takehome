import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { src } = await request.json();
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const filename = `image${Date.now()}.jpg`;
    const savePath = path.join(process.cwd(), "public", "images", filename);

    await fs.writeFile(savePath, Buffer.from(buffer));
    return NextResponse.json({
      message: "Image saved",
      src: `/images/${filename}`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save image", error: (error as Error).message },
      { status: 500 }
    );
  }
}
