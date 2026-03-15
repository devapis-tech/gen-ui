export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

// Configure worker for Node.js environment
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item: TextItem) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return NextResponse.json({ 
      text: fullText.trim(),
      success: true 
    });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ 
      error: 'Failed to parse PDF file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
