const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const servicesData = [
    // --- FACIALS & CLEAN-UP ---
    { name: 'Fruit Facial', price: 800, category: 'Skin Care', gender: 'Female' },
    { name: 'Fruit Clean-Up', price: 500, category: 'Skin Care', gender: 'Female' },
    { name: 'Diamond Facial', price: 1200, category: 'Skin Care', gender: 'Female' },
    { name: 'Diamond Clean-Up', price: 800, category: 'Skin Care', gender: 'Female' },
    { name: 'Wine Facial', price: 1200, category: 'Skin Care', gender: 'Female' },
    { name: 'Wine Clean-Up', price: 800, category: 'Skin Care', gender: 'Female' },
    { name: 'Vitamin-C Facial', price: 1200, category: 'Skin Care', gender: 'Female' },
    { name: 'Vitamin-C Clean-Up', price: 800, category: 'Skin Care', gender: 'Female' },
    { name: 'Sara Facial', price: 1500, category: 'Skin Care', gender: 'Female' },
    { name: 'Sara Clean-Up', price: 900, category: 'Skin Care', gender: 'Female' },
    { name: 'D-Tan Facial', price: 1500, category: 'Skin Care', gender: 'Female' },
    { name: 'D-Tan Clean-Up', price: 1000, category: 'Skin Care', gender: 'Female' },
    { name: 'Raga Facial', price: 2000, category: 'Skin Care', gender: 'Female' },
    { name: 'Raga Clean-Up', price: 1350, category: 'Skin Care', gender: 'Female' },
    { name: 'O3+ Facial', price: 2000, category: 'Skin Care', gender: 'Female' },
    { name: 'O3+ Clean-Up', price: 1250, category: 'Skin Care', gender: 'Female' },
    { name: 'Korean Glass Facial', price: 2500, category: 'Skin Care', gender: 'Female' },
    { name: 'Korean Glass Clean-Up', price: 1800, category: 'Skin Care', gender: 'Female' },

    // Male Facials (Assuming same price)
    { name: 'Fruit Facial', price: 800, category: 'Skin Care', gender: 'Male' },
    { name: 'Fruit Clean-Up', price: 500, category: 'Skin Care', gender: 'Male' },
    { name: 'Diamond Facial', price: 1200, category: 'Skin Care', gender: 'Male' },
    { name: 'Diamond Clean-Up', price: 800, category: 'Skin Care', gender: 'Male' },
    { name: 'Wine Facial', price: 1200, category: 'Skin Care', gender: 'Male' },
    { name: 'Wine Clean-Up', price: 800, category: 'Skin Care', gender: 'Male' },
    { name: 'Vitamin-C Facial', price: 1200, category: 'Skin Care', gender: 'Male' },
    { name: 'Vitamin-C Clean-Up', price: 800, category: 'Skin Care', gender: 'Male' },
    { name: 'Sara Facial', price: 1500, category: 'Skin Care', gender: 'Male' },
    { name: 'Sara Clean-Up', price: 900, category: 'Skin Care', gender: 'Male' },
    { name: 'D-Tan Facial', price: 1500, category: 'Skin Care', gender: 'Male' },
    { name: 'D-Tan Clean-Up', price: 1000, category: 'Skin Care', gender: 'Male' },
    { name: 'Raga Facial', price: 2000, category: 'Skin Care', gender: 'Male' },
    { name: 'Raga Clean-Up', price: 1350, category: 'Skin Care', gender: 'Male' },
    { name: 'O3+ Facial', price: 2000, category: 'Skin Care', gender: 'Male' },
    { name: 'O3+ Clean-Up', price: 1250, category: 'Skin Care', gender: 'Male' },
    { name: 'Korean Glass Facial', price: 2500, category: 'Skin Care', gender: 'Male' },
    { name: 'Korean Glass Clean-Up', price: 1800, category: 'Skin Care', gender: 'Male' },

    // --- THREADING ---
    { name: 'Eyebrows Threading', price: 50, category: 'Threading', gender: 'Female' },
    { name: 'Upperlips Threading', price: 30, category: 'Threading', gender: 'Female' },
    { name: 'Forehead Threading', price: 30, category: 'Threading', gender: 'Female' },
    { name: 'Chin Threading', price: 30, category: 'Threading', gender: 'Female' },
    // Male Threading
    { name: 'Eyebrows Threading', price: 50, category: 'Threading', gender: 'Male' },

    // --- FACE WAXING ---
    { name: 'Eyebrows Wax', price: 150, category: 'Face Waxing', gender: 'Female' },
    { name: 'Upperlips Wax', price: 50, category: 'Face Waxing', gender: 'Female' },
    { name: 'Forehead Wax', price: 60, category: 'Face Waxing', gender: 'Female' },
    { name: 'Chin Wax', price: 50, category: 'Face Waxing', gender: 'Female' },
    { name: 'Side Locks Wax', price: 150, category: 'Face Waxing', gender: 'Female' },
    { name: 'Full Face Wax', price: 300, category: 'Face Waxing', gender: 'Female' },

    // --- D-TAN & BLEACH ---
    { name: 'Face D-Tan', price: 500, category: 'D-Tan', gender: 'Female' },
    { name: 'Face Bleach', price: 400, category: 'Bleach', gender: 'Female' },
    { name: 'Full Arms D-Tan', price: 700, category: 'D-Tan', gender: 'Female' },
    { name: 'Full Arms Bleach', price: 500, category: 'Bleach', gender: 'Female' },
    { name: 'Half Arms D-Tan', price: 350, category: 'D-Tan', gender: 'Female' },
    { name: 'Half Arms Bleach', price: 250, category: 'Bleach', gender: 'Female' },
    { name: 'Neck D-Tan', price: 250, category: 'D-Tan', gender: 'Female' },
    { name: 'Neck Bleach', price: 200, category: 'Bleach', gender: 'Female' },
    { name: 'Half Legs D-Tan', price: 350, category: 'D-Tan', gender: 'Female' },
    { name: 'Half Legs Bleach', price: 250, category: 'Bleach', gender: 'Female' },
    { name: 'Full Body D-Tan', price: 2200, category: 'D-Tan', gender: 'Female' },
    { name: 'Full Body Bleach', price: 1500, category: 'Bleach', gender: 'Female' },
    { name: 'Body Polishing', price: 3000, category: 'Body Polishing', gender: 'Female' },

    // Male D-Tan (Selected)
    { name: 'Face D-Tan', price: 500, category: 'D-Tan', gender: 'Male' },
    { name: 'Face Bleach', price: 400, category: 'Bleach', gender: 'Male' },
    { name: 'Neck D-Tan', price: 250, category: 'D-Tan', gender: 'Male' },

    // --- BODY WAXING (Female Only usually, but adding structure) ---
    // Normal
    { name: 'Full Arms Wax (Normal)', price: 250, category: 'Waxing', gender: 'Female' },
    { name: 'Full Legs Wax (Normal)', price: 350, category: 'Waxing', gender: 'Female' },
    { name: 'Half Legs Wax (Normal)', price: 175, category: 'Waxing', gender: 'Female' },
    { name: 'Half Arms Wax (Normal)', price: 130, category: 'Waxing', gender: 'Female' },
    { name: 'Underarms Wax (Normal)', price: 80, category: 'Waxing', gender: 'Female' },
    { name: 'Back Wax (Normal)', price: 350, category: 'Waxing', gender: 'Female' },
    { name: 'Stomach Wax (Normal)', price: 250, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Wax (Normal)', price: 700, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Line Wax (Normal)', price: 150, category: 'Waxing', gender: 'Female' },
    { name: 'Full Body Wax (Normal)', price: 1500, category: 'Waxing', gender: 'Female' },

    // White Chocolate
    { name: 'Full Arms Wax (White Choc)', price: 300, category: 'Waxing', gender: 'Female' },
    { name: 'Full Legs Wax (White Choc)', price: 450, category: 'Waxing', gender: 'Female' },
    { name: 'Half Legs Wax (White Choc)', price: 250, category: 'Waxing', gender: 'Female' },
    { name: 'Half Arms Wax (White Choc)', price: 200, category: 'Waxing', gender: 'Female' },
    { name: 'Underarms Wax (White Choc)', price: 100, category: 'Waxing', gender: 'Female' },
    { name: 'Back Wax (White Choc)', price: 500, category: 'Waxing', gender: 'Female' },
    { name: 'Stomach Wax (White Choc)', price: 400, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Wax (White Choc)', price: 900, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Line Wax (White Choc)', price: 200, category: 'Waxing', gender: 'Female' },
    { name: 'Full Body Wax (White Choc)', price: 1800, category: 'Waxing', gender: 'Female' },

    // Rica
    { name: 'Full Arms Wax (Rica)', price: 500, category: 'Waxing', gender: 'Female' },
    { name: 'Full Legs Wax (Rica)', price: 700, category: 'Waxing', gender: 'Female' },
    { name: 'Half Legs Wax (Rica)', price: 350, category: 'Waxing', gender: 'Female' },
    { name: 'Half Arms Wax (Rica)', price: 250, category: 'Waxing', gender: 'Female' },
    { name: 'Underarms Wax (Rica)', price: 150, category: 'Waxing', gender: 'Female' },
    { name: 'Back Wax (Rica)', price: 600, category: 'Waxing', gender: 'Female' },
    { name: 'Stomach Wax (Rica)', price: 550, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Wax (Rica)', price: 1200, category: 'Waxing', gender: 'Female' },
    { name: 'Bikini Line Wax (Rica)', price: 300, category: 'Waxing', gender: 'Female' },
    { name: 'Full Body Wax (Rica)', price: 2500, category: 'Waxing', gender: 'Female' },

    // --- HAIR SERVICES ---
    { name: 'Hair Wash', price: 250, category: 'Hair', gender: 'Female' },
    { name: 'Hair Wash (Blow-dry)', price: 350, category: 'Hair', gender: 'Female' },
    { name: 'Head Massage (With Oil)', price: 400, category: 'Hair', gender: 'Female' },
    { name: 'Curls', price: 700, category: 'Hair', gender: 'Female' },
    { name: 'Ironing', price: 700, category: 'Hair', gender: 'Female' },
    { name: 'Hair Cut', price: 500, category: 'Hair', gender: 'Female' },
    { name: 'Hair Cut (With Wash)', price: 750, category: 'Hair', gender: 'Female' },

    // Male Hair
    { name: 'Hair Wash', price: 250, category: 'Hair', gender: 'Male' },
    { name: 'Head Massage (With Oil)', price: 400, category: 'Hair', gender: 'Male' },
    { name: 'Hair Cut', price: 300, category: 'Hair', gender: 'Male' }, // Adjusted price estimate for male
    { name: 'Hair Cut (With Wash)', price: 450, category: 'Hair', gender: 'Male' }, // Adjusted

    // --- HAIR TREATMENTS ---
    { name: 'Hair Spa (L\'Oréal)', price: 750, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Hair Spa (Kenpeki)', price: 1500, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Keratin', price: 3000, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Botox', price: 3500, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Kerasmooth', price: 4000, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Keraborox', price: 4000, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Smoothening', price: 4000, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Global Color', price: 3000, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Highlights', price: 3500, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Balayage', price: 4500, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Touch-up', price: 1200, category: 'Hair Treatment', gender: 'Female' },
    { name: 'Olaplex', price: 5000, category: 'Hair Treatment', gender: 'Female' },

    // Male Hair Treatments
    { name: 'Hair Spa (L\'Oréal)', price: 750, category: 'Hair Treatment', gender: 'Male' },
    { name: 'Hair Spa (Kenpeki)', price: 1500, category: 'Hair Treatment', gender: 'Male' },
    { name: 'Keratin', price: 2000, category: 'Hair Treatment', gender: 'Male' }, // Adjusted
    { name: 'Global Color', price: 1500, category: 'Hair Treatment', gender: 'Male' }, // Adjusted

    // --- MANICURE ---
    { name: 'Regular Manicure', price: 500, category: 'Manicure', gender: 'Female' },
    { name: 'Spa Manicure', price: 1000, category: 'Manicure', gender: 'Female' },
    { name: 'Crystal Manicure', price: 1200, category: 'Manicure', gender: 'Female' },
    { name: 'Luxury Manicure', price: 1500, category: 'Manicure', gender: 'Female' },

    // Male Manicure
    { name: 'Regular Manicure', price: 500, category: 'Manicure', gender: 'Male' },
    { name: 'Spa Manicure', price: 1000, category: 'Manicure', gender: 'Male' },

    // --- PEDICURE ---
    { name: 'Regular Pedicure', price: 500, category: 'Pedicure', gender: 'Female' },
    { name: 'Spa Pedicure', price: 1000, category: 'Pedicure', gender: 'Female' },
    { name: 'Crystal Pedicure', price: 1200, category: 'Pedicure', gender: 'Female' },
    { name: 'Luxury Pedicure', price: 1500, category: 'Pedicure', gender: 'Female' },
    { name: 'Foot Massage', price: 400, category: 'Pedicure', gender: 'Female' },

    // Male Pedicure
    { name: 'Regular Pedicure', price: 500, category: 'Pedicure', gender: 'Male' },
    { name: 'Spa Pedicure', price: 1000, category: 'Pedicure', gender: 'Male' },
    { name: 'Foot Massage', price: 400, category: 'Pedicure', gender: 'Male' },
];

async function main() {
    console.log('Start seeding services...');

    // Optional: Clear existing services if you want a fresh start
    // await prisma.service.deleteMany({});

    for (const service of servicesData) {
        await prisma.service.create({
            data: {
                name: service.name,
                price: service.price,
                category: service.category,
                gender: service.gender,
                duration: 30 // Default duration
            }
        });
    }

    console.log(`Seeded ${servicesData.length} services.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
