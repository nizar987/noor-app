import { NextRequest, NextResponse } from 'next/server';
import { put, head } from '@vercel/blob';

export const dynamic = 'force-dynamic';

interface UserData {
  userId: string;
  createdAt: string;
  lastActive: string;
}

async function getUserBlob(userId: string): Promise<UserData | null> {
  try {
    const blobDetails = await head(`users/${userId}.json`).catch(() => null);
    if (blobDetails) {
      const blobUrl = blobDetails.downloadUrl || blobDetails.url;
      const res = await fetch(blobUrl, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (err) {
    console.error('Failed to get user blob:', err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await getUserBlob(userId);
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Missing x-user-id header' }, { status: 400 });
  }

  try {
    const existingUser = await getUserBlob(userId);
    
    const userData: UserData = {
      userId,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    await put(`users/${userId}.json`, JSON.stringify(userData), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({ success: true, user: userData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
