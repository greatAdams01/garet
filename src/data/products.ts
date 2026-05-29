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
