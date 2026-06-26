// prisma.config.ts
import 'dotenv/config'

// Definimos la configuración directamente sin usar defineConfig
// para evitar problemas de tipos
const config = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
}

export default config