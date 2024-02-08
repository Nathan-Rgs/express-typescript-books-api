import { db } from "../src/utils/db.server";

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePublished: Date;
};

function getAuthors(): Array<Author> {
  return [
    { firstName: "Nathan", lastName: "Santos" },
    { firstName: "Nome Teste", lastName: "Sobrenome Teste" },
    { firstName: "John", lastName: "Cena" },
  ];
}

function getBooks(): Array<Book> {
  return [
    { title: "O Livro", isFiction: true, datePublished: new Date() },
    {
      title: "O Livro (sem ficcao)",
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: "O Livro final edition",
      isFiction: true,
      datePublished: new Date(),
    },
  ];
}

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          firstName: author.firstName,
          lastName: author.lastName,
        },
      });
    }),
  );

  const author = await db.author.findFirst({
    where: {
      firstName: "Nathan",
    },
  });

  if (author === null) {
    throw new Error("Author not found");
  }

  await Promise.all(
    getBooks().map((book) => {
      const { title, isFiction, datePublished } = book;

      return db.book.create({
        data: {
          title,
          isFiction,
          datePublished,
          authorId: author.id,
        },
      });
    }),
  );
}

seed();
