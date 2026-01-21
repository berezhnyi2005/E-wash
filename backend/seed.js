import { PrismaClient } from '@prisma/client'
//chat gpt genering
const prisma = new PrismaClient()

async function main() {
  await prisma.service.deleteMany()

  await prisma.service.createMany({
    data: [
      {
        title: 'Basic Wash',
        description: 'Exterior hand wash and dry.',
        price: 30,
        durationMin: 90
      },
      {
        title: 'Premium Wash',
        description: 'Exterior wash, waxing, and interior cleaning.',
        price: 50,
        durationMin: 120
      },
      {
        title: 'Ultimate Detailing',
        description: 'Full detailing with engine cleaning and polish.',
        price: 120,
        durationMin: 240
      },
      {
        title: 'Interior Cleaning',
        description: 'Deep cleaning of seats, carpets, and dashboard.',
        price: 25,
        durationMin: 60
      },
      {
        title: 'Wax Protection',
        description: 'Long-lasting wax coating for paint protection.',
        price: 25,
        durationMin: 50
      }
    ]
  })

  console.log('✅ Services have been seeded successfully!')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
