import { Request, Response, NextFunction } from "express";
import sanitizeInput from "../utils/sanitizeInput";

export default function sanitizeInputMiddlware(req: Request, res: Response, next: NextFunction) {
  const bodyDatasConvertidas = sanitizeInput(req.body);
  req.body = bodyDatasConvertidas;
  next();
}
