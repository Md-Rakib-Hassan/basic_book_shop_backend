import IBook from "./book.interface";
import { Book } from "./book.model";

const createBookIntoDB = async (bookData: IBook) => {
    const result = await Book.create(bookData);
    return result;
}

export const  BookServices = {
    createBookIntoDB,
}