import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email, password } = req.body;
  // console.log("Incoming body parameters: ", req.body);
  try {
    const validate = await getValidate(email, password);
    // console.log(`provide access: ${validate}`);
    res.status(200).json(validate);
  } catch (error) {
    console.error(`Error while validating user: ${error}`);
    res.status(500).json({ error: "Error validating user." });
  }
}

async function getValidate(email, password) {
  // console.log(`Body condition: email:${email}`);
  const userFound = await prisma.user.findUnique({
    where: { email: email },
  });

  function calculatePremiumRemainingDays(a, b) {
    // Convertir las fechas a objetos Date
    const today = new Date(a);
    const premium = new Date(b);

    // Calcular la diferencia en milisegundos
    const calculate = today - premium;

    // Convertir la diferencia a días redondeando hacia abajo
    const remainingDays = Math.floor(calculate / (1000 * 60 * 60 * 24));
    // console.log(remainingDays);
    return remainingDays;
  }

  if (userFound) {
    const today = new Date();
    const newDate = new Date();
    if (newDate > userFound.resetLimitFreeVacancies) {
      if (newDate.getHours() >= 6) {
        newDate.setDate(newDate.getDate() + 1);
        newDate.setHours(1, 0, 0, 0);
      } else {
        newDate.setHours(1, 0, 0, 0);
      }
    } else {
      newDate.setDate(userFound.resetLimitFreeVacancies.getDate());
      newDate.setHours(1, 0, 0, 0);
    }

    const updateUser = await prisma.user.update({
      where: { id: userFound.id },
      data: {
        resetLimitFreeVacancies: newDate,
        limitFreeVacancies:
          today > userFound.resetLimitFreeVacancies
            ? 20
            : userFound.limitFreeVacancies,
        isActive: true,
      },
    });

    if (updateUser.isPremium === true || updateUser.remainingPremiumDays < 0) {
      const remainingDays = calculatePremiumRemainingDays(
        today,
        userFound.premiumUpdateDate
      );

      if (remainingDays > updateUser.remainingPremiumDays) {
        const updatePremiumUser = await prisma.user.update({
          where: { id: userFound.id },
          data: {
            isPremium: false,
            remainingPremiumDays: 0,
          },
        });
      } else {
        const updatePremiumUser = await prisma.user.update({
          where: { id: userFound.id },
          data: {
            isPremium: true,
            remainingPremiumDays: remainingDays,
          },
        });
      }
    }
  }

  if (!userFound)
    return { response: "Your email or google account is not registered" };
  else {
    if (password) {
      return (await compare(password, userFound.password))
        ? {
            response: "Access granted",
            userData: {
              id: userFound.id,
              name: `${userFound.name} ${userFound.lastname}`,
              user: userFound.username,
              email: userFound.email,
              seniority: userFound.seniority,
              image: userFound.profile_pictures,
              superAdmin: userFound.superAdmin,
              isPremium: userFound.isPremium,
              remainingDays: userFound.remainingPremiumDays,
            },
          }
        : { response: "Your email or password are incorrect" };
    } else {
      return userFound.googleAuth === true
        ? {
            response: "Access granted",
            userData: {
              id: userFound.id,
              name: `${userFound.name} ${userFound.lastname}`,
              user: userFound.username,
              email: userFound.email,
              seniority: userFound.seniority,
              image: userFound.profile_pictures,
              superAdmin: userFound.superAdmin,
              isPremium: userFound.isPremium,
              remainingDays: userFound.remainingPremiumDays,
            },
          }
        : { response: "Your google account is not registered" };
    }
  }
}
