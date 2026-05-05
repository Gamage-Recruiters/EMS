import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Test route working");
});

router.get("/test", (req, res) => {
  res.send("Test sub-route /api/test/test working");
});

export default router;
