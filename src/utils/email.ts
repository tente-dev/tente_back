import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENGRID_API_KEY as string);

export const sendActivationEmail = async (
  name: string,
  email: string,
  link: string,
) => {
  try {
    await sgMail.send({
      from: 'develop@tente.lat',
      to: email,
      templateId: '',
      dynamicTemplateData: {
        name,
        link,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export const sendForgotPasswordEmail = async (email: string, link: string) => {
  try {
    await sgMail.send({
      from: 'develop@tente.lat',
      to: email,
      templateId: '',
      dynamicTemplateData: {
        link,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
