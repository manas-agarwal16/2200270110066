import { Router } from "express";

const router = Router();
import { createShortUrl, getShortUrlStats } from "../controllers/urlsController.js";

router.route('/shorturls/:shortCode').get(getShortUrlStats);
router.route('/shorturls').post(createShortUrl);

export default router;