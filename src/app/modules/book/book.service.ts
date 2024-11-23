import IBook from "./book.interface";
import { Book } from "./book.model";

const createBookIntoDB = async (bookData: IBook) => {
    const result = await Book.create(bookData);
    return result;
}

const getAllBooksFromDB = async (query) => {
    const result = await Book.find(query);
    return result;
}

const getSpecificBookFromDB = async (productId) => {
    const result = await Book.findById(productId);
    return result;
}

const updateSpecificBookIntoDB = async (productId, payload) => {
    const filter={_id: productId}
    const result = await Book.findOneAndUpdate(filter, payload, { new: true });
    return result;
}

const deleteSpecificBookFromDB = async (productId) => {
    const result = await Book.findByIdAndDelete(productId,{new: true});
    return result;
} 

export const  BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getSpecificBookFromDB,
    updateSpecificBookIntoDB,
    deleteSpecificBookFromDB
}