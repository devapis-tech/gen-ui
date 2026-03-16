import { NextRequest, NextResponse } from 'next/server';
import { updateOne, deleteOne as deleteOneFromDB } from '@/lib/mongodb';

interface IssueReport {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "feature_request" | "ui_issue" | "performance" | "other";
  reporter: string;
  timestamp: Date;
  status: "open" | "in_progress" | "resolved";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const updatedIssue = await updateOne<IssueReport>('issues', { id }, { status });
    
    if (!updatedIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = await deleteOneFromDB<IssueReport>('issues', { id });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
