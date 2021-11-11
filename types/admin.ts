export type LoginRequest = {
  salt: string;
  user: string;
  pass: string;
  captcha: string;
};
