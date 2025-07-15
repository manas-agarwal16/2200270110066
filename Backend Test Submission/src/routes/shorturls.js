import { asyncHandler } from "../utils/asyncHandler.js";
import { Log } from "../../../Logging Middleware/logger.js";

const shortURLs = asyncHandler(async (req, res) => {

    const { url , validity, shortcode} = req.body;

    if(!url){
        await Log('backend', 'error', 'route', 'URL is required');
        return res.status(400).json(new ApiError(400, "URL is required"));
    }

    if(!validity) validity = 30; // default validity is 30 minutes

    
    
});