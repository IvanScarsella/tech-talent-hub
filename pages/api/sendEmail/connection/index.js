import transporter from "..";

export default async function sendConnectRequest(req, res) {
  // console.log(req.body);
  const { method } = req;

  if (method == "POST") {
    const { userEmail, companyName, companyEmail } = req.body;

    try {
      await transporter.verify();

      const mail = {
        from: `equipo3.37a@gmail.com`,
        to: userEmail,
        subject: "Connection Request",
        html: `
            <p style="color: black">
              Hello, ${companyName} would like to connect with you. Please reply to this email (${companyEmail}) if you are interested.
            </p>
          `,
      };

      await transporter.sendMail(mail);

      res.status(200).json({
        Message: `A connection request email has been sent from ${companyName} to ${userEmail}.`,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
