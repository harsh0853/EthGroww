import { Router } from "express";
import * as feedController from "../controllers/feed.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create-loan", verifyJWT, feedController.createLoan);
router.get("/loans", verifyJWT, feedController.getAllLoans);
router.get(
  "/active-loans/:ethAddress",
  verifyJWT,
  feedController.getActiveLoans
);
router.post("/fund-loan/:loanId", verifyJWT, feedController.fundLoan);
router.post("/repay-loan/:loanId", verifyJWT, feedController.loanRepaid);

export default router;
