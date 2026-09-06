import { NextRequest, NextResponse } from 'next/server';
import { ResumeParser } from '@/lib/resume/resume-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    // Handle PDF / DOCX or fallback to buffer decoding
    if (fileName.toLowerCase().endsWith('.pdf')) {
      try {
        const pdf = require('pdf-parse');
        const data = await pdf(buffer);
        extractedText = data.text;
      } catch {
        // Fallback ASCII extraction for PDFs
        extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
      }
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } catch {
        extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    const parsedResume = ResumeParser.parseRawText(extractedText, fileName, file.size);

    return NextResponse.json({
      success: true,
      resume: parsedResume,
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse resume document' },
      { status: 500 }
    );
  }
}
