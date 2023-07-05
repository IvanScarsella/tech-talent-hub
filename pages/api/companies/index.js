import prisma from "@/prisma/client";
import transporter from "../sendEmail/index";
import { encrypt } from "../helpers/handleBcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        name,
        logo_Company,
        type,
        email,
        password, // remember to hash this before saving
        country,
        description,
        employes,
        googleAuth,
      } = req.body;
      // console.log(googleAuth);
      const companyEmail = email;

      const exist = await prisma.company.findUnique({
        where: { email: companyEmail },
      });
      if (exist)
        return res.status(400).json({ error: "Company already exists" });

      const encryptPass = await encrypt(password);

      const newCompany = await prisma.company.create({
        data: {
          name,
          logo_Company,
          type,
          email,
          password: encryptPass,
          country,
          description,
          employes,
          googleAuth,
        },
      });

      await transporter.verify();
      const mail = {
        from: "equipo3.37a@gmail.com",
        to: companyEmail,
        subject: "Successful registration",
        html: `
          <p style="color: black">
          Welcome ${newCompany.name}! Your TechTalentHub account has been successfully created!
          </p>
          `,
      };
      // console.log(mail);
      await transporter.sendMail(mail);

      return res.status(201).json(newCompany);
    } catch (error) {
      console.error("Error creating company:", error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    const { country, includeInactive } = req.query;

    const includeInactiveBool = includeInactive
      ? includeInactive.toLowerCase() === "true"
      : false;

    if (country) {
      try {
        const companies = await prisma.company.findMany({
          where: {
            country: {
              equals: country,
            },
            ...(includeInactiveBool
              ? {}
              : {
                  isActive: {
                    equals: true,
                  },
                }),
          },
        });

        return res.status(200).json(companies);
      } catch (error) {
        console.error("Error retrieving companies:", error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      try {
        const allCompanies = await prisma.company.findMany({
          where: {
            ...(includeInactiveBool
              ? {}
              : {
                  isActive: {
                    equals: true,
                  },
                }),
          },
        });

        return res.status(200).json(allCompanies);
      } catch (error) {
        console.error("Error retrieving companies:", error);
        return res.status(500).json({ error: error.message });
      }
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
