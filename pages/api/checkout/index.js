import prisma from "@/prisma/client";
import mercadopago from "mercadopago";
import transporter from "../sendEmail";
import upgradePremium from "../upgradePremium";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN,
});

// let actualUser = {};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const plan = req.body.plan;
    const userId = req.body.userId;
    const { id } = req.query;
    const URL = "localhost:3000";
    //const URL = "tech-talent-hub-actual-git-develop-equipo3henry.vercel.app"


    try {   
      const preference = {
        items: [
          {
            title: plan.title,
            unit_price: plan.price,
            quantity: 1,
          },
        ],
        auto_return: "approved",
        back_urls: {
          success: `${URL}/profile/mydata`,
          failure: `${URL}/profile/mydata`,
        },
        //notification_url: `${URL}/api/notify?customId=${id}`,
      };
 

      const response = await mercadopago.preferences.create(preference);

      res.status(200).send({ url: response.body.init_point });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ message: "Method not allowed" });
  }
}
