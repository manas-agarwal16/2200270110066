import { asyncHandler } from "../utils/asyncHandler.js";
import { Log } from "../../../Logging Middleware/logger.js";

import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * POST /api/shorten
 * @body { url: string, validity?: number (in minutes), shortCode?: string }
 */
export const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortCode } = req.body;

    // Validate URL
    if (!url || typeof url !== "string") {
      await Log("backend", "error", "route", `Invalid URL provided: ${url}`);
      return res.status(400).json(new ApiError(400, "Invalid URL provided"));
    }

    // Determine expiration
    const validMinutes =
      typeof validity === "number" && validity > 0 ? validity : 30;
    const expiry = new Date(Date.now() + validMinutes * 60 * 1000);

    // Validate or generate shortCode
    let codeToUse = shortCode;

    if (shortCode) {
      // Validate format
      const validPattern = /^[a-zA-Z0-9_-]{4,20}$/;
      if (!validPattern.test(shortCode)) {
        await Log(
          "backend",
          "error",
          "route",
          `Invalid shortCode format: ${shortCode}`
        );

        return res.status(400).json({
          error: "Provided shortCode is invalid (only alphanum, 4-20 chars)",
        });
      }

      // Ensure uniqueness
      const exists = await Url.findOne({ shortCode });
      if (exists) {
        await Log(
          "backend",
          "error",
          "route",
          `ShortCode conflict for ${shortCode}`
        );
        return res
          .status(409)
          .json(new ApiError(409, "ShortCode already exists"));
      }
    } else {
      // Generate unique shortCode
      let isUnique = false;
      while (!isUnique) {
        codeToUse = nanoid(6);
        const exists = await Url.findOne({ shortCode: codeToUse });
        if (!exists) isUnique = true;
      }
    }

    // Save to DB
    const newUrl = new Url({ url, shortCode: codeToUse, expiry });
    await newUrl.save();

    const shortLink = `${req.protocol}://${req.get("host")}/shorturls/${codeToUse}`;

    return res.status(201).json(
      new ApiResponse(201, {
        shortLink,
        expiry: expiry.toISOString(),
      })
    );
  } catch (err) {
    console.error(err);
    await Log("backend", "error", "route", `Error creating short URL: ${err.message}`);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /:shortCode
 * Redirects to the original URL if valid and not expired
 */

export const getShortUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log('shortCode:', shortCode);
    

    // Validate shortCode
    if (!shortCode || typeof shortCode !== "string") {
      await Log("backend", "error", "route", `Invalid shortCode: ${shortCode}`);
      return res.status(400).json(new ApiError(400, "Invalid shortCode"));
    }

    const foundUrl = await Url.findOne({ shortCode });

    if (!foundUrl) {
        await Log("backend", "error", "route", `Short URL not found: ${shortCode}`);
      return res.status(404).json(new ApiError(404, "Short URL not found"));
    }

    // Check if expired
    if (foundUrl.expiry < new Date()) {
        await Log("backend", "error", "route", `Short URL expired: ${shortCode}`);
      return res.status(410).json(new ApiError(410, 'Short URL expired'));
    }

    // Increment click count and log click data
    foundUrl.clicks += 1;
    foundUrl.clickData.push({
      timestamp: new Date(),
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
    });

    await foundUrl.save();

    return res.redirect(foundUrl.url);

    // Log the successful retrieval
    // return res.status(200).json(
    //   new ApiResponse(200, {
    //     originalUrl: foundUrl.url,
    //     shortCode: foundUrl.shortCode,
    //     createdAt: foundUrl.createdAt,
    //     expiry: foundUrl.expiry,
    //     totalClicks: foundUrl.clicks,
    //     clickHistory: foundUrl.clickData.map((click) => ({
    //       timestamp: click.timestamp,
    //       userAgent: click.userAgent,
    //       ip: click.ip,
    //     })),
    //   })
    // );
  } catch (err) {
    console.error(err);
    await Log("backend", "error", "route", `Error retrieving short URL: ${err.message}`);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};
