import type { Request, Response } from "express";
import express from "express";

import { body, validationResult } from "express-validator";
import * as BookService from "./book.service";

export const bookRouter = express.Router();

//GET: list of all books
bookRouter.get("/", async (request: Request, response: Response) => {
  try {
    const books = await BookService.listBooks();
    return response.status(200).json(books);
  } catch (error: any) {
    return response.status(400).json(error.message);
  }
});

bookRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const book = await BookService.getBook(id);

    if (!book) return response.status(404).json("Book could not be found");

    return response.status(200).json(book);
  } catch (error: any) {
    return response.status(200).json(error.message);
  }
});

bookRouter.post(
  "/",
  body("title").isString(),
  body("datePublished").isISO8601(),
  body("isFiction").isBoolean(),
  body("authorId").isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const book = request.body;
      const newBook = await BookService.createBook(book);

      return response.status(201).json(newBook);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  },
);

bookRouter.put(
  "/:id",
  body("title").isString(),
  body("datePublished").isISO8601(),
  body("isFiction").isBoolean(),
  body("authorId").isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const id: number = parseInt(request.params.id, 10);
    try {
      const book = request.body;
      const updatedBook = await BookService.updateBook(id, book);

      return response.status(200).json(updatedBook);
    } catch (error: any) {
      return response.status(400).json(error.message);
    }
  },
);

bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await BookService.deleteBook(id);
    return response.status(204).json("Book has been successfully deleted");
  } catch (error: any) {
    return response.status(400).json(error.message);
  }
});
