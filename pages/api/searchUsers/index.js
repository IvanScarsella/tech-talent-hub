import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const query = req.query.q;
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        superAdmin: false, // solo obtener usuarios que no sean superAdmin
      },
      orderBy: [
        { isPremium: "desc" },
        // other fields to order by (if any)
      ],
    });
    
    const searchedUsers = [];

    users.forEach(user => {
      if (!user.seniority) user.seniority = "@"; // pongo un string cualquiera para que
      if (!user.degree) user.degree = "@"; // se pueda buscar por string y no se encuentre
        if (
          user.username.toUpperCase().includes(query.toUpperCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toUpperCase().includes(query.toUpperCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.lastname.toUpperCase().includes(query.toUpperCase()) ||
          user.lastname.includes(query.toLowerCase()) ||
          user.country.toUpperCase().includes(query.toUpperCase()) ||
          user.country.toLowerCase().includes(query.toLowerCase()) ||
          user.degree.toUpperCase().includes(query.toUpperCase()) ||
          user.degree.toLowerCase().includes(query.toLowerCase()) ||
          user.languages.includes(query.toUpperCase()) ||
          user.languages.includes(query.toLowerCase()) ||
          user.progLanguages.includes(query.toUpperCase()) ||
          user.progLanguages.includes(query.toLowerCase()) ||
          user.seniority.toUpperCase().includes(query.toUpperCase()) ||
          user.seniority.toLowerCase().includes(query.toLowerCase()) ||
          user.softSkills.includes(query.toUpperCase()) ||
          user.softSkills.includes(query.toLowerCase()) ||
          user.specialization.toUpperCase().includes(query.toUpperCase()) ||
          user.specialization.toLowerCase().includes(query.toLowerCase())
          )
          searchedUsers.push(user)
        })
        // const where = {
        //   OR: [
        //     { username: { contains: query.toLowerCase() } },
        //     { name: { contains: query } },
        //     { lastname: { contains: query } },
        //     { country: { contains: query } },
        //     { email: { contains: query } },
        //     { degree: { contains: query } },
        //     { languages: { has: query } },
        //     { progLanguages: { has: query } },
        //     { seniority: { contains: query } },
        //     { softSkills: { has: query } },
        //   ],
        // };
        
        // if (
          //   [
            //     "FRONTEND",
    //     "BACKEND",
    //     "DATASCIENTIST",
    //     "FULLSTACK",
    //     "AI_ENGINEER",
    //   ].includes(query.toUpperCase())
    // ) {
      //   where.OR.push({ specialization: { equals: query.toUpperCase() } });
      // }
      
      // const results = await prisma.user.findMany({ where });
      
      res.status(200).json(searchedUsers);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
