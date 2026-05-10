const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const detailedIngredients = {
  'Nasi Goreng Spesial': [
    { ingredientName: 'Nasi Putih (Sisa Semalam)', quantity: '2 Piring' },
    { ingredientName: 'Telur Ayam', quantity: '2 Butir' },
    { ingredientName: 'Bawang Merah', quantity: '5 Siung' },
    { ingredientName: 'Bawang Putih', quantity: '3 Siung' },
    { ingredientName: 'Cabai Merah', quantity: '3 Buah' },
    { ingredientName: 'Kecap Manis', quantity: '3 SDM' },
    { ingredientName: 'Garam & Merica', quantity: '1/2 SDT' },
    { ingredientName: 'Minyak Goreng', quantity: '2 SDM' },
    { ingredientName: 'Kerupuk & Mentimun', quantity: 'Secukupnya' }
  ],
  'Bubur Ayam': [
    { ingredientName: 'Beras', quantity: '1 Cup' },
    { ingredientName: 'Daging Ayam Fillet', quantity: '200 gram' },
    { ingredientName: 'Air Kaldu Ayam', quantity: '800 ml' },
    { ingredientName: 'Daun Salam', quantity: '2 Lembar' },
    { ingredientName: 'Daun Bawang & Seledri', quantity: '2 Batang' },
    { ingredientName: 'Kacang Kedelai Goreng', quantity: '3 SDM' },
    { ingredientName: 'Bawang Merah Goreng', quantity: '2 SDM' },
    { ingredientName: 'Kecap Manis & Asin', quantity: 'Secukupnya' },
    { ingredientName: 'Kerupuk', quantity: 'Secukupnya' }
  ],
  'Soto Ayam': [
    { ingredientName: 'Daging Ayam', quantity: '500 gram' },
    { ingredientName: 'Bihun (rendam air panas)', quantity: '100 gram' },
    { ingredientName: 'Kol (iris halus)', quantity: '100 gram' },
    { ingredientName: 'Kunyit (bakar)', quantity: '2 Ruas' },
    { ingredientName: 'Jahe & Lengkuas', quantity: '1 Ruas' },
    { ingredientName: 'Serai (memarkan)', quantity: '2 Batang' },
    { ingredientName: 'Daun Jeruk', quantity: '4 Lembar' },
    { ingredientName: 'Bawang Merah & Putih', quantity: '8 Siung & 4 Siung' },
    { ingredientName: 'Telur Rebus', quantity: '2 Butir' },
    { ingredientName: 'Jeruk Nipis', quantity: '1 Buah' }
  ],
  'Ayam Bakar Kecap': [
    { ingredientName: 'Daging Ayam', quantity: '1 Ekor (potong 8)' },
    { ingredientName: 'Jeruk Nipis', quantity: '1 Buah' },
    { ingredientName: 'Kecap Manis', quantity: '6 SDM' },
    { ingredientName: 'Bawang Merah', quantity: '6 Siung' },
    { ingredientName: 'Bawang Putih', quantity: '4 Siung' },
    { ingredientName: 'Ketumbar Bubuk', quantity: '1 SDT' },
    { ingredientName: 'Margarin (olesan)', quantity: '2 SDM' },
    { ingredientName: 'Garam & Gula Merah', quantity: 'Secukupnya' },
    { ingredientName: 'Sambal Terasi', quantity: 'Pendamping' }
  ],
  'Gado-Gado': [
    { ingredientName: 'Kangkung & Kacang Panjang', quantity: '1 Ikat' },
    { ingredientName: 'Tauge', quantity: '100 gram' },
    { ingredientName: 'Tahu & Tempe', quantity: '1 Blok' },
    { ingredientName: 'Telur Rebus', quantity: '2 Butir' },
    { ingredientName: 'Kacang Tanah Goreng', quantity: '200 gram' },
    { ingredientName: 'Cabai Merah & Rawit', quantity: 'Sesuai selera' },
    { ingredientName: 'Bawang Putih (goreng utuh)', quantity: '3 Siung' },
    { ingredientName: 'Gula Merah & Air Asam', quantity: '2 SDM' },
    { ingredientName: 'Kerupuk Emping', quantity: 'Secukupnya' }
  ],
  'Sate Ayam Madura': [
    { ingredientName: 'Dada Ayam Fillet', quantity: '500 gram' },
    { ingredientName: 'Kacang Tanah Sangrai', quantity: '250 gram' },
    { ingredientName: 'Bawang Putih & Merah', quantity: '4 Siung & 6 Siung' },
    { ingredientName: 'Kemiri Sangrai', quantity: '3 Butir' },
    { ingredientName: 'Cabai Merah', quantity: '4 Buah' },
    { ingredientName: 'Kecap Manis', quantity: '6 SDM' },
    { ingredientName: 'Jeruk Limau', quantity: '2 Buah' },
    { ingredientName: 'Tusuk Sate', quantity: '20 Buah' }
  ],
  'Rendang Daging': [
    { ingredientName: 'Daging Sapi', quantity: '1 Kg' },
    { ingredientName: 'Santan Kental', quantity: '1 Liter' },
    { ingredientName: 'Santan Encer', quantity: '1 Liter' },
    { ingredientName: 'Daun Kunyit & Daun Jeruk', quantity: '1 & 4 Lembar' },
    { ingredientName: 'Serai', quantity: '2 Batang' },
    { ingredientName: 'Asam Kandis', quantity: '2 Buah' },
    { ingredientName: 'Cabai Merah Keriting', quantity: '100 gram' },
    { ingredientName: 'Bawang Merah & Putih', quantity: '15 & 7 Siung' },
    { ingredientName: 'Jahe, Lengkuas, Kunyit', quantity: 'Masing-masing 2 Ruas' },
    { ingredientName: 'Ketumbar & Pala', quantity: '1 SDT & 1/2 Butir' }
  ],
  'Roti Bakar Coklat Keju': [
    { ingredientName: 'Roti Tawar Tebal', quantity: '4 Lembar' },
    { ingredientName: 'Mentega / Margarin', quantity: '3 SDM' },
    { ingredientName: 'Meses Coklat', quantity: '4 SDM' },
    { ingredientName: 'Keju Cheddar Parut', quantity: '50 gram' },
    { ingredientName: 'Susu Kental Manis', quantity: '2 SDM (Opsional)' }
  ],
  'Nasi Uduk': [
    { ingredientName: 'Beras Putih', quantity: '2 Cup' },
    { ingredientName: 'Santan', quantity: '400 ml' },
    { ingredientName: 'Daun Salam', quantity: '3 Lembar' },
    { ingredientName: 'Serai (memarkan)', quantity: '2 Batang' },
    { ingredientName: 'Garam', quantity: '1 SDT' },
    { ingredientName: 'Telur Dadar Iris', quantity: '2 Butir' },
    { ingredientName: 'Bawang Merah Goreng', quantity: '3 SDM' },
    { ingredientName: 'Kerupuk', quantity: 'Pendamping' }
  ],
  'Opor Ayam': [
    { ingredientName: 'Daging Ayam', quantity: '1 Ekor' },
    { ingredientName: 'Santan Kental', quantity: '300 ml' },
    { ingredientName: 'Santan Cair', quantity: '700 ml' },
    { ingredientName: 'Bawang Merah & Putih', quantity: '8 Siung & 4 Siung' },
    { ingredientName: 'Ketumbar & Jintan', quantity: '1 SDT & 1/4 SDT' },
    { ingredientName: 'Kemiri', quantity: '4 Butir' },
    { ingredientName: 'Sereh & Lengkuas', quantity: '2 Batang & 1 Ruas' },
    { ingredientName: 'Daun Jeruk & Salam', quantity: '3 Lembar' },
    { ingredientName: 'Bawang Goreng', quantity: '2 SDM' }
  ]
};

async function updateIngredients() {
  const recipes = await prisma.recipe.findMany();
  for (const recipe of recipes) {
    if (detailedIngredients[recipe.title]) {
      // Delete existing ingredients for this recipe
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId: recipe.id }
      });
      
      // Add new detailed ingredients
      const newIngredients = detailedIngredients[recipe.title].map(ing => ({
        ...ing,
        recipeId: recipe.id
      }));
      
      await prisma.recipeIngredient.createMany({
        data: newIngredients
      });
      console.log('Updated ingredients for:', recipe.title);
    }
  }
  console.log("All ingredients updated successfully!");
}

updateIngredients().catch(console.error).finally(() => prisma.$disconnect());
