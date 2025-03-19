import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const hono = new Hono()

// get all students
hono.get("/student", async (context) => {  
  const student = await prisma.student.findMany();

  return context.json(
    {
      student,
    },
    200
  );
})



serve(hono);
console.log(`Server is running on http://localhost:${3000}`)
