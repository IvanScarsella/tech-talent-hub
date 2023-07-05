import transporter from "..";

export default async function register(req, res) {
  const { method } = req;
  // console.log(req.body.string);
  if (method == "POST") {
    // const { email } = req.body;
    const  email  = 'scarsellaivan@gmail.com';
    // console.log(req.method);
    try {
      await transporter.verify();
      const mail = {
        from: 'equipo3.37a@gmail.com',
        to: email,
        subject: "Successful applied vacancy",
        html: `
        <p style="color: black">
        Your request has been sent successfully! You can see all the vacancies you applied for in the 'My Posts' section of your profile.
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