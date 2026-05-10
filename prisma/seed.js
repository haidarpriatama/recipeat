const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL belum diisi. Copy .env.example ke .env lalu isi DATABASE_URL.');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Sedang mengisi data awal...');

  try {
    // Seed dibuat idempotent agar aman dijalankan di device siapa pun tanpa menghapus data user.
    const cat1 = await prisma.category.upsert({
      where: { name: 'Breakfast' },
      update: {},
      create: { name: 'Breakfast' },
    });
    const cat2 = await prisma.category.upsert({
      where: { name: 'Lunch' },
      update: {},
      create: { name: 'Lunch' },
    });
    const cat3 = await prisma.category.upsert({
      where: { name: 'Dinner' },
      update: {},
      create: { name: 'Dinner' },
    });

    // 3. Tambah 20 Resep beserta bahan-bahannya
    const recipesData = [
      {
        title: 'Nasi Goreng Spesial',
        description: 'Nasi goreng lezat khas Indonesia lengkap dengan telur dadar dan kecap manis. Bumbu halus yang matang merata membuat setiap butir nasi terserap sempurna.',
        instructions: 'Persiapan Nasi: Gunakan nasi putih yang sudah dingin (idealnya nasi sisa kemarin) karena nasi panas akan menjadi lembek saat digoreng. Jika harus menggunakan nasi baru, angin-anginkan terlebih dahulu hingga agak dingin dan butirnya terpisah-pisah.\nPenyiapan Bumbu Halus: Cincang halus 4 siung bawang putih, 2 buah bawang merah sedang, dan 2 buah cabai merah (buang bijinya jika ingin lebih ringan). Gunakan cobek dan alu atau food processor untuk menghaluskan hingga menjadi pasta bumbu yang halus.\nTumisan Bumbu Aroma: Panaskan 3 sendok makan minyak goreng di atas wajan atau kuali dengan api sedang. Masukkan bumbu halus yang sudah disiapkan, kemudian aduk terus sambil menunggu hingga bumbu matang dan mengeluarkan aroma yang harum (sekitar 3-5 menit). Bumbu sudah cukup matang saat warnanya berubah sedikit lebih gelap dan minyak sudah meresap.\nPenyiapan Telur: Pecahkan 2 buah telur ayam ke dalam mangkuk, kemudian kocok dengan garpu hingga putih dan kuning tercampur rata. Jangan sampai terlalu berbusa. Telur ini akan menjadi bahan pengikat untuk nasi goreng.\nMemasak Telur Orak-Arik: Tuangkan telur yang sudah dikocok ke dalam wajan berisi bumbu yang sedang panas, dengan api tetap sedang. Aduk terus dengan spatula kayu sambil merayu-rayui telur hingga menjadi serpihan-serpihan kecil. Jangan biarkan mengeras. Telur cukup dimasak hingga 80% matang karena akan terus memasak saat dicampur nasi.\nPenambahan Nasi: Masukkan 2 piring nasi putih yang sudah diuraikan ke dalam wajan berisi telur dan bumbu. Gunakan spatula untuk memecah-pecah nasi yang masih menggumpal sambil terus mengaduk. Pastikan nasi bercampur merata dengan bumbu dan telur.\nPenambahan Saus dan Penyesuaian Rasa: Tuangkan 3 sendok makan kecap manis sambil terus mengaduk hingga merata. Tambahkan 1/2 sendok teh garam halus dan 1/4 sendok teh lada putih bubuk. Jika terasa kurang gurih, tambahkan 1/2 kubus kaldu jamur yang telah dihaluskan. Terus aduk sampai nasi panas merata dan semua bumbu sudah terserap dengan baik.\nPenyajian Akhir: Angkat nasi goreng ke piring atau piring saji yang besar. Hias dengan irisan telur dadar tipis yang telah disiapkan sebelumnya, irisan mentimun segar, dan taburan kerupuk renyah. Sajikan hangat dengan sambal cabe rawit di sisinya untuk yang menginginkan lebih pedas.',
        cookTime: 20,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Nasi Putih', quantity: '2 Piring' },
          { ingredientName: 'Telur Ayam', quantity: '3 Butir' },
          { ingredientName: 'Bawang Putih', quantity: '4 Siung' },
          { ingredientName: 'Bawang Merah', quantity: '2 Buah' },
          { ingredientName: 'Cabai Merah', quantity: '2 Buah' },
          { ingredientName: 'Kecap Manis', quantity: '3 SDM' },
          { ingredientName: 'Minyak Goreng', quantity: '3 SDM' },
          { ingredientName: 'Garam Halus', quantity: '1/2 SDT' },
          { ingredientName: 'Lada Putih Bubuk', quantity: '1/4 SDT' },
          { ingredientName: 'Kaldu Jamur', quantity: '1/2 Kubus' },
          { ingredientName: 'Mentimun', quantity: '1/2 Buah' },
          { ingredientName: 'Kerupuk', quantity: 'Sesuai Selera' },
          { ingredientName: 'Sambal Cabe Rawit', quantity: 'Sesuai Selera' }
        ]
      },
      {
        title: 'Bubur Ayam',
        description: 'Bubur ayam hangat dengan suwiran ayam, daun bawang, dan kecap manis.',
        instructions: '1. Cuci bersih beras, rebus dengan air kaldu ayam hingga menjadi bubur lembut.\n2. Goreng ayam yang sebelumnya direbus kaldu, lalu suwir-suwir.\n3. Siapkan mangkuk, tuang bubur, beri suwiran ayam, daun bawang, bawang goreng, dan kecap.\n4. Tambahkan kerupuk dan kuah kuning sesuai selera.\n5. Sajikan hangat agar terasa nikmat di pagi hari.',
        cookTime: 45,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Beras', quantity: '1 Cup' },
          { ingredientName: 'Daging Ayam', quantity: '200 gram' },
          { ingredientName: 'Daun Bawang', quantity: '2 Batang' },
          { ingredientName: 'Bawang Goreng', quantity: 'Secukupnya' }
        ]
      },
      {
        title: 'Soto Ayam',
        description: 'Soto ayam kuah kuning segar lengkap dengan koya, bihun, dan telur rebus. Bumbu rempah yang kuat menghasilkan kaldu yang hangat dan menyegarkan.',
        instructions: 'Persiapan Ayam: Ambil 500 gram ayam utuh atau potongan dada dan paha, cuci bersih di bawah air mengalir. Masukkan ke dalam panci besar berisi 1.5 liter air dingin bersih. Panaskan hingga mendidih sambil terus mengeluarkan busa putih yang timbul di permukaan. Busa ini adalah kotoran dan protein yang perlu dibuang untuk kaldu yang jernih.\nPerebusan Awal: Setelah busa bersih, kecilkan api menjadi sedang-kecil dan biarkan ayam memasak selama 25-30 menit hingga daging matang empuk. Ayam sudah matang jika daging mudah terlepas dari tulang saat disentuh dengan garpu. Ambil ayam dari kaldu dan sisihkan. Saring kaldu menggunakan kain kasa atau saringan halus untuk mendapatkan kaldu yang jernih.\nPenyiapan Bumbu Halus: Cincang halus 5 siung bawang putih, 3 buah bawang merah sedang, dan 3 cm jahe segar menggunakan cobek dan alu. Bumbu halus ini akan memberikan aroma dasar yang kuat pada soto.\nTumisan Bumbu Rempah: Panaskan 3 sendok makan minyak di atas wajan dengan api sedang. Masukkan bumbu halus yang telah disiapkan, kemudian aduk terus selama 2-3 menit hingga bumbu matang, minyak meresap, dan aroma yang kuat keluar. Jangan sampai gosong karena akan membuat rasa pahit.\nPenambahan Rempah Kering: Setelah bumbu halus matang dan harum, masukkan 2 ruas kunyit yang sudah diparut, 2 batang serai yang dimemarkan, 3 lembar daun salam, dan 4-5 butir kemiri yang sudah dihaluskan. Aduk rata dengan bumbu halus yang sudah ada.\nPenyatuan Rempah dengan Kaldu: Tuangkan tumisan bumbu rempah ke dalam kaldu ayam yang sudah tersaring. Aduk rata sambil memasak dengan api sedang hingga mendidih. Biarkan mendidih selama 5-10 menit agar semua rasa bumbu larut dan menyatu dengan kaldu. Kaldu akan berubah warna menjadi kuning kecokelatan.\nPenyiapan Bahan Pelengkap: Sementara menunggu kaldu menyusu, potong ayam yang sudah matang menjadi potongan kecil sesuai selera. Rebus 2 butir telur ayam hingga matang keras, kemudian kupas dan belah. Rendam 100 gram bihun dalam air dingin selama 10 menit, lalu tiriskan.\nPenyesuaian Rasa Akhir: Cicipi kaldu dengan sendok dan koreksi rasanya. Tambahkan garam atau kaldu ayam jika terlalu hambar. Kaldu sudah optimal saat terasa gurih dan ada keseimbangan rasa yang harmonis.\nPenyajian: Siapkan mangkuk saji yang besar. Masukkan bihun yang sudah lembut, atur potongan ayam di atasnya, letakkan potongan telur rebus, dan taburi dengan irisan bawang merah mentah tipis serta daun bawang yang dipotong serong. Siram dengan kaldu soto panas yang melimpah. Taburi juga dengan koya (bawang goreng) dan bawang putih goreng. Sajikan sambil kaldu masih sangat panas, dengan sambal dan jeruk nipis di sisi piring.',
        cookTime: 60,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '500 gram' },
          { ingredientName: 'Air Bersih', quantity: '1.5 Liter' },
          { ingredientName: 'Bawang Putih', quantity: '5 Siung' },
          { ingredientName: 'Bawang Merah', quantity: '3 Buah' },
          { ingredientName: 'Jahe', quantity: '3 cm' },
          { ingredientName: 'Kunyit', quantity: '2 Ruas' },
          { ingredientName: 'Serai', quantity: '2 Batang' },
          { ingredientName: 'Daun Salam', quantity: '3 Lembar' },
          { ingredientName: 'Kemiri', quantity: '4-5 Butir' },
          { ingredientName: 'Minyak Goreng', quantity: '3 SDM' },
          { ingredientName: 'Garam Halus', quantity: '1 SDT' },
          { ingredientName: 'Kaldu Ayam', quantity: '1/2 Kubus' },
          { ingredientName: 'Bihun', quantity: '100 gram' },
          { ingredientName: 'Telur Ayam', quantity: '2 Butir' },
          { ingredientName: 'Bawang Goreng', quantity: '2 SDM' },
          { ingredientName: 'Daun Bawang', quantity: '2 Batang' },
          { ingredientName: 'Sambal Cabe', quantity: 'Sesuai Selera' },
          { ingredientName: 'Jeruk Nipis', quantity: '1 Buah' }
        ]
      },
      {
        title: 'Ayam Bakar Kecap',
        description: 'Ayam bakar manis gurih dengan siraman bumbu kecap pekat. Daging empuk dan bumbu meresap sempurna dengan teknik ungkep dan bakar yang tepat.',
        instructions: 'PERSIAPAN AWAL AYAM: Potong 1 ekor ayam menjadi 10 atau 12 bagian agar bumbu lebih mudah meresap hingga ke tulang. Cuci bersih setiap bagian ayam di bawah air mengalir, kemudian keringkan dengan tisu dapur agar saat digoreng atau dibakar, minyak tidak meletup-letup.\n\nPROSES MARINASI: Baluri setiap potongan ayam dengan perasan 1 buah jeruk nipis dan 1 sendok teh garam halus, remas-remas agar merata ke seluruh permukaan. Diamkan selama 15-20 menit di dalam kulkas untuk menghilangkan aroma amis dan melunakkan jaringan protein daging sehingga lebih empuk dan mudah menyerap bumbu.\n\nPERSIAPAN BUMBU AROMATIK: Cincang halus 5 siung bawang putih, iris memanjang 1 buah bawang bombay sedang, geprek 2 cm jahe segar, dan potong serong 2 batang daun bawang serta 3 buah cabai merah. Bumbu ini berfungsi sebagai penyeimbang rasa manis dari kecap dan memberikan aroma yang khas.\n\nMENUMIS DENGAN MENTEGA: Lelehkan 2 sendok makan mentega di atas wajan dengan api sedang, kemudian masukkan jahe geprek dan bawang putih cincang. Tumis hingga mengeluarkan aroma harum yang kuat dan warna bawang putih berubah menjadi krem kecokelatan (sekitar 2-3 menit). Jangan sampai gosong karena akan membuat rasa pahit.\n\nKARAMELISASI BAWANG: Masukkan irisan bawang bombay ke dalam tumisan mentega, aduk terus hingga bawang bombay terlihat transparan dan mulai mengeluarkan aroma manis karamel yang khas. Proses ini memakan waktu sekitar 3-4 menit dan sangat penting untuk memberikan kompleksitas rasa.\n\nPENCCAMPURAN BASIS SAUS: Masukkan 5 sendok makan kecap manis, 2 sendok makan saus tiram, 1 sendok makan kecap inggris (Worcestershire), dan 1/2 sendok teh lada putih bubuk ke dalam tumisan. Biarkan saus mendidih sebentar hingga berbuih di wajan sebelum diaduk agar tercipta aroma smoky yang dalam. Aduk rata selama 1 menit.\n\nPROSES UNGKEP (BRAISING): Masukkan ayam yang telah dimarinasi ke dalam wajan berisi saus kecap, aduk hingga seluruh permukaan ayam terlapisi saus pekat dan merata. Tuangkan 150-200 ml air matang ke dalam wajan sambil terus mengaduk. Tutup wajan dengan api sedang-kecil.\n\nPENYUSUTAN SAUS (REDUKSI): Biarkan masakan mendidih perlahan selama 10-15 menit dengan wajan tetap tertutup. Aduk sesekali agar bumbu merata dan tidak gosong. Saus akan mulai menyusut dan mengental. Tanda saus sudah siap adalah ketika cairan hampir habis, bumbu berubah tekstur menjadi kental dan berminyak, serta berwarna cokelat gelap yang mengilat. Aroma yang keluar sudah sangat harum dan pekat.\n\nSENTUHAN AKHIR (FINISHING): Angkat wajan dari api, kemudian masukkan irisan cabai merah yang baru dipotong dan daun bawang yang telah dipotong serong. Aduk cepat selama 30 detik agar warna merah dan hijau tetap segar dan tidak kusam. Cicipi sausnya untuk koreksi rasa terakhir—tambahkan garam jika terlalu manis, atau sedikit gula jika terlalu asin.',
        cookTime: 50,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1484723091791-00160a2b8e3a?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '1 Ekor (1.5-2 kg)' },
          { ingredientName: 'Jeruk Nipis', quantity: '1 Buah' },
          { ingredientName: 'Garam Halus', quantity: '1 SDT' },
          { ingredientName: 'Bawang Putih', quantity: '5 Siung' },
          { ingredientName: 'Bawang Bombay', quantity: '1 Buah Sedang' },
          { ingredientName: 'Jahe', quantity: '2 cm' },
          { ingredientName: 'Cabai Merah', quantity: '3 Buah' },
          { ingredientName: 'Daun Bawang', quantity: '2 Batang' },
          { ingredientName: 'Mentega', quantity: '2 SDM' },
          { ingredientName: 'Kecap Manis', quantity: '5 SDM' },
          { ingredientName: 'Saus Tiram', quantity: '2 SDM' },
          { ingredientName: 'Kecap Inggris (Worcestershire)', quantity: '1 SDM' },
          { ingredientName: 'Lada Putih Bubuk', quantity: '1/2 SDT' },
          { ingredientName: 'Air Matang', quantity: '150-200 ml' }
        ]
      },
      {
        title: 'Gado-Gado',
        description: 'Salad sayuran lengkap dengan saus kacang kental dan kerupuk renyah.',
        instructions: '1. Rebus kangkung, kacang panjang, dan tauge hingga matang, tiriskan.\n2. Goreng tahu dan tempe hingga kecokelatan.\n3. Haluskan kacang tanah goreng, cabai, gula merah, asam jawa, dan garam. Tambahkan air hangat hingga kekentalan pas.\n4. Tata sayuran, tahu, tempe, dan telur rebus di piring. Siram saus kacang.\n5. Taburi bawang goreng dan sajikan bersama kerupuk.',
        cookTime: 30,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Kangkung', quantity: '1 Ikat' },
          { ingredientName: 'Kacang Tanah', quantity: '200 gram' },
          { ingredientName: 'Tahu', quantity: '2 Buah' },
          { ingredientName: 'Tempe', quantity: '1 Papan' }
        ]
      },
      {
        title: 'Sate Ayam Madura',
        description: 'Sate ayam empuk dengan bumbu kacang manis gurih.',
        instructions: '1. Potong daging ayam dadu, tusuk dengan tusuk sate.\n2. Haluskan kacang sangrai, bawang putih, cabai, dan kemiri. Masak dengan kecap manis hingga mengental.\n3. Celupkan sate ke dalam bumbu lalu bakar hingga matang dan berwarna kecokelatan.\n4. Sajikan sate dengan siraman bumbu kacang, irisan bawang merah, dan jeruk nipis.',
        cookTime: 40,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Dada Ayam', quantity: '500 gram' },
          { ingredientName: 'Kacang Tanah Sangrai', quantity: '250 gram' },
          { ingredientName: 'Tusuk Sate', quantity: '20 Buah' },
          { ingredientName: 'Kecap Manis', quantity: '3 SDM' }
        ]
      },
      {
        title: 'Rendang Daging',
        description: 'Daging sapi dimasak lama dengan santan dan rempah pekat hingga empuk.',
        instructions: '1. Potong daging sapi searah serat.\n2. Masak santan bersama bumbu halus rendang, daun jeruk, serai, dan asam kandis.\n3. Masukkan daging, kecilkan api dan masak sambil diaduk sesekali sampai kuah menyusut.\n4. Lanjutkan memasak hingga daging empuk dan bumbu meresap.\n5. Angkat rendang saat santan hampir kering dan minyak keluar.',
        cookTime: 180,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Sapi', quantity: '1 Kg' },
          { ingredientName: 'Santan Kental', quantity: '1 Liter' },
          { ingredientName: 'Daun Jeruk', quantity: '4 Lembar' },
          { ingredientName: 'Serai', quantity: '2 Batang' }
        ]
      },
      {
        title: 'Roti Bakar Coklat Keju',
        description: 'Roti bakar manis dengan lelehan coklat dan taburan keju parut.',
        instructions: '1. Olesi roti tawar dengan margarin.\n2. Panggang roti sisi satu hingga kecokelatan, balik.\n3. Taburi meses dan keju parut, tutup dengan roti lain.\n4. Panggang hingga semua sisi renyah dan coklat meleleh.\n5. Sajikan hangat dengan susu atau teh.',
        cookTime: 10,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Roti Tawar', quantity: '4 Lembar' },
          { ingredientName: 'Meses Coklat', quantity: 'Secukupnya' },
          { ingredientName: 'Keju Parut', quantity: 'Secukupnya' },
          { ingredientName: 'Margarin', quantity: 'Secukupnya' }
        ]
      },
      {
        title: 'Nasi Uduk',
        description: 'Nasi gurih dimasak dengan santan dan aromatik daun pandan.',
        instructions: '1. Cuci bersih beras, tiriskan.\n2. Rebus santan bersama daun salam, serai, dan garam.\n3. Masukkan beras ke rice cooker, tuang santan rebus secukupnya.\n4. Masak hingga matang.\n5. Sajikan dengan bawang goreng, telur balado, dan kerupuk.',
        cookTime: 40,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Beras', quantity: '2 Cup' },
          { ingredientName: 'Santan', quantity: '500 ml' },
          { ingredientName: 'Daun Salam', quantity: '3 Lembar' },
          { ingredientName: 'Serai', quantity: '1 Batang' }
        ]
      },
      {
        title: 'Opor Ayam',
        description: 'Ayam empuk dalam kuah santan kekuningan manis gurih.',
        instructions: '1. Rebus ayam sebentar, tiriskan.\n2. Tumis bumbu halus bersama serai dan daun jeruk hingga harum.\n3. Masukkan ayam, aduk rata dengan bumbu.\n4. Tuang santan cair dan masak hingga ayam empuk.\n5. Tambahkan santan kental, garam, dan gula. Masak sampai kuah mendidih dan sajikan dengan bawang goreng.',
        cookTime: 50,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '1 Ekor' },
          { ingredientName: 'Santan Cair', quantity: '700 ml' },
          { ingredientName: 'Sereh', quantity: '2 Batang' },
          { ingredientName: 'Daun Jeruk', quantity: '3 Lembar' }
        ]
      },
      {
        title: 'Mie Goreng Jawa',
        description: 'Mie goreng tradisional Jawa dengan bumbu ulek dan sayuran segar.',
        instructions: '1. Rebus mie telur sampai setengah matang, tiriskan.\n2. Haluskan bawang merah, bawang putih, kemiri, ebi, dan cabai.\n3. Tumis bumbu hingga harum, masukkan telur orak-arik dan ayam suwir.\n4. Tambahkan kol, sawi, dan tomat, lalu masak sebentar.\n5. Masukkan mie, kecap manis, saus tiram, garam, dan lada. Aduk rata. Sajikan hangat.',
        cookTime: 25,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1626804475297-41609ea084eb?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Mie Telur', quantity: '200 gram' },
          { ingredientName: 'Ayam Suwir', quantity: '100 gram' },
          { ingredientName: 'Kol', quantity: '1/4 Buah' },
          { ingredientName: 'Kecap Manis', quantity: '4 SDM' }
        ]
      },
      {
        title: 'Sayur Asem Jakarta',
        description: 'Sayur asem asam manis segar khas ibukota dengan jagung dan melinjo.',
        instructions: '1. Rebus jagung, kacang tanah, dan melinjo hingga setengah empuk.\n2. Tambahkan bumbu halus, asam jawa, daun salam, dan lengkuas.\n3. Masukkan labu siam dan kacang panjang. Masak hingga matang.\n4. Tambahkan daun melinjo dan garam. Masak sebentar.\n5. Angkat dan sajikan hangat.',
        cookTime: 40,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1548946522-4a313e8972a4?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Jagung Manis', quantity: '1 Buah' },
          { ingredientName: 'Kacang Panjang', quantity: '1/2 Ikat' },
          { ingredientName: 'Labu Siam', quantity: '1 Buah' },
          { ingredientName: 'Asam Jawa', quantity: '2 SDM' }
        ]
      },
      {
        title: 'Pancake Pisang Fluffy',
        description: 'Pancake lembut dengan aroma pisang matang, sempurna untuk sarapan.',
        instructions: '1. Lumatkan pisang matang hingga halus.\n2. Campur pisang dengan telur, susu, dan mentega cair.\n3. Ayak tepung terigu, baking powder, garam, dan kayu manis.\n4. Tuang bahan kering ke bahan basah, aduk perlahan hingga rata.\n5. Masak di wajan anti lengket hingga muncul gelembung, balik, dan masak sisi lainnya. Sajikan dengan sirup.',
        cookTime: 20,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Pisang Matang', quantity: '2 Buah' },
          { ingredientName: 'Tepung Terigu', quantity: '150 gram' },
          { ingredientName: 'Susu Cair', quantity: '120 ml' },
          { ingredientName: 'Baking Powder', quantity: '1 SDT' }
        ]
      },
      {
        title: 'Tumis Kangkung Terasi',
        description: 'Kangkung tumis cepat dengan aroma terasi bakar dan rasa pedas gurih.',
        instructions: '1. Cuci kangkung dan potong-potong batang muda serta daunnya.\n2. Tumis bawang merah, bawang putih, dan cabai hingga harum.\n3. Masukkan terasi bakar, aduk rata.\n4. Tambahkan kangkung, garam, gula, dan sedikit air. Masak cepat hingga layu.\n5. Angkat dan sajikan dengan nasi putih.',
        cookTime: 15,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c17?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Kangkung', quantity: '1 Ikat' },
          { ingredientName: 'Terasi Bakar', quantity: '1 SDT' },
          { ingredientName: 'Cabai Merah', quantity: '2 Buah' },
          { ingredientName: 'Bawang Putih', quantity: '3 Siung' }
        ]
      },
      {
        title: 'Pepes Ikan Mas',
        description: 'Pepes ikan mas harum dengan daun kemangi dan bumbu kuning.',
        instructions: '1. Bersihkan ikan mas, lumuri garam dan jeruk nipis.\n2. Haluskan bawang merah, bawang putih, kunyit, kemiri, dan cabai.\n3. Campur bumbu dengan tomat iris, daun kemangi, dan garam. Balurkan ke ikan.\n4. Bungkus ikan dengan daun pisang, sematkan lidi.\n5. Kukus selama 30 menit hingga aroma daun pisang keluar.',
        cookTime: 45,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Ikan Mas', quantity: '1 Ekor' },
          { ingredientName: 'Daun Pisang', quantity: '4 Lembar' },
          { ingredientName: 'Daun Kemangi', quantity: '1 Ikat' },
          { ingredientName: 'Kunyit', quantity: '2 Ruas' }
        ]
      },
      {
        title: 'Tahu Gejrot',
        description: 'Tahu goreng renyah dengan kuah asam manis pedas khas Cirebon.',
        instructions: '1. Goreng tahu putih hingga kecokelatan, tiriskan, lalu potong-potong.\n2. Haluskan cabai rawit, bawang merah, gula merah, dan garam. Larutkan dengan air asam jawa.\n3. Campur tahu goreng dengan kuah sambal, tambahkan irisan mentimun dan bawang goreng.\n4. Aduk rata hingga tahu meresap.\n5. Sajikan segera agar tahu tetap renyah.',
        cookTime: 20,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1604908819442-ead3d57b4dd3?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Tahu Putih', quantity: '4 Buah' },
          { ingredientName: 'Cabai Rawit', quantity: '10 Buah' },
          { ingredientName: 'Gula Merah', quantity: '1 SDM' },
          { ingredientName: 'Asam Jawa', quantity: '1 SDM' }
        ]
      },
      {
        title: 'Sup Buntut Madura',
        description: 'Sup buntut dengan kuah ringan dan sayur yang segar. Daging buntut yang empuk meresap kaldu kuning hangat.',
        instructions: 'Persiapan Awal Buntut: Cuci bersih 700 gram buntut sapi di bawah air mengalir sambil menggosok permukaannya untuk menghilangkan darah dan kotoran. Potong buntut menjadi bagian-bagian sepanjang 5-7 cm agar lebih mudah matang dan bumbu mudah meresap ke dalam tulang.\nMerebus Pertama dan Pembersihan: Masukkan buntut sapi ke dalam panci besar berisi air dingin, kemudian panaskan hingga mendidih. Biarkan mendidih selama 2-3 menit sambil terus mengeluarkan busa yang timbul di permukaan dengan sendok berlubang. Busa putih ini adalah kotoran dan protein yang menggumpal—jika tidak dibersihkan akan membuat kaldu keruh. Setelah bersih, tiriskan buntut dan bilas dengan air bersih.\nPerebusan dengan Bumbu Aroma: Masukkan kembali buntut yang sudah bersih ke dalam panci bersih, tuangkan 1.5 liter air matang. Tambahkan 2 batang serai yang dimemarkan (agar aroma keluar), 3 lembar daun salam, 3 cm jahe yang dimemarkan, 5 siung bawang putih yang dimaserasi, dan 1/2 sendok teh garam. Aduk rata dan panaskan hingga mendidih, kemudian kecilkan api menjadi sedang-kecil. Biarkan buntut memasak perlahan selama 60-90 menit dengan sesekali diaduk hingga daging menjadi sangat empuk dan mudah terpisah dari tulang.\nPersiapan Sayuran: Sambil menunggu buntut empuk, potong 2 buah wortel sedang menjadi potongan bulat dengan ketebalan 1 cm (agar matang merata). Potong 2 buah kentang sedang menjadi kubus berukuran 2x2 cm dengan ujung sedikit tumpul agar tidak pecah saat direbus.\nPenambahan Sayuran: Setelah buntut empuk (tinggal 30 menit sebelum sajian), masukkan wortel dan kentang ke dalam panci. Biarkan memasak bersama buntut hingga kedua sayuran menjadi empuk tapi masih mempertahankan bentuk (sekitar 15-20 menit). Jangan terlalu lama agar sayuran tidak menjadi hancur.\nPenyesuaian Rasa Final: Cicipi kuah dengan sendok dan koreksi rasanya. Tambahkan garam secukupnya jika terasa hambar. Tambahkan 1/2 sendok teh gula merah sisir untuk menyeimbangkan rasa (memberikan rasa sedikit manis yang halus). Taburi 1/4 sendok teh lada hitam bubuk untuk memberikan sedikit pedas dan kehangatan pada kaldu.\nPenyajian: Angkat sup ke dalam mangkuk saji yang besar dan dalam. Atur buntut di tengah, dikelilingi oleh wortel dan kentang. Siram dengan kuah hangat yang melimpah. Taburi daun bawang segar yang telah dipotong serong di atasnya sebagai garnis warna dan aroma akhir. Sajikan segera selagi panas dengan nasi putih hangat di samping.',
        cookTime: 120,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Buntut Sapi', quantity: '700 gram' },
          { ingredientName: 'Air Matang', quantity: '1.5 Liter' },
          { ingredientName: 'Sereh', quantity: '2 Batang' },
          { ingredientName: 'Daun Salam', quantity: '3 Lembar' },
          { ingredientName: 'Jahe', quantity: '3 cm' },
          { ingredientName: 'Bawang Putih', quantity: '5 Siung' },
          { ingredientName: 'Garam Halus', quantity: '1/2 SDT' },
          { ingredientName: 'Wortel', quantity: '2 Buah Sedang' },
          { ingredientName: 'Kentang', quantity: '2 Buah Sedang' },
          { ingredientName: 'Gula Merah Sisir', quantity: '1/2 SDT' },
          { ingredientName: 'Lada Hitam Bubuk', quantity: '1/4 SDT' },
          { ingredientName: 'Daun Bawang', quantity: '2 Batang' }
        ]
      },
      {
        title: 'Sambal Matah Bali',
        description: 'Sambal mentah segar Bali dengan bawang merah, cabai, dan serai.',
        instructions: '1. Iris tipis bawang merah, cabai rawit, serai, dan daun jeruk.\n2. Campur semua bahan dengan garam, gula, dan minyak panas.\n3. Aduk sampai bahan sedikit layu dan bumbu meresap.\n4. Sajikan sebagai pelengkap ikan bakar atau ayam goreng.',
        cookTime: 10,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1511688878351-0e6c3fa5cb9c?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Bawang Merah', quantity: '5 Siung' },
          { ingredientName: 'Cabai Rawit', quantity: '10 Buah' },
          { ingredientName: 'Sereh', quantity: '1 Batang' },
          { ingredientName: 'Minyak Kelapa', quantity: '2 SDM' }
        ]
      },
      {
        title: 'Sate Lilit Bali',
        description: 'Sate ikan bali berbumbu aromatik yang dililit pada batang serai.',
        instructions: '1. Haluskan ikan tenggiri bersama bawang merah, bawang putih, kemiri, dan kelapa parut.\n2. Tambahkan air asam jawa, gula merah, dan garam. Aduk hingga bisa dibentuk.\n3. Lilitkan adonan pada batang sereh.\n4. Bakar sate sambil diolesi minyak hingga matang dan harum.',
        cookTime: 35,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Ikan Tenggiri', quantity: '300 gram' },
          { ingredientName: 'Kelapa Parut', quantity: '50 gram' },
          { ingredientName: 'Batang Sereh', quantity: '5 Buah' },
          { ingredientName: 'Daun Jeruk', quantity: '3 Lembar' }
        ]
      },
      {
        title: 'Capcay Goreng Sayur',
        description: 'Capcay sayur campur dengan saus ringan, cocok untuk makan siang sehat.',
        instructions: '1. Panaskan minyak, tumis bawang putih dan bawang bombay hingga harum.\n2. Masukkan wortel, kembang kol, dan jagung muda, tumis hingga setengah matang.\n3. Tambahkan sawi, pokcoy, dan jamur tiram. Aduk rata.\n4. Tuang saus tiram, kecap ikan, dan sedikit air. Masak hingga sayur empuk tapi masih renyah.\n5. Tambahkan pala bubuk dan lada putih, koreksi rasa, lalu angkat.',
        cookTime: 20,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Wortel', quantity: '1 Buah' },
          { ingredientName: 'Kembang Kol', quantity: '100 gram' },
          { ingredientName: 'Sawi', quantity: '1 Ikat' },
          { ingredientName: 'Saus Tiram', quantity: '2 SDM' }
        ]
      }
    ];

    for (const data of recipesData) {
      // Generate random nutrition if not provided
      const protein = Math.floor(Math.random() * 40) + 10;
      const carbs = Math.floor(Math.random() * 60) + 20;
      const fats = Math.floor(Math.random() * 20) + 5;

      const recipeData = {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        cookTime: data.cookTime,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        protein,
        carbs,
        fats,
        ingredients: {
          create: data.ingredients.map(ing => ({
            quantity: ing.quantity,
            ingredient: {
              connectOrCreate: {
                where: { name: ing.ingredientName },
                create: { name: ing.ingredientName }
              }
            }
          }))
        }
      };

      const existingRecipe = await prisma.recipe.findFirst({
        where: { title: data.title },
        select: { id: true },
      });

      if (existingRecipe) {
        await prisma.recipeIngredient.deleteMany({ where: { recipeId: existingRecipe.id } });
        await prisma.recipe.update({
          where: { id: existingRecipe.id },
          data: recipeData,
        });
      } else {
        await prisma.recipe.create({ data: recipeData });
      }
    }

    console.log('BERHASIL! Data resep awal sudah sinkron di database.');
  } catch (error) {
    console.error('Error saat seeding:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
