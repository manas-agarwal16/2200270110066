import { Router } from "express";

const router = Router();
import { createUrl, getUrl } from "../controllers/urlsController.js";

router.route('/shorturls/:shortCode').get(redirectToOriginalUrl);
router.route('/shorturls').post(createUrl);

export default router;