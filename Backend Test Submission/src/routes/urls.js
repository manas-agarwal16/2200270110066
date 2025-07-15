import { Router } from "express";

const router = Router();
import {createShortUrl, getShortUrlStats, visitURL } from "../controllers/urls.js";

router.route('/:shortCode').get(visitURL);
router.route('/shorturls/:shortCode').get(getShortUrlStats);
// router.route('/get-all-urls').get(allURLS);
router.route('/shorturls').post(createShortUrl);

export default router;