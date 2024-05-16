
import express from "express";
import { getPeople, getPerson } from "../controllers/exampleController.js";
import { createPerson, deletePerson } from "../controllers/exampleController.js";

const router = express.Router();
router.get('/:id', getPerson);
router.get('/', getPeople);
router.post('/', createPerson);
router.delete('/', deletePerson);

export default router;
