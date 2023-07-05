import prisma from "@/prisma/client";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const Vacancy = await prisma.vacancy.findUnique({
        where: {
          id: id,
        },
        include: {
          applicants: true, // Include applicants' details in the response
        },
      });
      return res.status(200).json(Vacancy);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving user." });
    }
  } else if (req.method === "PUT") {
    const { isActive } = req.body;
    // console.log(isActive);
    try {
      const updatedVacancy = await prisma.Vacancy.update({
        where: {
          id: id,
        },
        data: {
          isActive: isActive,
          status: "ProccesCompleted", // Update status to ProccesCompleted
        },
      });
      return res.status(200).json(updatedVacancy);
    } catch (error) {
      res.status(500).json({ error: "Error updating the vacancy." });
    }
  } else if (req.method === "PATCH") {
    const { logo_Company, isActive } = req.body;
    // console.log(logo_Company);
    try {
      const updatedVacancy = await prisma.Vacancy.update({
        where: {
          id: id,
        },
        data: {
          logo_Company: logo_Company,
          isActive: isActive,
        },
      });
      return res.status(200).json(updatedVacancy);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating the logo of the company." });
    }
  } else {
    return res.status(400).json({ error: "Invalid method." });
  }
}
