// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// ============================================
// TRADUCCIONES PARA PRODUCTOS
// ============================================

export const rarityLabels: Record<string, string> = {
  COMUN: 'Común',
  NORMAL: 'Normal',
  RARA: 'Rara',
  SUPER_RARA: 'Súper Rara',
  SECRETA: 'Secreta',
};

export const conditionLabels: Record<string, string> = {
  MINT: 'Mint (Perfecto)',
  NEAR_MINT: 'Casi perfecto',
  PLAYED: 'Usado',
  DAMAGED: 'Dañado',
};

export const categoryLabels: Record<string, string> = {
  CARD: '🃏 Carta Individual',
  PACK: '📦 Sobre',
  BOX: '📦 Caja / Colección',
};

export const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const rarityColors: Record<string, string> = {
  COMUN: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
  NORMAL: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  RARA: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  SUPER_RARA: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  SECRETA: 'bg-red-500/20 text-red-400 border-red-500/20',
};

export function getRarityLabel(rarity: string): string {
  return rarityLabels[rarity] || rarity;
}

export function getConditionLabel(condition: string): string {
  return conditionLabels[condition] || condition;
}

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}
