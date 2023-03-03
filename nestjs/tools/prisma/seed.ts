import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const generalChat = await prisma.room.upsert({
    where: { name: 'General Chat' },
    update: {},
    create: {
      name: 'General Chat',
      },
  });
  console.log(generalChat);
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
