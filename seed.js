require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const products = [
  {
    "name": "Wireless Earbuds",
    "description": "Wireless Earbuds from Samsung. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "wireless",
      "earbuds",
      "electronics"
    ],
    "price": 42.24,
    "stock": 22,
    "brand": "Samsung"
  },
  {
    "name": "Bluetooth Speaker",
    "description": "Bluetooth Speaker from Anker. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "bluetooth",
      "speaker",
      "electronics"
    ],
    "price": 56.78,
    "stock": 52,
    "brand": "Anker"
  },
  {
    "name": "4K Action Camera",
    "description": "4K Action Camera from Samsung. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "action",
      "camera",
      "electronics"
    ],
    "price": 198.26,
    "stock": 39,
    "brand": "Samsung"
  },
  {
    "name": "Smartwatch",
    "description": "Smartwatch from Samsung. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "smartwatch",
      "electronics"
    ],
    "price": 201.71,
    "stock": 7,
    "brand": "Samsung"
  },
  {
    "name": "Laptop Stand",
    "description": "Laptop Stand from Sony. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "laptop",
      "stand",
      "electronics"
    ],
    "price": 22.8,
    "stock": 19,
    "brand": "Sony"
  },
  {
    "name": "Mechanical Keyboard",
    "description": "Mechanical Keyboard from Asus. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "mechanical",
      "keyboard",
      "electronics"
    ],
    "price": 116.21,
    "stock": 40,
    "brand": "Asus"
  },
  {
    "name": "Wireless Mouse",
    "description": "Wireless Mouse from Anker. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "wireless",
      "mouse",
      "electronics"
    ],
    "price": 47.21,
    "stock": 49,
    "brand": "Anker"
  },
  {
    "name": "USB-C Charging Cable",
    "description": "USB-C Charging Cable from Asus. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "usb",
      "charging",
      "cable",
      "electronics"
    ],
    "price": 13.02,
    "stock": 33,
    "brand": "Asus"
  },
  {
    "name": "Portable Power Bank",
    "description": "Portable Power Bank from Razer. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "portable",
      "power",
      "bank",
      "electronics"
    ],
    "price": 33.9,
    "stock": 60,
    "brand": "Razer"
  },
  {
    "name": "Noise Cancelling Headphones",
    "description": "Noise Cancelling Headphones from Sony. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "noise",
      "cancelling",
      "headphones",
      "electronics"
    ],
    "price": 246.93,
    "stock": 15,
    "brand": "Sony"
  },
  {
    "name": "Webcam HD 1080p",
    "description": "Webcam HD 1080p from Dell. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "webcam",
      "1080p",
      "electronics"
    ],
    "price": 47.11,
    "stock": 14,
    "brand": "Dell"
  },
  {
    "name": "Gaming Controller",
    "description": "Gaming Controller from Anker. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "gaming",
      "controller",
      "electronics"
    ],
    "price": 78.06,
    "stock": 26,
    "brand": "Anker"
  },
  {
    "name": "External SSD 500GB",
    "description": "External SSD 500GB from Samsung. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "external",
      "ssd",
      "500gb",
      "electronics"
    ],
    "price": 56.48,
    "stock": 11,
    "brand": "Samsung"
  },
  {
    "name": "Wireless Charger Pad",
    "description": "Wireless Charger Pad from Bose. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "wireless",
      "charger",
      "pad",
      "electronics"
    ],
    "price": 31.63,
    "stock": 43,
    "brand": "Bose"
  },
  {
    "name": "Smart Light Bulb",
    "description": "Smart Light Bulb from JBL. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "smart",
      "light",
      "bulb",
      "electronics"
    ],
    "price": 22.1,
    "stock": 51,
    "brand": "JBL"
  },
  {
    "name": "Mini Projector",
    "description": "Mini Projector from HP. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "mini",
      "projector",
      "electronics"
    ],
    "price": 139.7,
    "stock": 29,
    "brand": "HP"
  },
  {
    "name": "Bluetooth Car Adapter",
    "description": "Bluetooth Car Adapter from Samsung. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "bluetooth",
      "car",
      "adapter",
      "electronics"
    ],
    "price": 21.03,
    "stock": 58,
    "brand": "Samsung"
  },
  {
    "name": "Fitness Tracker Band",
    "description": "Fitness Tracker Band from Razer. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "fitness",
      "tracker",
      "band",
      "electronics"
    ],
    "price": 73.69,
    "stock": 28,
    "brand": "Razer"
  },
  {
    "name": "Monitor Stand Riser",
    "description": "Monitor Stand Riser from Razer. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "monitor",
      "stand",
      "riser",
      "electronics"
    ],
    "price": 19.8,
    "stock": 9,
    "brand": "Razer"
  },
  {
    "name": "HDMI Splitter",
    "description": "HDMI Splitter from Sony. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "hdmi",
      "splitter",
      "electronics"
    ],
    "price": 24.23,
    "stock": 54,
    "brand": "Sony"
  },
  {
    "name": "Ring Light with Tripod",
    "description": "Ring Light with Tripod from JBL. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "ring",
      "light",
      "with",
      "electronics"
    ],
    "price": 49.55,
    "stock": 59,
    "brand": "JBL"
  },
  {
    "name": "Wireless Keyboard and Mouse Combo",
    "description": "Wireless Keyboard and Mouse Combo from Anker. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "wireless",
      "keyboard",
      "and",
      "electronics"
    ],
    "price": 64.65,
    "stock": 29,
    "brand": "Anker"
  },
  {
    "name": "Smart Plug",
    "description": "Smart Plug from JBL. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "smart",
      "plug",
      "electronics"
    ],
    "price": 14.52,
    "stock": 58,
    "brand": "JBL"
  },
  {
    "name": "Portable Bluetooth Printer",
    "description": "Portable Bluetooth Printer from Bose. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "portable",
      "bluetooth",
      "printer",
      "electronics"
    ],
    "price": 63.0,
    "stock": 27,
    "brand": "Bose"
  },
  {
    "name": "Laptop Cooling Pad",
    "description": "Laptop Cooling Pad from Anker. A quality addition to our electronics collection, designed for everyday reliability.",
    "category": "electronics",
    "tags": [
      "laptop",
      "cooling",
      "pad",
      "electronics"
    ],
    "price": 32.73,
    "stock": 49,
    "brand": "Anker"
  },
  {
    "name": "Classic Denim Jacket",
    "description": "Classic Denim Jacket from Adidas. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "classic",
      "denim",
      "jacket",
      "fashion"
    ],
    "price": 70.05,
    "stock": 9,
    "brand": "Adidas"
  },
  {
    "name": "Running Sneakers",
    "description": "Running Sneakers from H&M. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "running",
      "sneakers",
      "fashion"
    ],
    "price": 122.17,
    "stock": 41,
    "brand": "H&M"
  },
  {
    "name": "Leather Crossbody Bag",
    "description": "Leather Crossbody Bag from Adidas. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "leather",
      "crossbody",
      "bag",
      "fashion"
    ],
    "price": 59.44,
    "stock": 36,
    "brand": "Adidas"
  },
  {
    "name": "Wool Blend Sweater",
    "description": "Wool Blend Sweater from Fossil. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "wool",
      "blend",
      "sweater",
      "fashion"
    ],
    "price": 74.22,
    "stock": 46,
    "brand": "Fossil"
  },
  {
    "name": "Slim Fit Chinos",
    "description": "Slim Fit Chinos from Gap. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "slim",
      "fit",
      "chinos",
      "fashion"
    ],
    "price": 29.99,
    "stock": 13,
    "brand": "Gap"
  },
  {
    "name": "Graphic Print T-Shirt",
    "description": "Graphic Print T-Shirt from H&M. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "graphic",
      "print",
      "shirt",
      "fashion"
    ],
    "price": 25.65,
    "stock": 39,
    "brand": "H&M"
  },
  {
    "name": "Bomber Jacket",
    "description": "Bomber Jacket from Uniqlo. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "bomber",
      "jacket",
      "fashion"
    ],
    "price": 86.08,
    "stock": 32,
    "brand": "Uniqlo"
  },
  {
    "name": "Canvas Tote Bag",
    "description": "Canvas Tote Bag from Reebok. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "canvas",
      "tote",
      "bag",
      "fashion"
    ],
    "price": 22.98,
    "stock": 19,
    "brand": "Reebok"
  },
  {
    "name": "Ankle Boots",
    "description": "Ankle Boots from Zara. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "ankle",
      "boots",
      "fashion"
    ],
    "price": 80.75,
    "stock": 10,
    "brand": "Zara"
  },
  {
    "name": "Striped Polo Shirt",
    "description": "Striped Polo Shirt from Levi's. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "striped",
      "polo",
      "shirt",
      "fashion"
    ],
    "price": 37.21,
    "stock": 14,
    "brand": "Levi's"
  },
  {
    "name": "Maxi Summer Dress",
    "description": "Maxi Summer Dress from Zara. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "maxi",
      "summer",
      "dress",
      "fashion"
    ],
    "price": 61.67,
    "stock": 32,
    "brand": "Zara"
  },
  {
    "name": "Straight Leg Jeans",
    "description": "Straight Leg Jeans from Reebok. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "straight",
      "leg",
      "jeans",
      "fashion"
    ],
    "price": 37.85,
    "stock": 29,
    "brand": "Reebok"
  },
  {
    "name": "Puffer Vest",
    "description": "Puffer Vest from Reebok. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "puffer",
      "vest",
      "fashion"
    ],
    "price": 89.8,
    "stock": 38,
    "brand": "Reebok"
  },
  {
    "name": "Baseball Cap",
    "description": "Baseball Cap from Uniqlo. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "baseball",
      "cap",
      "fashion"
    ],
    "price": 24.56,
    "stock": 60,
    "brand": "Uniqlo"
  },
  {
    "name": "Leather Belt",
    "description": "Leather Belt from Levi's. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "leather",
      "belt",
      "fashion"
    ],
    "price": 32.0,
    "stock": 12,
    "brand": "Levi's"
  },
  {
    "name": "Hooded Sweatshirt",
    "description": "Hooded Sweatshirt from Puma. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "hooded",
      "sweatshirt",
      "fashion"
    ],
    "price": 47.52,
    "stock": 54,
    "brand": "Puma"
  },
  {
    "name": "Silk Scarf",
    "description": "Silk Scarf from Adidas. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "silk",
      "scarf",
      "fashion"
    ],
    "price": 15.44,
    "stock": 32,
    "brand": "Adidas"
  },
  {
    "name": "Aviator Sunglasses",
    "description": "Aviator Sunglasses from Zara. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "aviator",
      "sunglasses",
      "fashion"
    ],
    "price": 38.14,
    "stock": 51,
    "brand": "Zara"
  },
  {
    "name": "Formal Dress Shirt",
    "description": "Formal Dress Shirt from Uniqlo. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "formal",
      "dress",
      "shirt",
      "fashion"
    ],
    "price": 54.15,
    "stock": 53,
    "brand": "Uniqlo"
  },
  {
    "name": "Track Jacket",
    "description": "Track Jacket from Zara. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "track",
      "jacket",
      "fashion"
    ],
    "price": 50.3,
    "stock": 11,
    "brand": "Zara"
  },
  {
    "name": "Knit Beanie",
    "description": "Knit Beanie from Uniqlo. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "knit",
      "beanie",
      "fashion"
    ],
    "price": 18.09,
    "stock": 37,
    "brand": "Uniqlo"
  },
  {
    "name": "Cargo Shorts",
    "description": "Cargo Shorts from Reebok. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "cargo",
      "shorts",
      "fashion"
    ],
    "price": 24.96,
    "stock": 28,
    "brand": "Reebok"
  },
  {
    "name": "Wrap Cardigan",
    "description": "Wrap Cardigan from Zara. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "wrap",
      "cardigan",
      "fashion"
    ],
    "price": 37.55,
    "stock": 54,
    "brand": "Zara"
  },
  {
    "name": "Leather Wallet",
    "description": "Leather Wallet from Puma. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "leather",
      "wallet",
      "fashion"
    ],
    "price": 42.79,
    "stock": 43,
    "brand": "Puma"
  },
  {
    "name": "Yoga Leggings",
    "description": "Yoga Leggings from Adidas. A quality addition to our fashion collection, designed for everyday reliability.",
    "category": "fashion",
    "tags": [
      "yoga",
      "leggings",
      "fashion"
    ],
    "price": 32.21,
    "stock": 12,
    "brand": "Adidas"
  },
  {
    "name": "Ceramic Table Lamp",
    "description": "Ceramic Table Lamp from OXO. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "ceramic",
      "table",
      "lamp",
      "home"
    ],
    "price": 67.86,
    "stock": 15,
    "brand": "OXO"
  },
  {
    "name": "Memory Foam Pillow",
    "description": "Memory Foam Pillow from Rubbermaid. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "memory",
      "foam",
      "pillow",
      "home"
    ],
    "price": 35.82,
    "stock": 43,
    "brand": "Rubbermaid"
  },
  {
    "name": "4-Piece Cookware Set",
    "description": "4-Piece Cookware Set from Casper. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "piece",
      "cookware",
      "set",
      "home"
    ],
    "price": 146.78,
    "stock": 39,
    "brand": "Casper"
  },
  {
    "name": "Cotton Throw Blanket",
    "description": "Cotton Throw Blanket from Anchor Hocking. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "cotton",
      "throw",
      "blanket",
      "home"
    ],
    "price": 37.81,
    "stock": 30,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Storage Ottoman",
    "description": "Storage Ottoman from Threshold. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "storage",
      "ottoman",
      "home"
    ],
    "price": 66.28,
    "stock": 38,
    "brand": "Threshold"
  },
  {
    "name": "Wall Clock Minimalist",
    "description": "Wall Clock Minimalist from OXO. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "wall",
      "clock",
      "minimalist",
      "home"
    ],
    "price": 18.02,
    "stock": 19,
    "brand": "OXO"
  },
  {
    "name": "Scented Candle Set",
    "description": "Scented Candle Set from Tefal. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "scented",
      "candle",
      "set",
      "home"
    ],
    "price": 18.74,
    "stock": 42,
    "brand": "Tefal"
  },
  {
    "name": "Bamboo Cutting Board",
    "description": "Bamboo Cutting Board from Simplehuman. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "bamboo",
      "cutting",
      "board",
      "home"
    ],
    "price": 19.59,
    "stock": 19,
    "brand": "Simplehuman"
  },
  {
    "name": "Area Rug 5x7",
    "description": "Area Rug 5x7 from IKEA. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "area",
      "rug",
      "5x7",
      "home"
    ],
    "price": 57.09,
    "stock": 45,
    "brand": "IKEA"
  },
  {
    "name": "Glass Vase Set",
    "description": "Glass Vase Set from IKEA. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "glass",
      "vase",
      "set",
      "home"
    ],
    "price": 25.71,
    "stock": 7,
    "brand": "IKEA"
  },
  {
    "name": "Bathroom Storage Shelf",
    "description": "Bathroom Storage Shelf from Threshold. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "bathroom",
      "storage",
      "shelf",
      "home"
    ],
    "price": 27.47,
    "stock": 20,
    "brand": "Threshold"
  },
  {
    "name": "Wooden Coat Rack",
    "description": "Wooden Coat Rack from Rubbermaid. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "wooden",
      "coat",
      "rack",
      "home"
    ],
    "price": 56.75,
    "stock": 18,
    "brand": "Rubbermaid"
  },
  {
    "name": "Bedding Set Queen",
    "description": "Bedding Set Queen from Simplehuman. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "bedding",
      "set",
      "queen",
      "home"
    ],
    "price": 47.93,
    "stock": 41,
    "brand": "Simplehuman"
  },
  {
    "name": "Kitchen Utensil Holder",
    "description": "Kitchen Utensil Holder from West Elm. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "kitchen",
      "utensil",
      "holder",
      "home"
    ],
    "price": 21.03,
    "stock": 55,
    "brand": "West Elm"
  },
  {
    "name": "Laundry Hamper",
    "description": "Laundry Hamper from OXO. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "laundry",
      "hamper",
      "home"
    ],
    "price": 35.75,
    "stock": 17,
    "brand": "OXO"
  },
  {
    "name": "Decorative Throw Pillow Covers",
    "description": "Decorative Throw Pillow Covers from Tefal. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "decorative",
      "throw",
      "pillow",
      "home"
    ],
    "price": 14.64,
    "stock": 32,
    "brand": "Tefal"
  },
  {
    "name": "Floating Wall Shelves",
    "description": "Floating Wall Shelves from Threshold. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "floating",
      "wall",
      "shelves",
      "home"
    ],
    "price": 32.7,
    "stock": 34,
    "brand": "Threshold"
  },
  {
    "name": "Air Purifier Compact",
    "description": "Air Purifier Compact from IKEA. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "air",
      "purifier",
      "compact",
      "home"
    ],
    "price": 120.59,
    "stock": 46,
    "brand": "IKEA"
  },
  {
    "name": "Curtain Panels Set",
    "description": "Curtain Panels Set from Tefal. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "curtain",
      "panels",
      "set",
      "home"
    ],
    "price": 27.11,
    "stock": 51,
    "brand": "Tefal"
  },
  {
    "name": "Non-Slip Bath Mat",
    "description": "Non-Slip Bath Mat from Threshold. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "non",
      "slip",
      "bath",
      "home"
    ],
    "price": 26.6,
    "stock": 11,
    "brand": "Threshold"
  },
  {
    "name": "Dinnerware Set 16-Piece",
    "description": "Dinnerware Set 16-Piece from Anchor Hocking. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "dinnerware",
      "set",
      "piece",
      "home"
    ],
    "price": 55.53,
    "stock": 39,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Storage Baskets Set of 3",
    "description": "Storage Baskets Set of 3 from OXO. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "storage",
      "baskets",
      "set",
      "home"
    ],
    "price": 23.49,
    "stock": 16,
    "brand": "OXO"
  },
  {
    "name": "LED Desk Lamp",
    "description": "LED Desk Lamp from Rubbermaid. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "led",
      "desk",
      "lamp",
      "home"
    ],
    "price": 30.48,
    "stock": 60,
    "brand": "Rubbermaid"
  },
  {
    "name": "Mattress Protector",
    "description": "Mattress Protector from Tefal. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "mattress",
      "protector",
      "home"
    ],
    "price": 40.5,
    "stock": 60,
    "brand": "Tefal"
  },
  {
    "name": "Wall Mirror Round",
    "description": "Wall Mirror Round from Simplehuman. A quality addition to our home & living collection, designed for everyday reliability.",
    "category": "home & living",
    "tags": [
      "wall",
      "mirror",
      "round",
      "home"
    ],
    "price": 34.89,
    "stock": 46,
    "brand": "Simplehuman"
  },
  {
    "name": "Vitamin C Serum",
    "description": "Vitamin C Serum from Nivea. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "vitamin",
      "serum",
      "beauty"
    ],
    "price": 20.69,
    "stock": 49,
    "brand": "Nivea"
  },
  {
    "name": "Matte Lipstick Set",
    "description": "Matte Lipstick Set from Olay. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "matte",
      "lipstick",
      "set",
      "beauty"
    ],
    "price": 24.24,
    "stock": 36,
    "brand": "Olay"
  },
  {
    "name": "Hair Dryer Pro",
    "description": "Hair Dryer Pro from Dyson. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "hair",
      "dryer",
      "pro",
      "beauty"
    ],
    "price": 51.38,
    "stock": 18,
    "brand": "Dyson"
  },
  {
    "name": "Facial Cleansing Brush",
    "description": "Facial Cleansing Brush from The Ordinary. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "facial",
      "cleansing",
      "brush",
      "beauty"
    ],
    "price": 37.37,
    "stock": 39,
    "brand": "The Ordinary"
  },
  {
    "name": "Moisturizing Face Cream",
    "description": "Moisturizing Face Cream from The Ordinary. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "moisturizing",
      "face",
      "cream",
      "beauty"
    ],
    "price": 29.45,
    "stock": 8,
    "brand": "The Ordinary"
  },
  {
    "name": "Eyeshadow Palette",
    "description": "Eyeshadow Palette from The Ordinary. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "eyeshadow",
      "palette",
      "beauty"
    ],
    "price": 33.76,
    "stock": 37,
    "brand": "The Ordinary"
  },
  {
    "name": "Hydrating Face Mask Set",
    "description": "Hydrating Face Mask Set from Olay. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "hydrating",
      "face",
      "mask",
      "beauty"
    ],
    "price": 12.35,
    "stock": 37,
    "brand": "Olay"
  },
  {
    "name": "Hair Straightener",
    "description": "Hair Straightener from MAC. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "hair",
      "straightener",
      "beauty"
    ],
    "price": 72.56,
    "stock": 9,
    "brand": "MAC"
  },
  {
    "name": "Nail Polish Set",
    "description": "Nail Polish Set from Revlon. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "nail",
      "polish",
      "set",
      "beauty"
    ],
    "price": 10.67,
    "stock": 60,
    "brand": "Revlon"
  },
  {
    "name": "Sunscreen SPF 50",
    "description": "Sunscreen SPF 50 from Neutrogena. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "sunscreen",
      "spf",
      "beauty"
    ],
    "price": 17.24,
    "stock": 41,
    "brand": "Neutrogena"
  },
  {
    "name": "Makeup Brush Set",
    "description": "Makeup Brush Set from Neutrogena. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "makeup",
      "brush",
      "set",
      "beauty"
    ],
    "price": 29.46,
    "stock": 7,
    "brand": "Neutrogena"
  },
  {
    "name": "Micellar Cleansing Water",
    "description": "Micellar Cleansing Water from Revlon. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "micellar",
      "cleansing",
      "water",
      "beauty"
    ],
    "price": 9.89,
    "stock": 47,
    "brand": "Revlon"
  },
  {
    "name": "Hair Growth Serum",
    "description": "Hair Growth Serum from Revlon. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "hair",
      "growth",
      "serum",
      "beauty"
    ],
    "price": 34.12,
    "stock": 25,
    "brand": "Revlon"
  },
  {
    "name": "Body Lotion Shea Butter",
    "description": "Body Lotion Shea Butter from CeraVe. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "body",
      "lotion",
      "shea",
      "beauty"
    ],
    "price": 10.83,
    "stock": 50,
    "brand": "CeraVe"
  },
  {
    "name": "Perfume Eau de Parfum",
    "description": "Perfume Eau de Parfum from Maybelline. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "perfume",
      "eau",
      "parfum",
      "beauty"
    ],
    "price": 41.92,
    "stock": 30,
    "brand": "Maybelline"
  },
  {
    "name": "Eyebrow Pencil Duo",
    "description": "Eyebrow Pencil Duo from Dyson. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "eyebrow",
      "pencil",
      "duo",
      "beauty"
    ],
    "price": 14.71,
    "stock": 24,
    "brand": "Dyson"
  },
  {
    "name": "Charcoal Face Scrub",
    "description": "Charcoal Face Scrub from Nivea. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "charcoal",
      "face",
      "scrub",
      "beauty"
    ],
    "price": 14.1,
    "stock": 53,
    "brand": "Nivea"
  },
  {
    "name": "Curling Iron",
    "description": "Curling Iron from MAC. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "curling",
      "iron",
      "beauty"
    ],
    "price": 25.32,
    "stock": 44,
    "brand": "MAC"
  },
  {
    "name": "Setting Spray",
    "description": "Setting Spray from Revlon. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "setting",
      "spray",
      "beauty"
    ],
    "price": 24.94,
    "stock": 9,
    "brand": "Revlon"
  },
  {
    "name": "Retinol Night Cream",
    "description": "Retinol Night Cream from Olay. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "retinol",
      "night",
      "cream",
      "beauty"
    ],
    "price": 23.75,
    "stock": 21,
    "brand": "Olay"
  },
  {
    "name": "Lip Balm Trio",
    "description": "Lip Balm Trio from Dyson. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "lip",
      "balm",
      "trio",
      "beauty"
    ],
    "price": 14.46,
    "stock": 9,
    "brand": "Dyson"
  },
  {
    "name": "Hair Mask Deep Conditioner",
    "description": "Hair Mask Deep Conditioner from Neutrogena. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "hair",
      "mask",
      "deep",
      "beauty"
    ],
    "price": 15.53,
    "stock": 15,
    "brand": "Neutrogena"
  },
  {
    "name": "Concealer Palette",
    "description": "Concealer Palette from Nivea. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "concealer",
      "palette",
      "beauty"
    ],
    "price": 27.16,
    "stock": 50,
    "brand": "Nivea"
  },
  {
    "name": "Rose Water Toner",
    "description": "Rose Water Toner from CeraVe. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "rose",
      "water",
      "toner",
      "beauty"
    ],
    "price": 15.72,
    "stock": 56,
    "brand": "CeraVe"
  },
  {
    "name": "Electric Shaver",
    "description": "Electric Shaver from Olay. A quality addition to our beauty collection, designed for everyday reliability.",
    "category": "beauty",
    "tags": [
      "electric",
      "shaver",
      "beauty"
    ],
    "price": 30.38,
    "stock": 57,
    "brand": "Olay"
  },
  {
    "name": "Yoga Mat",
    "description": "Yoga Mat from Lululemon. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "yoga",
      "mat",
      "sports"
    ],
    "price": 36.55,
    "stock": 59,
    "brand": "Lululemon"
  },
  {
    "name": "Adjustable Dumbbell Set",
    "description": "Adjustable Dumbbell Set from Bowflex. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "adjustable",
      "dumbbell",
      "set",
      "sports"
    ],
    "price": 140.64,
    "stock": 21,
    "brand": "Bowflex"
  },
  {
    "name": "Resistance Bands Set",
    "description": "Resistance Bands Set from Nike. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "resistance",
      "bands",
      "set",
      "sports"
    ],
    "price": 14.56,
    "stock": 32,
    "brand": "Nike"
  },
  {
    "name": "Running Shoes",
    "description": "Running Shoes from Bowflex. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "running",
      "shoes",
      "sports"
    ],
    "price": 49.18,
    "stock": 26,
    "brand": "Bowflex"
  },
  {
    "name": "Insulated Water Bottle",
    "description": "Insulated Water Bottle from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "insulated",
      "water",
      "bottle",
      "sports"
    ],
    "price": 27.73,
    "stock": 21,
    "brand": "Under Armour"
  },
  {
    "name": "Foam Roller",
    "description": "Foam Roller from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "foam",
      "roller",
      "sports"
    ],
    "price": 29.81,
    "stock": 40,
    "brand": "Under Armour"
  },
  {
    "name": "Jump Rope Speed",
    "description": "Jump Rope Speed from Wilson. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "jump",
      "rope",
      "speed",
      "sports"
    ],
    "price": 13.6,
    "stock": 12,
    "brand": "Wilson"
  },
  {
    "name": "Basketball Official Size",
    "description": "Basketball Official Size from Adidas. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "basketball",
      "official",
      "size",
      "sports"
    ],
    "price": 43.62,
    "stock": 49,
    "brand": "Adidas"
  },
  {
    "name": "Gym Duffel Bag",
    "description": "Gym Duffel Bag from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "gym",
      "duffel",
      "bag",
      "sports"
    ],
    "price": 41.36,
    "stock": 58,
    "brand": "Under Armour"
  },
  {
    "name": "Cycling Gloves",
    "description": "Cycling Gloves from Fit Simplify. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "cycling",
      "gloves",
      "sports"
    ],
    "price": 22.89,
    "stock": 14,
    "brand": "Fit Simplify"
  },
  {
    "name": "Yoga Blocks Set",
    "description": "Yoga Blocks Set from Wilson. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "yoga",
      "blocks",
      "set",
      "sports"
    ],
    "price": 11.65,
    "stock": 24,
    "brand": "Wilson"
  },
  {
    "name": "Tennis Racket",
    "description": "Tennis Racket from Fit Simplify. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "tennis",
      "racket",
      "sports"
    ],
    "price": 111.91,
    "stock": 55,
    "brand": "Fit Simplify"
  },
  {
    "name": "Weightlifting Belt",
    "description": "Weightlifting Belt from Nike. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "weightlifting",
      "belt",
      "sports"
    ],
    "price": 46.96,
    "stock": 18,
    "brand": "Nike"
  },
  {
    "name": "Camping Tent 2-Person",
    "description": "Camping Tent 2-Person from Lululemon. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "camping",
      "tent",
      "person",
      "sports"
    ],
    "price": 120.01,
    "stock": 27,
    "brand": "Lululemon"
  },
  {
    "name": "Hiking Backpack 40L",
    "description": "Hiking Backpack 40L from Yeti. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "hiking",
      "backpack",
      "40l",
      "sports"
    ],
    "price": 111.88,
    "stock": 31,
    "brand": "Yeti"
  },
  {
    "name": "Fitness Gloves",
    "description": "Fitness Gloves from Reebok. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "fitness",
      "gloves",
      "sports"
    ],
    "price": 19.73,
    "stock": 20,
    "brand": "Reebok"
  },
  {
    "name": "Pull-Up Bar Doorway",
    "description": "Pull-Up Bar Doorway from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "pull",
      "bar",
      "doorway",
      "sports"
    ],
    "price": 44.4,
    "stock": 56,
    "brand": "Under Armour"
  },
  {
    "name": "Sports Sunglasses",
    "description": "Sports Sunglasses from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "sports",
      "sunglasses"
    ],
    "price": 41.79,
    "stock": 6,
    "brand": "Under Armour"
  },
  {
    "name": "Kettlebell 15lb",
    "description": "Kettlebell 15lb from Under Armour. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "kettlebell",
      "15lb",
      "sports"
    ],
    "price": 39.72,
    "stock": 26,
    "brand": "Under Armour"
  },
  {
    "name": "Golf Balls Dozen Pack",
    "description": "Golf Balls Dozen Pack from Wilson. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "golf",
      "balls",
      "dozen",
      "sports"
    ],
    "price": 31.03,
    "stock": 60,
    "brand": "Wilson"
  },
  {
    "name": "Swim Goggles",
    "description": "Swim Goggles from Lululemon. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "swim",
      "goggles",
      "sports"
    ],
    "price": 13.46,
    "stock": 55,
    "brand": "Lululemon"
  },
  {
    "name": "Soccer Ball Match Quality",
    "description": "Soccer Ball Match Quality from Adidas. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "soccer",
      "ball",
      "match",
      "sports"
    ],
    "price": 26.41,
    "stock": 7,
    "brand": "Adidas"
  },
  {
    "name": "Compression Leggings",
    "description": "Compression Leggings from Spalding. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "compression",
      "leggings",
      "sports"
    ],
    "price": 29.0,
    "stock": 57,
    "brand": "Spalding"
  },
  {
    "name": "Trekking Poles Pair",
    "description": "Trekking Poles Pair from Spalding. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "trekking",
      "poles",
      "pair",
      "sports"
    ],
    "price": 37.23,
    "stock": 57,
    "brand": "Spalding"
  },
  {
    "name": "Exercise Bike Pedal Resistance",
    "description": "Exercise Bike Pedal Resistance from Lululemon. A quality addition to our sports collection, designed for everyday reliability.",
    "category": "sports",
    "tags": [
      "exercise",
      "bike",
      "pedal",
      "sports"
    ],
    "price": 114.51,
    "stock": 47,
    "brand": "Lululemon"
  },
  {
    "name": "Stainless Steel Knife Set",
    "description": "Stainless Steel Knife Set from KitchenAid. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "stainless",
      "steel",
      "knife",
      "kitchen"
    ],
    "price": 88.53,
    "stock": 21,
    "brand": "KitchenAid"
  },
  {
    "name": "Electric Kettle",
    "description": "Electric Kettle from MasterCraft. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "electric",
      "kettle",
      "kitchen"
    ],
    "price": 23.24,
    "stock": 32,
    "brand": "MasterCraft"
  },
  {
    "name": "Blender High Speed",
    "description": "Blender High Speed from OXO. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "blender",
      "high",
      "speed",
      "kitchen"
    ],
    "price": 105.56,
    "stock": 25,
    "brand": "OXO"
  },
  {
    "name": "Non-Stick Frying Pan",
    "description": "Non-Stick Frying Pan from Lodge. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "non",
      "stick",
      "frying",
      "kitchen"
    ],
    "price": 34.36,
    "stock": 37,
    "brand": "Lodge"
  },
  {
    "name": "Stand Mixer",
    "description": "Stand Mixer from Cuisinart. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "stand",
      "mixer",
      "kitchen"
    ],
    "price": 151.62,
    "stock": 41,
    "brand": "Cuisinart"
  },
  {
    "name": "Cast Iron Skillet",
    "description": "Cast Iron Skillet from Pyrex. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "cast",
      "iron",
      "skillet",
      "kitchen"
    ],
    "price": 33.91,
    "stock": 50,
    "brand": "Pyrex"
  },
  {
    "name": "Food Storage Containers Set",
    "description": "Food Storage Containers Set from Lodge. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "food",
      "storage",
      "containers",
      "kitchen"
    ],
    "price": 20.03,
    "stock": 56,
    "brand": "Lodge"
  },
  {
    "name": "Coffee Maker Drip",
    "description": "Coffee Maker Drip from Anchor Hocking. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "coffee",
      "maker",
      "drip",
      "kitchen"
    ],
    "price": 64.33,
    "stock": 52,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Air Fryer 5.5L",
    "description": "Air Fryer 5.5L from Pyrex. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "air",
      "fryer",
      "5.5l",
      "kitchen"
    ],
    "price": 79.13,
    "stock": 9,
    "brand": "Pyrex"
  },
  {
    "name": "Cutting Board Set",
    "description": "Cutting Board Set from OXO. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "cutting",
      "board",
      "set",
      "kitchen"
    ],
    "price": 27.45,
    "stock": 47,
    "brand": "OXO"
  },
  {
    "name": "Measuring Cups and Spoons",
    "description": "Measuring Cups and Spoons from Cuisinart. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "measuring",
      "cups",
      "and",
      "kitchen"
    ],
    "price": 17.19,
    "stock": 24,
    "brand": "Cuisinart"
  },
  {
    "name": "Baking Sheet Set",
    "description": "Baking Sheet Set from Anchor Hocking. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "baking",
      "sheet",
      "set",
      "kitchen"
    ],
    "price": 21.18,
    "stock": 31,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Slow Cooker 6-Quart",
    "description": "Slow Cooker 6-Quart from OXO. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "slow",
      "cooker",
      "quart",
      "kitchen"
    ],
    "price": 53.1,
    "stock": 23,
    "brand": "OXO"
  },
  {
    "name": "Toaster 4-Slice",
    "description": "Toaster 4-Slice from Anchor Hocking. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "toaster",
      "slice",
      "kitchen"
    ],
    "price": 28.81,
    "stock": 31,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Mixing Bowls Set",
    "description": "Mixing Bowls Set from Lodge. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "mixing",
      "bowls",
      "set",
      "kitchen"
    ],
    "price": 32.89,
    "stock": 16,
    "brand": "Lodge"
  },
  {
    "name": "Silicone Baking Mats",
    "description": "Silicone Baking Mats from Zwilling. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "silicone",
      "baking",
      "mats",
      "kitchen"
    ],
    "price": 17.39,
    "stock": 30,
    "brand": "Zwilling"
  },
  {
    "name": "Cheese Grater Multi-Function",
    "description": "Cheese Grater Multi-Function from Anchor Hocking. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "cheese",
      "grater",
      "multi",
      "kitchen"
    ],
    "price": 18.16,
    "stock": 24,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Wine Glasses Set of 6",
    "description": "Wine Glasses Set of 6 from Ninja. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "wine",
      "glasses",
      "set",
      "kitchen"
    ],
    "price": 25.24,
    "stock": 55,
    "brand": "Ninja"
  },
  {
    "name": "Vegetable Chopper",
    "description": "Vegetable Chopper from Zwilling. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "vegetable",
      "chopper",
      "kitchen"
    ],
    "price": 23.3,
    "stock": 25,
    "brand": "Zwilling"
  },
  {
    "name": "Instant Pot Pressure Cooker",
    "description": "Instant Pot Pressure Cooker from Instant Pot. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "instant",
      "pot",
      "pressure",
      "kitchen"
    ],
    "price": 99.75,
    "stock": 48,
    "brand": "Instant Pot"
  },
  {
    "name": "Bakeware Set 10-Piece",
    "description": "Bakeware Set 10-Piece from Pyrex. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "bakeware",
      "set",
      "piece",
      "kitchen"
    ],
    "price": 57.99,
    "stock": 55,
    "brand": "Pyrex"
  },
  {
    "name": "Kitchen Scale Digital",
    "description": "Kitchen Scale Digital from KitchenAid. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "kitchen",
      "scale",
      "digital"
    ],
    "price": 22.87,
    "stock": 23,
    "brand": "KitchenAid"
  },
  {
    "name": "Salad Spinner",
    "description": "Salad Spinner from Anchor Hocking. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "salad",
      "spinner",
      "kitchen"
    ],
    "price": 22.95,
    "stock": 44,
    "brand": "Anchor Hocking"
  },
  {
    "name": "Rolling Pin Wooden",
    "description": "Rolling Pin Wooden from OXO. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "rolling",
      "pin",
      "wooden",
      "kitchen"
    ],
    "price": 7.74,
    "stock": 53,
    "brand": "OXO"
  },
  {
    "name": "Dish Drying Rack",
    "description": "Dish Drying Rack from Pyrex. A quality addition to our kitchen collection, designed for everyday reliability.",
    "category": "kitchen",
    "tags": [
      "dish",
      "drying",
      "rack",
      "kitchen"
    ],
    "price": 32.79,
    "stock": 19,
    "brand": "Pyrex"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Product.insertMany(products);
    console.log(`Inserted ${result.length} products`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();