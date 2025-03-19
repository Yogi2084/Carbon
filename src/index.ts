import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const app = new Hono()
serve(app);
console.log(`Server is running on http://localhost:${3000}`)
