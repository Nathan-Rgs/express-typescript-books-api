import type { Request, Response } from "express";
import express from "express";
import { body, validationResult } from "express-validator";

import * as AuthorService from "./author.service";

export const authorRouter = express.Router();

// GET: a list of all authors
authorRouter.get("/", async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    return response.status(200).json(authors);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// GET: a single author based on his id
authorRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const author = await AuthorService.getAuthor(id);

    if (!author) return response.status(404).json("Author could not be found");

    return response.status(200).json(author);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// POST: create a author based on the received params (firstName and lastName)
authorRouter.post(
  "/",
  body("firstName").isString(),
  body("lastName").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const author = request.body;
      const newAuthor = await AuthorService.createAuthor(author);

      return response.status(201).json(newAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  },
);
