import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const paramsFilters = req.query;
  // console.log("Incoming query parameters: ", paramsFilters);
  if (req.method === "GET") {
    try {
      const vacancies = await getVacancies(paramsFilters);
      // console.log("Vacancies found: ", vacancies.length);
      res.status(200).json(vacancies);
    } catch (error) {
      console.error("Error while retrieving vacancies: ", error);
      res.status(500).json({ error: "Error retrieving vacancies." });
    }
  } else {
    res.status(400).json({ error: "Invalid method." });
  }
}

async function getVacancies(paramsFilters) {
  
  const { languajes, seniority, nameVacancy, workday } = paramsFilters;

  let where = {};
  if (languajes) {
    where.programming_Languages = {
      hasSome: languajes.split(","),
    };
  }
  if (seniority) {
    where.seniority = {
      equals: seniority,
    };
  }

  if (nameVacancy) {
    where.name_Vacancy = {
      equals: nameVacancy,
    };
  }

  if (workday) {
    where.workday = {
      equals: workday,
    };
  }

  // console.log("Query condition: ", where);

  const vacancies = await prisma.vacancy.findMany({
    where,
    include: {
      company: true,
      applicants: true,
    },
  });

  // console.log("Query result: ", vacancies);

  return vacancies;
}
