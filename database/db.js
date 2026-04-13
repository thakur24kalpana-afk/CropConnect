const Database = require('better-sqlite3');
const path = require('path');

function insertAllCrops() {
  try {
    // Connect to database (creates file if not exists)
    const db = new Database(path.join(__dirname, 'cropconnect.db'));
    
    console.log('✅ Database connected with better-sqlite3');

    // Drop existing table and recreate
    db.exec(`
      DROP TABLE IF EXISTS crops;
      CREATE TABLE crops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT DEFAULT 'quintal',
        farmer TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT DEFAULT 'grains',
        image TEXT,
        lat REAL DEFAULT 28.6139,
        lng REAL DEFAULT 77.2090,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table created successfully');

    // Insert all 28 crops
    const crops = [
      // 🌾 GRAINS
      { name: 'Wheat', price: 2200, quantity: 500, farmer: 'Rajesh Kumar', location: 'Ludhiana, Punjab', category: 'grains', image: 'https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg' },
      { name: 'Rice', price: 3100, quantity: 1000, farmer: 'Sukhwinder Singh', location: 'Amritsar, Punjab', category: 'grains', image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg' },
      { name: 'Corn', price: 1800, quantity: 750, farmer: 'Amit Patel', location: 'Varanasi, UP', category: 'grains', image: 'https://images.pexels.com/photos/5473170/pexels-photo-5473170.jpeg' },
      { name: 'Barley', price: 1900, quantity: 300, farmer: 'Harpreet Singh', location: 'Hapur, UP', category: 'grains', image: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg' },
      { name: 'Millet', price: 2600, quantity: 150, farmer: 'Ramesh Rathod', location: 'Jaipur, Rajasthan', category: 'grains', image: 'https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg' },
      
      // 🌱 PULSES
      { name: 'Soybean', price: 4200, quantity: 200, farmer: 'Priya Sharma', location: 'Indore, MP', category: 'pulses', image: 'https://images.pexels.com/photos/3843088/pexels-photo-3843088.jpeg' },
      { name: 'Green Gram (Moong)', price: 6500, quantity: 120, farmer: 'Vikram Yadav', location: 'Jhansi, UP', category: 'pulses', image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg' },
      { name: 'Black Gram (Urad)', price: 5800, quantity: 80, farmer: 'Lakhan Singh', location: 'Sagar, MP', category: 'pulses', image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg' },
      { name: 'Chickpea (Chana)', price: 5200, quantity: 250, farmer: 'Rafiq Ahmed', location: 'Akola, Maharashtra', category: 'pulses', image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg' },
      { name: 'Pigeon Pea (Arhar)', price: 6000, quantity: 90, farmer: 'Shyam Behari', location: 'Gulbarga, Karnataka', category: 'pulses', image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg' },
      
      // 🥬 VEGETABLES
      { name: 'Potato', price: 1200, quantity: 800, farmer: 'Chhotelal Gupta', location: 'Agra, UP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Onion', price: 1800, quantity: 600, farmer: 'Dnyaneshwar Patil', location: 'Nashik, Maharashtra', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Tomato', price: 1500, quantity: 300, farmer: 'Krishnappa Gowda', location: 'Kolar, Karnataka', category: 'vegetables', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
      { name: 'Cauliflower', price: 2200, quantity: 150, farmer: 'Hari Ram', location: 'Kullu, HP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Cabbage', price: 1400, quantity: 200, farmer: 'Mangal Singh', location: 'Nasik, Maharashtra', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Brinjal (Eggplant)', price: 1600, quantity: 100, farmer: 'Shakuntala Devi', location: 'Haveri, Karnataka', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Okra (Bhindi)', price: 2800, quantity: 80, farmer: 'Ramprasad Yadav', location: 'Varanasi, UP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Green Chili', price: 3500, quantity: 50, farmer: 'Krishna Murthy', location: 'Guntur, AP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Spinach (Palak)', price: 1200, quantity: 40, farmer: 'Suresh Rathore', location: 'Jaipur, Rajasthan', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Carrot', price: 1900, quantity: 70, farmer: 'Tashi Dorjee', location: 'Ooty, TN', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Radish', price: 1100, quantity: 60, farmer: 'Gopal Das', location: 'Allahabad, UP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Pumpkin', price: 1300, quantity: 120, farmer: 'Laxmi Bai', location: 'Raipur, Chhattisgarh', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Bitter Gourd (Karela)', price: 3000, quantity: 30, farmer: 'Ravi Shankar', location: 'Varanasi, UP', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      { name: 'Bottle Gourd (Lauki)', price: 1200, quantity: 80, farmer: 'Sitaram Gupta', location: 'Patna, Bihar', category: 'vegetables', image: 'https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg' },
      
      // 🍎 FRUITS
      { name: 'Banana', price: 2500, quantity: 400, farmer: 'Kannan Raj', location: 'Thanjavur, TN', category: 'fruits', image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg' },
      { name: 'Mango', price: 5500, quantity: 150, farmer: 'Abdul Khan', location: 'Lucknow, UP', category: 'fruits', image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg' },
      { name: 'Orange', price: 4500, quantity: 120, farmer: 'Santosh Warghade', location: 'Nagpur, Maharashtra', category: 'fruits', image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg' },
      { name: 'Apple', price: 8000, quantity: 80, farmer: 'Mohinder Singh', location: 'Shimla, HP', category: 'fruits', image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg' }
    ];

    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT INTO crops (name, price, quantity, farmer, location, category, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Insert each crop
    for (const crop of crops) {
      insertStmt.run(crop.name, crop.price, crop.quantity, crop.farmer, crop.location, crop.category, crop.image);
      console.log(`✅ Inserted: ${crop.name}`);
    }

    console.log(`🎉 Total ${crops.length} crops inserted successfully!`);

    // Verify count
    const count = db.prepare('SELECT COUNT(*) as count FROM crops').get();
    console.log(`📊 Total crops in database: ${count.count}`);

    // Close database
    db.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
insertAllCrops();