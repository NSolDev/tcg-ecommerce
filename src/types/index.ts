// Tipos globales del proyecto
import { OrderItem as PrismaOrderItem } from '@prisma/client';

export type OrderItem = PrismaOrderItem;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  rarity: 'COMUN' | 'NORMAL' | 'RARA' | 'SÚPER_RARA' | 'SECRETA';
  condition: 'MINT' | 'NEAR_MINT' | 'PLAYED' | 'DAMAGED';
  type: string;
  hp?: number;
  attack?: number;
  weakness?: string;
  set: Set;
  createdAt: Date;
  updatedAt: Date;
}

export interface Set {
  id: string;
  name: string;
  releaseDate: Date;
  logoUrl?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  items: OrderItem[];
  createdAt: Date;
}
