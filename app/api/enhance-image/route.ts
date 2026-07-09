// app/api/enhance-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    // Use a reliable, free model for upscaling
    const model = (formData.get('model') as string) || 
                  'caidas/swin2SR-lightweight-x2-64';

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    // Check if token is set
    const token = process.env.HF_TOKEN;
    if (!token) {
      console.error('❌ HF_TOKEN is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: missing HF_TOKEN' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'image/jpeg',
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hugging Face API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Hugging Face API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const enhancedBuffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(enhancedBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="enhanced-image.jpg"',
      },
    });
  } catch (error: any) {
    console.error('❌ Enhancement error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}