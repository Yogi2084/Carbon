import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const hono = new Hono()


hono.get("/student", async (context) => {  
  const student = await prisma.student.findMany();

  return context.json(
    {
      student,
    },
    200
  );
})

// get all professors
hono.get('/professor',async (context) =>{
  const professor=await prisma.professor.findMany();
  return context.json(
    {
      professor},200
  )
  
})

// get all students along with their professors details
hono.get('/student/proctor',async(context)=>{
  const student=await prisma.student.findMany({
    include:{
      proctor:true
    }
  });
  return context.json({
    student

  },200)
  
})

// create student

hono.post("/student", async (context) => {
  const { name, dateOfBirth, aadharNumber } = await context.req.json();
  
  const student = await prisma.student.create({
    data: {
      name,
      dateOfBirth,
      aadharNumber,

    },
  });

  return context.json(
    {
      student,
    },
    200
  );

})


//post proctor
hono.post("/professor", async (context) => {
  const{professorId,name,seniority,aadharNumber} = await context.req.json();
  try{
  const proctor = await prisma.professor.create({
    data: {
      professorId,
      name,
      seniority,
      aadharNumber,
    },
  });
  
  return context.json(
    {
      proctor,
    },
    200
  );
}
catch(error){
  console.error("Error:", error);
}
});

// get all students under the proctorship of the given professor.
hono.get("/professor/:professorId/proctorship", async (context) => {
  const { professorId } = context.req.param();
  const student = await prisma.student.findMany({
    where: {
      proctorId: professorId,
    },
  });
  return context.json({
    student,
  },200);
  
})

// update student details using studentId

hono.patch("/student/:studentId",async(context)=>{
  const{studentId}=context.req.param();
  const{name,dateOfBirth,aadharNumber,proctorId}= await context.req.json();
  const student= await prisma.student.update({
    where:{
      id:studentId,
    },
data:{
  name,dateOfBirth,aadharNumber,proctorId
}
  })
return context.json(
  {
    student},200
)
})

// update professor details using professorId

hono.patch("/professor/:professorId",async(Context)=>{
  const{professorId}=Context.req.param();
  const{name,aadharNumber,seniority}=await Context.req.json();
  const professor=await prisma.professor.update({
    where:{
      professorId:professorId,

    },
    data:{
      name,aadharNumber,seniority
    }

})
return Context.json(
  {
    professor
  },200


)
})

//delete a student using studentId

hono.delete("/student/:studentId",async(contex)=>{
const{studentId}=contex.req.param();
const student =await prisma.student.delete({
  where:{
    id:studentId,
  }
})
return contex.json(
  {
    student
  },200
)
})

//delete a professor  using professorId

hono.delete("/professor/:professorId",async(context)=>{
const{professorId}=context.req.param();
const professor=await prisma.professor.delete(
  {
    where:{professorId:professorId,

    }
  })
  return context.json({
    professor},200
  )
})

// 11. Assigns a student under the proctorship of the professor referenced by professorId.
hono.post("/professors/:professorId/proctorships", async (context) => {
  const profId = context.req.param("professorId");
  const { studentId } = await context.req.json();


  const updateStudentProctorship = await prisma.student.update({
    where: { id: studentId },
    data: { proctorId: profId },
  });
  return context.json(
    { "Updated Student Proctorship": updateStudentProctorship },
    200
  );
});

// 12. Returns the library membership details of the student referenced by studentId

hono.get("/students/:studentId/library-membership", async (context) => {
  const studentId = context.req.param("studentId");
  const libraryMembership = await prisma.libraryMembership.findMany({
    where: { studentId: studentId },
  });
  return context.json({ libraryMembership }, 200);  
  
})

// 13. Creates a library membership for the student referenced by studentId

hono.post("/students/:studentId/library-membership", async (context) => {
  const studentId = context.req.param("studentId");
  const { issueDate, expiryDate } = await context.req.json();

  const libraryMembership = await prisma.libraryMembership.create({
    data: {
      studentId,
      issueDate,
     expiryDate,
    },
  });
  return context.json({ libraryMembership }, 200);
});

// 14. Updates the library membership details of the student referenced by studentId

hono.patch("/student/:studentId/library-membership", async (context) => {
  const studentId = context.req.param("studentId");
  const { issueDate, expiryDate } = await context.req.json();

  const libraryMembership = await prisma.libraryMembership.update({
    where: { studentId: studentId },
    data: {
      issueDate,
      expiryDate,
    },
  });
  return context.json(
    { 
      libraryMembership 
    }, 200
  );
  
})


// 15. Deletes the library membership of the student referenced by studentId

hono.delete("/student/:studentId/library-membership", async (context) => {
  const studentId = context.req.param("studentId");
  const libraryMembership = await prisma.libraryMembership.delete({
    where: { studentId: studentId },
  });
  return context.json(
    {
      libraryMembership 
    }, 200
  );
});

serve(hono);
console.log(`Server is running on http://localhost:${3000}`)
