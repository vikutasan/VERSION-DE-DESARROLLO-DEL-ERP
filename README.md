# R de Rico - ERP: Ecosistema Digital Evolutivo

Bienvenido al sistema central de gestión para **R de Rico**. Este proyecto utiliza una arquitectura **Edge-First Hybrid Cloud** para garantizar la continuidad del negocio.

## Estructura del Proyecto (Monorepo)

- `apps/pos`: Punto de venta (PWA).
- `apps/api`: Servidor central (NestJS).
- `apps/kds`: Sistema de cocina.
- `packages/database`: Esquema de base de datos y migraciones.
- `packages/vision`: Módulo de reconocimiento de pan (AI).
- `docker/`: Configuración de despliegue local.
- `docs/`: Documentación técnica y hoja de ruta.

## Tecnologías Principales

- **Frontend**: Next.js, TailwindCSS
- **Backend**: NestJS, PostgreSQL, Prisma
- **IA**: TensorFlow.js, Gemini Live API
- **Infraestructura**: Docker, Docker Compose

## Guía de Instalación Rápida (Requerido)

Este sistema requiere:
1. **Node.js** (v18 o superior)
2. **Docker Desktop**
3. **PostgreSQL** (Iniciado vía Docker)

*Desarrollado con Antigravity - Ingeniería de Software Autónoma.*
