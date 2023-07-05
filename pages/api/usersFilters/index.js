import prisma from "@/prisma/client";

export default async function handler(req, res) {
  const { progLanguage, seniority, softSkill, specialization } = req.query;
  if (req.method === "GET") {
    try {
      const users = await getUsers(progLanguage, seniority, softSkill, specialization);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving user." });
    }
  } else {
    res.status(400).json({ error: "Invalid method." });
  }
}

async function getUsers(progLanguage, seniority, softSkill, specialization) {
  let where = {
    superAdmin: false,
  };
  if (progLanguage) {
    where.progLanguages = {
      has: progLanguage,
    };
  }

  if (seniority) {
    where.seniority = seniority;
  }

  if (softSkill) {
    where.softSkills = {
      has: softSkill,
    };
  }

  if (specialization) {
    where.specialization = {
      equals: specialization,
    };
  }

  const users = await prisma.user.findMany({
    where,
  });

  return users;
}
