import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

async function uploadToAssemblyAI(buffer: Buffer) {
  const res = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY!,
    },
    body: buffer,
  });
  const data = await res.json();
  return data.upload_url;
}

async function transcribeWithAssemblyAI(audioUrl: string) {
  // Request sentiment analysis in the transcription
  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: ASSEMBLYAI_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      sentiment_analysis: true // Enable sentiment analysis
    }),
  });
  const data = await res.json();
  return data.id;
}

async function pollTranscription(id: string) {
  while (true) {
    const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: ASSEMBLYAI_API_KEY! },
    });
    const data = await res.json();
    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error('Transcription failed');
    await new Promise((r) => setTimeout(r, 3000)); // Wait 3 seconds before polling again
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to AssemblyAI
    const audioUrl = await uploadToAssemblyAI(buffer);

    // 2. Start transcription with sentiment analysis
    const transcriptId = await transcribeWithAssemblyAI(audioUrl);

    // 3. Poll for result
    const transcriptData = await pollTranscription(transcriptId);

    // 4. Return transcript and sentiment analysis
    return NextResponse.json({
      transcript: transcriptData.text,
      sentiment_analysis_results: transcriptData.sentiment_analysis_results || [],
      full_assemblyai_response: transcriptData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
} 