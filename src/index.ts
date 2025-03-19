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

// create student

hono.post("/student", async (context) => {
  const { name, dateOfBirth, aadharNumber, proctorId } = await context.req.json();
try{
  const student = await prisma.student.create({
    data: {
      name,
      dateOfBirth,
      aadharNumber,
      proctorId,
    },
  });

  return context.json(
    {
      student,
    },
    200
  );
}

catch(error){
  console.error("Error fetching students:", error);
  
}
})







serve(hono);
console.log(`Server is running on http://localhost:${3000}`)
