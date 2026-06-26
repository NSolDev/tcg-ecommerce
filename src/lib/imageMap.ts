// src/lib/imageMap.ts
import { PLACEHOLDER_IMAGE } from './constants'

export const imageMap: Record<string, string> = {
  // Cartas
  'charizard-ex-ascended-heroes': '/images/products/charizard-ex.png',
  'mewtwo-vstar-prismatic-evolutions': '/images/products/mewtwo-vstar.jpg',
  'pikachu-ex-surging-sparks': '/images/products/pikachu-ex.jpg',
  'gengar-ex-twilight-masquerade': '/images/products/gengar-ex.jpg',
  'gardevoir-ex-151': '/images/products/gardevoir-ex.jpg',
  
  // Sobres
  'pack-ascended-heroes': '/images/products/pack-ascended-heroes.png',
  'pack-prismatic-evolutions': '/images/products/pack-prismatic-evolutions.png',
  'pack-surging-sparks': '/images/products/pack-surging-sparks.jpg',
  
  // Cajas
  'box-ascended-heroes-elite-trainer': '/images/products/box-ascended-heroes.jpg',
  'box-black-bolt-white-flames-elite-trainer': '/images/products/box-black-bolt.jpg',
  'box-chaos-rising-elite-trainer': '/images/products/box-chaos-rising.jpg',
  'box-megaevolution-mega-lucario-elite-trainer': '/images/products/box-megaevolution.jpg',
  'box-paldea-evolved-elite-trainer': '/images/products/box-paldea-evolved.jpg',
  'box-prismatic-evolutions-elite-trainer': '/images/products/box-prismatic-evolutions.jpg',
}

export function getLocalImage(slug: string): string | null {
  return imageMap[slug] || null
}