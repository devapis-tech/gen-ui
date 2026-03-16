import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getDatabase, findMany, insertOne, updateOne, deleteOne as deleteOneFromDB } from '@/lib/mongodb';

interface IssueReport {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "feature_request" | "ui_issue" | "performance" | "other" | "data_query" | "protocol_deviation" | "sae_escalation";
  reporter: string;
  timestamp: Date;
  status: "open" | "in_progress" | "resolved";
  linkedTo?: {
    patientId?: string;
    formId?: string;
    visitId?: string;
    aeId?: string;
    documentId?: string;
  };
  assignee?: string;
  dueDate?: Date;
  issueType?: "data_query" | "protocol_deviation" | "system_bug" | "feature_request" | "sae_escalation";
}

export async function GET(request: NextRequest) {
  try {
    const issues = await findMany<IssueReport>('issues');
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const issueData = await request.json();
    
    const newIssue: IssueReport = {
      ...issueData,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: "open"
    };

    await insertOne('issues', newIssue);
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}
