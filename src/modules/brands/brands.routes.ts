import express from "express";
import * as brandsController from "./brands.controller";

const router = express.Router();

router.get("/", brandsController.getBrands);

export default router;
