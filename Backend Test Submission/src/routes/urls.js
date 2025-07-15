import { Router } from "express";

const router = Router();
import { createShortUrl, getShortUrlStats } from "../controllers/urls.js";

router.route('/shorturls/:shortCode').get(getShortUrlStats);
router.route('/shorturls').post(createShortUrl);

export default router;