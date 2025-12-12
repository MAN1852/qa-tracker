import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.attachment.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.note.deleteMany();
    await prisma.application.deleteMany();

    // Create Automation QA Application
    await prisma.application.create({
        data: {
            userId: 'user-1',
            organizationId: 'org-1',
            roleType: 'Automation QA',
            company: 'TechCorp',
            jobTitle: 'Senior Automation Engineer',
            location: 'Remote',
            source: 'LinkedIn',
            status: 'Technical',
            salaryMin: 120000,
            salaryMax: 150000,
            priority: 'High',
            requiredFields: JSON.stringify({
                automationFrameworks: ['Playwright', 'Cypress'],
                programmingLanguages: ['TypeScript', 'Python'],
                repoLink: 'https://github.com/jdoe/portfolio'
            }),
            contactName: 'Alice Recruiter',
            notes: {
                create: [
                    { text: 'Passed phone screen comfortably.', authorId: 'user-1' }
                ]
            },
            interviews: {
                create: [
                    { type: 'Phone Screen', date: new Date(Date.now() - 86400000), status: 'Completed', mode: 'Zoom' },
                    { type: 'Technical', date: new Date(Date.now() + 86400000), status: 'Scheduled', mode: 'Google Meet' }
                ]
            }
        }
    });

    // Create Junior QA Application
    await prisma.application.create({
        data: {
            userId: 'user-1',
            organizationId: 'org-1',
            roleType: 'Junior QA',
            company: 'StartUp Inc',
            jobTitle: 'QA Tester',
            location: 'New York, NY',
            source: 'Indeed',
            status: 'Applied',
            salaryMin: 60000,
            salaryMax: 80000,
            priority: 'Medium',
            requiredFields: JSON.stringify({
                experienceYears: 1,
                manualTestingSkills: ['Black box', 'Regression'],
                willingnessToRelocate: true
            })
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
