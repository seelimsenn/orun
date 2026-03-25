import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // KADIN
  {
    name: 'Eternity Kaşmir Kaban',
    description: 'Uçsuz bucaksız kış gökyüzünden ilham alan, yapısal bütünlüğü mükemmel Moğol kaşmir kaban. Sonsuzluk hissi veren dökümlü kesim.',
    price: 18500.00,
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop',
    category: 'Kadın',
    subcategory: 'Dış Giyim'
  },
  {
    name: 'Horizon İpek Elbise',
    description: 'Gündoğumu ve günbatımı arasındaki ufuğun akışkanlığını yansıtan saf ipekten tasarlanmış zarif midi elbise.',
    price: 9200.00,
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1200&auto=format&fit=crop',
    category: 'Kadın',
    subcategory: 'Elbise'
  },
  {
    name: 'Aura Deri Ceket',
    description: 'Etrafınızdaki enerjiyi yansıtan, el işçiliği üst düzey İtalyan derisinden üretilmiş, sınırları kaldıran asimetrik ceket.',
    price: 24500.00,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
    category: 'Kadın',
    subcategory: 'Dış Giyim'
  },
  // ERKEK
  {
    name: 'Celestial Yün Kaban',
    description: 'Göksel genişlikten ilham alan, yapılandırılmış ağır yün kumaştan dikilmiş erkek kaban. Güçlü ve sakin.',
    price: 16800.00,
    imageUrl: 'https://images.unsplash.com/photo-1512413914565-d06900eaf11c?q=80&w=1200&auto=format&fit=crop',
    category: 'Erkek',
    subcategory: 'Dış Giyim'
  },
  {
    name: 'Nebula Keten Gömlek',
    description: 'Yıldız bulutsusu kadar hafif, fırçalanmış İspanyol keteninden tasarlanmış, nefes alan lüks dokulu gömlek.',
    price: 4500.00,
    imageUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?q=80&w=1200&auto=format&fit=crop',
    category: 'Erkek',
    subcategory: 'Gömlek'
  },
  {
    name: 'Meteor İtalyan Pantolon',
    description: 'Minimal ve keskin. Doğal hareketlere zarafetle eşlik eden, terzi işi yün karışımlı pantolon.',
    price: 6100.00,
    imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc75731?q=80&w=1200&auto=format&fit=crop',
    category: 'Erkek',
    subcategory: 'Pantolon'
  },
  // GENÇ
  {
    name: 'Nova Sokak Ceketi',
    description: 'Tıpkı bir yıldız patlaması gibi enerjik ve iddialı. Modern şehrin dinamiklerine uyum sağlayan su itici kumaş.',
    price: 7800.00,
    imageUrl: 'https://images.unsplash.com/photo-1521223830155-f2cb73e2ef8a?q=80&w=1200&auto=format&fit=crop',
    category: 'Genç',
    subcategory: 'Sokak Giyimi'
  },
  {
    name: 'Solstice Spor Eşofman',
    description: 'Gündönümünün en uzun günü kadar limitsiz konfor. Organik pamuk karışımı.',
    price: 3200.00,
    imageUrl: 'https://images.unsplash.com/photo-1485218126466-34e6392ec754?q=80&w=1200&auto=format&fit=crop',
    category: 'Genç',
    subcategory: 'Spor'
  },
  // ÇOCUK
  {
    name: 'Stellar Kaban',
    description: 'Küçük kaşiflerin soğuk evrendeki yolculuklarında onları sıcacık tutacak koruyucu zırh.',
    price: 4900.00,
    imageUrl: 'https://images.unsplash.com/photo-1549488344-cbf258b54ed3?q=80&w=1200&auto=format&fit=crop',
    category: 'Çocuk',
    subcategory: 'Dış Giyim'
  },
  {
    name: 'Comet Örme Kazak',
    description: 'Rahat, kaşındırmayan organik yapı. Uzaylı küçük dostlarınızın rahatlıkla hareket etmesi için.',
    price: 2100.00,
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop',
    category: 'Çocuk',
    subcategory: 'Günlük'
  },
  // AKSESUAR
  {
    name: 'Zenith Hakiki Deri Çanta',
    description: 'Zirveyi ve evrendeki en yüksek noktayı temsil eder. %100 Dana derisinden el işçiliğiyle hazırlandı.',
    price: 11500.00,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop',
    category: 'Aksesuar',
    subcategory: 'Çanta'
  },
  {
    name: 'Cosmos Özel Güneş Gözlüğü',
    description: 'Güneşin ve yıldızların yansımalarından ilham alan, asetat çerçeveli karakteristik tasarım.',
    price: 5400.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop',
    category: 'Aksesuar',
    subcategory: 'Gözlük'
  }
]

const magazines = [
  {
    title: 'Gök Yüzünün Mimarisi: ORUN Manifestosu',
    excerpt: 'Eski Türkçede "Evrenin Ruhu" ve "Görkemli Yer" anlamına gelen Orun’un köklerinden ilham alan tasarım dilimiz üzerine.',
    content: 'Tasarım sadece giyinmek değil, insanın kendisini, yaşadığı fiziksel ve ruhsal ortamla nasıl birleştirdiğini anlama sanatıdır. ORUN olarak yeni koleksiyonumuzda kozmostan, boşluğun ihtişamından ve yıldızların sükunetinden ilham alıyoruz.\n\nHer bir ürün, gökyüzünün katmanları gibi ağırbaşlı ve evrensel bir dengeye sahip olmak üzerine yaratıldı. Işık, maddeyi var eder. Bu sebeple kaşmirin üzerine düşen bir gölge ile derinin yansıttığı sert ışık, aynı bütünselliği temsil ediyor.',
    imageUrl: 'https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?q=80&w=1200&auto=format&fit=crop',
    likes: 120
  },
  {
    title: 'Yeni Sezon: Kutsal Sınırlar',
    excerpt: 'Deri, keten ve yün... İnsanlığın doğayla kurduğu en eski bağların modern metropollerdeki yankısı.',
    content: 'En saf formdaki yünün İtalyan terzilik sanatı ile buluştuğunda hissettirdiği o ilkel güven duygusundan bahsediyoruz. "Celestial" ve "Eternity" kalıplarımız, sadece bedeni değil, ruhu da örtmek için geliştirildi.\n\nModada sadece bir trendi değil, zamansız kalabilmenin altın oranını inceliyoruz.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    likes: 85
  }
]

const pages = [
  {
    slug: 'kurumsal',
    title: 'Kurumsal',
    content: 'ORUN, evrenin ruhunu ve doğanın eşsiz vizyonunu lüks tasarım diliyle birleştiren vizyoner bir giyim platformudur.\n\nSürdürülebilirlik ilkelerine sadık kalıp, kaşmir, deri ve saf pamuk gibi doğal elyaflarla geleceğin üniformasını dikiyoruz.'
  },
  {
    slug: 'hakkimizda',
    title: 'Hakkımızda',
    content: 'Bizler, sadece bedeni değil ruhu da yansıtmak amacıyla yola çıkan; modayı geçici bir heves olarak değil, kalıcı ve kozmik bir ifade biçimi olarak gören tasarımcılarız.\n\nAmacımız estetiği yeniden tanımlamaktır.'
  },
  {
    slug: 'destek',
    title: 'Müşteri Hizmetleri ve Destek',
    content: 'Kapsamlı İade ve Değişim\nSiparişinizin size ulaşmasının ardından 30 gün içerisinde sitemizdeki iade panelini kullanarak ürünlerimizi hiçbir ücret ödemeden değiştirebilir veya iade edebilirsiniz.\n\nMüşteri memnuniyeti bizim için, evrenin denge yasaları kadar önemlidir.'
  },
  {
    slug: 'iletisim',
    title: 'İletişim & Lokasyon',
    content: 'Aklınıza takılan her türlü soru veya işbirliği teklifi için bize ulaşın:\n\n✉️ E-posta: hello@orun.com\n📞 Telefon: +90 (212) 555 44 33\n📍 Merkez Stüdyo: Kozmik Vadi, Yıldız Blokları No: 1, İstanbul, Türkiye'
  }
]

async function main() {
  console.log('Veritabanı sıfırlanıp yenileniyor...')
  await prisma.product.deleteMany()
  await prisma.magazine.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.page.deleteMany()
  
  for (const p of products) {
    const createdProduct = await prisma.product.create({ data: p })
    
    // Add multiple images (Simulating gallery with unspash premium fashion shots)
    await prisma.productImage.createMany({
      data: [
         { url: p.imageUrl, order: 0, productId: createdProduct.id },
         { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', order: 1, productId: createdProduct.id },
         { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', order: 2, productId: createdProduct.id }
      ]
    })
    
    // Add size variants (Simulating real stock)
    const sizes = p.category === 'Aksesuar' ? ['Standart'] : ['XS', 'S', 'M', 'L']
    await prisma.productVariant.createMany({
      data: sizes.map(size => ({
        size,
        stock: size === 'XS' ? 0 : Math.floor(Math.random() * 15) + 1, // Make XS always out of stock for testing
        productId: createdProduct.id
      }))
    })
  }
  for (const m of magazines) {
    await prisma.magazine.create({ data: m })
  }
  for (const pg of pages) {
    await prisma.page.create({ data: pg })
  }
  console.log('ORUN Konseptli Seeding tamamlandı.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
