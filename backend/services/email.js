const nodemailer = require('nodemailer');
const path = require('path');
const logger = require('../config/configWiston');

const config = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "globetracked@gmail.com",
    pass: "cxht mtrx jkwh oezb" // app password, no contraseña real
  }
});

const sendEmail = async (to) => {
  try {
    const options = {
      from: "globetracked@gmail.com",
      to: to,
      subject: "¡Bienvenido a GlobeTracked!",
      html: `
      <div style="margin:0; padding:0; background-color:#f4f4f4; text-align:center;">
        <table role="presentation" style="width:100%; border-collapse:collapse;">
          <tr>
            <td align="center" style="padding:20px;">
              <table role="presentation" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:10px; overflow:hidden;">
                <tr>
                  <td style="padding:0;">
                    <img src="cid:banner" alt="GlobeTracked" style="width:100%; height:auto; display:block; border:0;"/>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px; font-family:Arial,sans-serif; color:#333333;">
                    <h2>¡Hola!</h2>
                    <p>Gracias por unirte a <b>GlobeTracked</b>. Tu experiencia comienza aquí 🚀</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`,
      attachments: [
        {
          filename: 'Bienvenido.png',
          path: path.join(__dirname, '../public/images/Bienvenido a GlobeTracked.png'),
          cid: 'banner' // mismo CID que en el src del <img>
        }
      ]
    };
    logger.info("Email sent successfully",{
        meta:{
            to,
            service: "Gmail",
            
        }
    })

    await config.sendMail(options);
    

  } catch (error) {
     logger.error("Error al enviar correo", {
      meta: { error: error.message, to, endpoint: "sendEmail" }
    });
  }
};

module.exports = sendEmail;