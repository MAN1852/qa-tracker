import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// --- API Routes ---

// Get all applications
app.get('/api/applications', async (req, res) => {
    try {
        const apps = await prisma.application.findMany({
            include: {
                notes: true,
                interviews: true,
                attachments: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        // Parse JSON fields
        const parsedApps = apps.map(app => ({
            ...app,
            requiredFields: JSON.parse(app.requiredFields),
            activityLog: JSON.parse(app.activityLog)
        }));
        res.json(parsedApps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Create application
app.post('/api/applications', async (req, res) => {
    try {
        const {
            roleType, company, jobTitle, location, source,
            salaryMin, salaryMax, salaryCurrency, priority,
            contactName, contactEmail, contactPhone,
            requiredFields, tags = []
        } = req.body;

        const newApp = await prisma.application.create({
            data: {
                userId: 'demo-user', // mocked
                organizationId: 'demo-org', // mocked
                roleType,
                company,
                jobTitle,
                location,
                source,
                salaryMin,
                salaryMax,
                salaryCurrency,
                priority,
                contactName,
                contactEmail,
                contactPhone,
                requiredFields: JSON.stringify(requiredFields || {}),
                tags: Array.isArray(tags) ? tags.join(',') : tags,
                activityLog: JSON.stringify([{
                    event: "Created",
                    from: "",
                    to: "Applied",
                    date: new Date().toISOString()
                }])
            }
        });
        res.json(newApp);
    } catch (error: any) {
        console.error('CREATE ERROR:', error.message, error.code, error.meta);
        res.status(500).json({ error: 'Failed to create application', details: error.message });
    }
});

// Update application (Status move, etc)
app.put('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, requiredFields, notes, priority } = req.body;

        // Simplistic update - in real app would handle individual fields more carefully
        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (requiredFields) updateData.requiredFields = JSON.stringify(requiredFields);

        const updatedApp = await prisma.application.update({
            where: { id },
            data: updateData
        });
        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update application' });
    }
});

// Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const totalApps = await prisma.application.count();
        const byStatus = await prisma.application.groupBy({
            by: ['status'],
            _count: { status: true }
        });
        const byRole = await prisma.application.groupBy({
            by: ['roleType'],
            _count: { roleType: true }
        });

        res.json({
            totalApps,
            byStatus: byStatus.map(s => ({ status: s.status, count: s._count.status })),
            byRole: byRole.map(r => ({ role: r.roleType, count: r._count.roleType }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
