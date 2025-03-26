import "express";

declare global {
  namespace Express {
    interface Request {
      consent: {
        accessToken: string;
        consentId: string;
        productId: string;
      };
    }
  }
}
