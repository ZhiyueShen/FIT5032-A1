const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({ origin: true });

const SENDGRID_KEY = defineSecret("SENDGRID_API_KEY");

exports.sendUserWelcomeEmail = onRequest(
  { secrets: [SENDGRID_KEY], region: "us-central1" },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const { to, name } = req.body;
      if (!to || !name) {
        res.status(400).send("Missing required fields");
        return;
      }

      sgMail.setApiKey(SENDGRID_KEY.value());

      const msg = {
        to,
        from: "restless0418@gmail.com",
        subject: "Welcome to Men's Health!",
        text: `Hi ${name}, welcome to Men's Health!`,
        html: `
          <p>Hi <b>${name}</b>,</p>
          <p>Welcome to <b>Men's Health</b>! Your account has been created successfully.</p>
          <p>Stay healthy,<br/>Men's Health Team</p>
        `,
      };

      try {
        await sgMail.send(msg);
        logger.info("Email sent to:", to);
        res.status(200).send("Welcome email sent successfully");
      } catch (error) {
        logger.error("SendGrid error:", error);
        res.status(500).send("Failed to send email: " + error.message);
      }
    });
  }
);

