import { Request, Response, NextFunction } from 'express';

type fn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default (fn: fn) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err) => next(err));
  };
};
