import { db } from "../src/lib/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create products
  const acneline = await db.product.create({
    data: {
      slug: "acneline",
      name: "Acnéline",
      tagline: "Votre solution naturelle contre l'acné",
      description: "Acnéline est une huile naturelle formulée avec des ingrédients soigneusement sélectionnés pour combattre l'acné efficacement. Notre formule unique pénètre profondément les pores pour éliminer les bactéries responsables de l'acné tout en nourrissant et en hydratant votre peau. Résultat : une peau plus nette, plus saine et plus rayonnante, sans effets secondaires chimiques.",
      problemText: "L'acné touche des millions de personnes en Algérie, causant des complexes, des cicatrices et une perte de confiance. Les produits chimiques agressifs dessèchent la peau et aggravent souvent le problème au lieu de le résoudre.",
      solutionText: "Acnéline utilise la puissance de la nature avec une formule 100% naturelle qui traite l'acné à la source sans agresser votre peau. Des huiles essentielles pures et des extraits botaniques qui apaisent, purifient et régénèrent.",
      benefits: JSON.stringify([
        "Réduit l'acné et les boutons en 2 semaines",
        "Hydrate et nourrit la peau sans obstruer les pores",
        "Diminue les cicatrices et les marques d'acné"
      ]),
      usage: "Appliquez 3-4 gouttes sur le visage propre et sec, matin et soir. Massez délicatement en mouvements circulaires. Évitez le contour des yeux. Pour meilleurs résultats, utilisez pendant minimum 4 semaines.",
      price: 3900,
      originalPrice: 5500,
      imageUrl: "/products/acneline.png",
      category: "skincare",
      stock: 150,
      orderIndex: 1,
    },
  });

  const colonclean = await db.product.create({
    data: {
      slug: "colonclean",
      name: "ColonClean",
      tagline: "Détoxifiez votre système digestif naturellement",
      description: "ColonClean est un complément naturel puissant conçu pour purifier et détoxifier votre système digestif. Notre formule à base de plantes médicinales aide à éliminer les toxines accumulées, à améliorer le transit intestinal et à restaurer l'équilibre de votre flore intestinale. Retrouvez un confort digestif optimal et une énergie renouvelée.",
      problemText: "Les problèmes digestifs affectent la vie quotidienne de millions d'Algériens. Ballonnements, constipation, gaz et fatigue chronique sont souvent liés à un colon encrassé et une flore intestinale déséquilibrée par une alimentation moderne.",
      solutionText: "ColonClean offre une détoxification naturelle et en douceur. Notre formule à base de plantes nettoie le colon en profondeur, régénère la flore intestinale et restaure un transit optimal sans effet laxatif aggressif.",
      benefits: JSON.stringify([
        "Élimine les toxines et purifie le colon",
        "Améliore le transit intestinal naturellement",
        "Booste l'énergie et renforce l'immunité"
      ]),
      usage: "Prenez 2 gélules par jour avec un grand verre d'eau, de préférence le matin à jeun. Cure recommandée de 30 jours. Buvez au moins 1,5L d'eau par jour pendant la cure.",
      price: 3500,
      originalPrice: 4800,
      imageUrl: "/products/colonclean.png",
      category: "supplement",
      stock: 200,
      orderIndex: 2,
    },
  });

  const cleanlungs = await db.product.create({
    data: {
      slug: "cleanlungs",
      name: "CleanLungs",
      tagline: "Respirez librement, vivez pleinement",
      description: "CleanLungs est un complément naturel avancé spécialement formulé pour nettoyer et protéger vos poumons. Grâce à un mélange unique d'extraits de plantes aux propriétés expectorantes et anti-inflammatoires, il aide à décongestionner les voies respiratoires, éliminer les mucosités et renforcer la capacité pulmonaire.",
      problemText: "La pollution, le tabac et les infections respiratoires fragilisent nos poumons au quotidien. Toux persistante, essoufflement, congestion et sensibilité aux infections sont le signe d'un système respiratoire qui a besoin d'aide.",
      solutionText: "CleanLungs nettoie et régénère les poumons grâce à une formule 100% naturelle. Les plantes expectorantes et anti-inflammatoires aident à libérer les voies respiratoires et à restaurer une respiration profonde et saine.",
      benefits: JSON.stringify([
        "Décongestionne les voies respiratoires",
        "Élimine les mucosités et toxines pulmonaires",
        "Renforce la capacité respiratoire naturellement"
      ]),
      usage: "Prenez 2 gélules par jour avec un verre d'eau, matin et soir au cours des repas. Cure de 30 jours recommandée. Peut être utilisé en cure d'entretien de 15 jours par mois.",
      price: 3700,
      originalPrice: 5000,
      imageUrl: "/products/cleanlungs.png",
      category: "supplement",
      stock: 120,
      orderIndex: 3,
    },
  });

  const maca = await db.product.create({
    data: {
      slug: "maca",
      name: "Maca Power",
      tagline: "L'énergie naturelle du Pérou pour votre vitalité",
      description: "Maca Power est un super-aliment puissant issu de la racine de Maca péruvienne, utilisée depuis des millénaires pour ses propriétés énergisantes et équilibrantes. Notre extrait concentré booste votre énergie physique et mentale, améliore l'endurance et équilibre vos hormones naturellement. Redécouvrez la vitalité et la confiance en vous.",
      problemText: "La fatigue chronique, le manque d'énergie et le déséquilibre hormonal touchent de plus en plus de personnes. Stress, sédentarité et alimentation déséquilibrée épuisent nos réserves énergétiques et affectent notre qualité de vie.",
      solutionText: "Maca Power puise dans la sagesse ancestrale des Incas avec un extrait pur et concentré de Maca péruvienne. Cet adaptogène naturel restaure l'énergie, équilibre les hormones et booste la vitalité de manière durable.",
      benefits: JSON.stringify([
        "Booste l'énergie et l'endurance physique",
        "Équilibre les hormones naturellement",
        "Améliore la concentration et la vitalité"
      ]),
      usage: "Prenez 1 à 2 gélules par jour avec un verre d'eau, de préférence le matin. Ne pas dépasser la dose recommandée. Cure de 60 jours pour des résultats optimaux.",
      price: 4200,
      originalPrice: 5900,
      imageUrl: "/products/maca.png",
      category: "supplement",
      stock: 180,
      orderIndex: 4,
    },
  });

  // Create testimonials
  await db.testimonial.createMany({
    data: [
      {
        name: "Amina B.",
        product: "Acnéline",
        rating: 5,
        text: "Après 3 semaines d'utilisation, mon acné a considérablement diminué. Ma peau est plus nette et plus douce. Je recommande à 100% !",
        active: true,
      },
      {
        name: "Karim M.",
        product: "ColonClean",
        rating: 5,
        text: "Mon transit est redevenu régulier après seulement 10 jours. Je me sens beaucoup plus léger et énergique. Produit miracle !",
        active: true,
      },
      {
        name: "Fatima Z.",
        product: "CleanLungs",
        rating: 5,
        text: "En tant qu'ancienne fumeuse, je cherchais un produit naturel pour nettoyer mes poumons. CleanLungs m'a aidée à respirer beaucoup mieux.",
        active: true,
      },
      {
        name: "Youcef A.",
        product: "Maca Power",
        rating: 5,
        text: "Énergie incroyable ! Je me sens beaucoup plus dynamique au quotidien. Ma concentration au travail s'est aussi améliorée.",
        active: true,
      },
      {
        name: "Sara L.",
        product: "Acnéline",
        rating: 4,
        text: "Très bon produit, ma peau s'est nettement améliorée. Le seul bémol c'est le temps qu'il faut pour voir les résultats, mais ça vaut le coup.",
        active: true,
      },
      {
        name: "Mourad D.",
        product: "ColonClean",
        rating: 5,
        text: "Souffrait de ballonnements depuis des années. Après une cure de ColonClean, c'est comme si j'avais un nouveau système digestif. Merci SCORBIO !",
        active: true,
      },
    ],
  });

  // Create demo affiliate
  await db.affiliate.create({
    data: {
      code: "SCORBIO_DEMO",
      name: "Affilié Démonstration",
      email: "demo@scorbio.dz",
      phone: "0550000000",
      commissionRate: 20,
      totalSales: 0,
      totalCommissions: 0,
    },
  });

  // Create promo code
  await db.promoCode.create({
    data: {
      code: "BIENVENUE10",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 3000,
      maxUses: 100,
      currentUses: 0,
      active: true,
    },
  });

  // Create admin
  await db.admin.create({
    data: {
      email: "admin@scorbio.dz",
      password: "admin123",
      name: "Admin SCORBIO",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("📦 Products: 4 created");
  console.log("⭐ Testimonials: 6 created");
  console.log("🤝 Demo affiliate: SCORBIO_DEMO");
  console.log("🎫 Promo code: BIENVENUE10");
  console.log("👤 Admin: admin@scorbio.dz / admin123");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
