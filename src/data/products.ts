export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
}

export const categories = [
  "All",
  "Living Room Furniture",
  "Bedroom Furniture",
  "Dining Sets",
  "Office Furniture",
  "TV Consoles",
  "Wardrobes",
  "Upholstery",
  "Custom Furniture"
];

export const products: Product[] = [
  {
    id: "1",
    name: "Milano Velvet Sofa",
    category: "Living Room Furniture",
    price: 450000,
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80",
    description: "A luxurious 3-seater velvet sofa perfect for modern living spaces.",
    inStock: true
  },
  {
    id: "2",
    name: "Oakwood Dining Set",
    category: "Dining Sets",
    price: 650000,
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    description: "A 6-seater solid oak dining table with ergonomic chairs.",
    inStock: true
  },
  {
    id: "3",
    name: "Executive Leather Office Chair",
    category: "Office Furniture",
    price: 120000,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0d1?auto=format&fit=crop&w=800&q=80",
    description: "Premium leather ergonomic chair for long working hours.",
    inStock: true
  },
  {
    id: "4",
    name: "Serenity King Bed",
    category: "Bedroom Furniture",
    price: 350000,
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80",
    description: "Minimalist king-size bed frame with built-in storage.",
    inStock: true
  },
  {
    id: "5",
    name: "Floating TV Console",
    category: "TV Consoles",
    price: 180000,
    image: "https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?auto=format&fit=crop&w=800&q=80",
    description: "Sleek wall-mounted TV console with LED ambient lighting.",
    inStock: true
  },
  {
    id: "6",
    name: "Bespoke Reading Chair",
    category: "Upholstery",
    price: 200000,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    description: "Custom upholstered reading chair, available in multiple fabrics.",
    inStock: true
  },
  {
    id: "9",
    name: "Classic Wooden Wardrobe",
    category: "Wardrobes",
    price: 280000,
    image: "https://images.unsplash.com/photo-1521783593447-5702b8bfd0d0?auto=format&fit=crop&w=800&q=80",
    description: "Spacious multi-compartment wardrobe with a sleek wood finish.",
    inStock: true
  },
  {
    id: "10",
    name: "Custom Marble Center Table",
    category: "Custom Furniture",
    price: 250000,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    description: "A bespoke center table with a genuine marble top and gold-accented frame.",
    inStock: true
  }
];
