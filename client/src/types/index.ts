export interface Application {
    id: string;
    roleType: string;
    company: string;
    jobTitle: string;
    status: string;
    priority: string;
    updatedAt: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    contactName?: string;
    contactEmail?: string;
    requiredFields?: any;
    notes?: Note[];
    interviews?: Interview[];
    attachments?: Attachment[];
    ActivityLog?: any[];
}

export interface Note {
    id: string;
    text: string;
    createdAt: string;
    authorId: string;
}

export interface Interview {
    id: string;
    type: string;
    date: string;
    mode: string;
    status: string;
}

export interface Attachment {
    id: string;
    filename: string;
    url: string;
    uploadedAt: string;
}
