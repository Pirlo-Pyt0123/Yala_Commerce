import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });
  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer' },
  });
  console.log(`Roles: ${adminRole.name}, ${customerRole.name}`);

  // 2. Usuario admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@licoreria.com' },
    update: {},
    create: {
      email: 'admin@licoreria.com',
      password: hashedPassword,
      name: 'Administrador',
      roleId: adminRole.id,
    },
  });
  console.log(`Admin: ${adminUser.email}`);

  // 3. Categorías
  const categoriesData = [
    { name: 'Whisky',  slug: 'whisky',  description: 'Whiskys nacionales e importados' },
    { name: 'Vino',    slug: 'vino',    description: 'Tintos, blancos y rosados' },
    { name: 'Cerveza', slug: 'cerveza', description: 'Artesanales e industriales' },
    { name: 'Ron',     slug: 'ron',     description: 'Rones nacionales e importados' },
    { name: 'Pisco',   slug: 'pisco',   description: 'Piscos nacionales' },
    { name: 'Vodka',   slug: 'vodka',   description: 'Vodkas importados' },
  ];
  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      }),
    ),
  );
  console.log(`Categorías: ${categories.map((c) => c.name).join(', ')}`);

  // 4. Productos de muestra
  const whiskyId   = categories.find((c) => c.slug === 'whisky')!.id;
  const vinoId     = categories.find((c) => c.slug === 'vino')!.id;
  const cervezaId  = categories.find((c) => c.slug === 'cerveza')!.id;

  const productsData = [
    {
      name: 'Johnnie Walker Red Label 750ml',
      slug: 'johnnie-walker-red-750',
      description: 'Scotch whisky blended, ideal para cocktails',
      price: 45.99,
      stock: 50,
      categoryId: whiskyId,
    },
    {
      name: 'Johnnie Walker Black Label 750ml',
      slug: 'johnnie-walker-black-750',
      description: 'Scotch whisky blended, 12 años de maduración',
      price: 75.99,
      stock: 30,
      categoryId: whiskyId,
    },
    {
      name: 'Casillero del Diablo Cabernet 750ml',
      slug: 'casillero-diablo-cabernet-750',
      description: 'Vino tinto chileno, notas a cereza y ciruela',
      price: 18.50,
      stock: 100,
      categoryId: vinoId,
    },
    {
      name: 'Corona Extra 355ml x6',
      slug: 'corona-extra-355-x6',
      description: 'Pack 6 cervezas Corona Extra',
      price: 22.00,
      stock: 200,
      categoryId: cervezaId,
    },
  ];
  const products = await Promise.all(
    productsData.map((prod) =>
      prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
      }),
    ),
  );
  console.log(`Productos: ${products.map((p) => p.name).join(', ')}`);

  console.log('\nSeed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });