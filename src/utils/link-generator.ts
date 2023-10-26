const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN as string;

export const generateActivationLink = (id: number, verifyToken: string) => {
  const url = `${EMAIL_DOMAIN}/auth/verify-email/`;
  const params = `?id=${id}&token=${verifyToken}`;
  const encodedParams = Buffer.from(params).toString('base64');
  const link = url + encodedParams;
  return link;
};

export const generateForgotPasswordLink = (
  resetToken: string,
  email: string,
) => {
  const url = `${EMAIL_DOMAIN}/auth/reset-password/`;
  const params = `?email=${email}&resetToken=${resetToken}`;
  const encodedParams = Buffer.from(params).toString('base64');
  const link = url + encodedParams;
  return link;
};
