const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Client initialized');
prisma.application.count()
    .then(c => console.log('Count:', c))
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());
