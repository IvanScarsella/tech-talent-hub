import transporter from "..";

export default async function register(req, res) {
  const { method } = req;
  if (method == "POST") {
      // console.log(req);
    const { email } = req.body;
    // const  email  = 'scarsellaivan@gmail.com';
    // console.log(req.method);
    try {
      await transporter.verify();
      const mail = {
        from: 'equipo3.37a@gmail.com',
        to: email,
        subject: "Successful registration",
        html: `
        <p style="color: black">
        Welcome ! Your TechTalentHub account has been successfully created!
        </p>
        `,
      };
      await transporter.sendMail(mail);
      // console.log(mail);
      res.status(200).json({
        Message: `Se ha enviado un correo electrónico de prueba a ${email} `,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}