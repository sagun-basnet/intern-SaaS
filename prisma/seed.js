const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up database...');
  // Delete in order to respect foreign key constraints
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding database with fresh data...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // ── 1. Admins ─────────────────────────────────────────────────────────────
  await prisma.user.create({
    data: { email: 'admin@lunarportal.com', password: passwordHash, role: 'ADMIN' },
  });
  console.log('✅ Admin: admin@lunarportal.com');

  // ── 2. Companies ──────────────────────────────────────────────────────────
  const companiesData = [
    { name: 'TechCorp Pvt Ltd', email: 'hr@techcorp.com', status: 'APPROVED', loc: 'Lalitpur, Nepal' },
    { name: 'InnoLabs', email: 'jobs@innolabs.com', status: 'APPROVED', loc: 'Kathmandu, Nepal' },
    { name: 'Global Solutions', email: 'career@globalsol.com', status: 'APPROVED', loc: 'Remote' },
    { name: 'StartUp Hub', email: 'founder@startuphub.com', status: 'PENDING', loc: 'Pokhara, Nepal' },
    { name: 'Fake IT Ltd', email: 'spam@fakeit.com', status: 'REJECTED', loc: 'Unknown' },
  ];

  const createdCompanies = [];
  for (const c of companiesData) {
    const user = await prisma.user.create({
      data: { email: c.email, password: passwordHash, role: 'COMPANY' },
    });
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: c.name,
        description: `${c.name} is a leading industry player focusing on innovative solutions.`,
        website: `https://${c.name.toLowerCase().replace(/ /g, '')}.com`,
        location: c.loc,
        status: c.status,
      },
    });
    createdCompanies.push(company);
    console.log(`✅ Company: ${c.name} (${c.status})`);
  }

  // ── 3. Seekers ────────────────────────────────────────────────────────────
  const seekersData = [
    { name: 'John Doe', email: 'john@student.com', skills: 'React, Node, MySQL' },
    { name: 'Jane Smith', email: 'jane@dev.com', skills: 'Python, Django, AWS' },
    { name: 'Suman Shrestha', email: 'suman@nepal.com', skills: 'PHP, Laravel, Vue' },
    { name: 'Alice Wong', email: 'alice@intern.com', skills: 'Java, Spring Boot' },
    { name: 'Bob Marley', email: 'bob@seeker.com', skills: 'HTML, CSS, JS' },
  ];

  const createdSeekers = [];
  for (const s of seekersData) {
    const user = await prisma.user.create({
      data: { email: s.email, password: passwordHash, role: 'SEEKER' },
    });
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: s.name,
        bio: `Professional ${s.name} looking for growth opportunities.`,
        skills: s.skills,
        location: 'Nepal',
        phone: '+977-98' + Math.floor(10000000 + Math.random() * 90000000),
      },
    });
    createdSeekers.push({ user, profile });
    console.log(`✅ Seeker: ${s.name}`);
  }

  // ── 4. Jobs ───────────────────────────────────────────────────────────────
  const jobsData = [
    { title: 'Frontend Developer', type: 'FULL_TIME', salary: 'NPR 50k-70k', cid: createdCompanies[0].id },
    { title: 'Backend Intern', type: 'INTERNSHIP', salary: 'NPR 15k-20k', cid: createdCompanies[0].id },
    { title: 'Full Stack Engineer', type: 'FULL_TIME', salary: 'NPR 80k-120k', cid: createdCompanies[1].id },
    { title: 'UI/UX Designer', type: 'CONTRACT', salary: 'NPR 40k', cid: createdCompanies[1].id },
    { title: 'DevOps Intern', type: 'INTERNSHIP', salary: 'NPR 20k', cid: createdCompanies[2].id },
    { title: 'Python Developer', type: 'FULL_TIME', salary: 'USD 2k-3k', cid: createdCompanies[2].id },
    { title: 'QA Engineer', type: 'PART_TIME', salary: 'NPR 30k', cid: createdCompanies[0].id },
    { title: 'React Native Dev', type: 'FULL_TIME', salary: 'NPR 90k', cid: createdCompanies[1].id },
  ];

  const createdJobs = [];
  for (const j of jobsData) {
    const job = await prisma.job.create({
      data: {
        companyId: j.cid,
        title: j.title,
        description: `Exciting opportunity for a ${j.title}. Join our team and build amazing products.`,
        location: 'Remote / Office',
        type: j.type,
        salary: j.salary,
        skills: 'Required skills listed in description.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    createdJobs.push(job);
  }
  console.log(`✅ Created ${createdJobs.length} Job Postings`);

  // ── 5. Applications & Bookmarks ───────────────────────────────────────────
  // John applies to Frontend Dev
  await prisma.application.create({
    data: { userId: createdSeekers[0].user.id, jobId: createdJobs[0].id, message: 'I am a React expert.', status: 'ACCEPTED' },
  });
  // Jane applies to Full Stack
  await prisma.application.create({
    data: { userId: createdSeekers[1].user.id, jobId: createdJobs[2].id, message: 'Interested in this role.', status: 'PENDING' },
  });
  // John bookmarks Backend Intern
  await prisma.bookmark.create({
    data: { userId: createdSeekers[0].user.id, jobId: createdJobs[1].id },
  });

  console.log('\n🎉 Database seeding complete!');
  console.log('--------------------------------------------------');
  console.log('Admin:    admin@lunarportal.com / password123');
  console.log('Seeker:   john@student.com      / password123');
  console.log('Company:  hr@techcorp.com        / password123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
