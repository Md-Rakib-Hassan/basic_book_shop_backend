import { IAuthor } from "./author.interface";
import Author from "./author.model";

const createAuthorInDB = async (authorData:IAuthor):Promise<IAuthor> => {
    const result = await Author.create(authorData);
    return result;
}

const getAllAuthorsFromDB = async (searchTerm?: string) => {
    searchTerm=searchTerm?.startsWith(' ')?searchTerm.replace(' ','+'):searchTerm;
   
    const query = searchTerm
        ? {
            $or: [
                { Name: searchTerm },
                { Email: searchTerm },
                { Phone: searchTerm },
                { BioGraphy: searchTerm },
            ],
        } : {};
    const result = await Author.find(query);
    return result;
}

const getSpecificAuthorFromDB = async (authorId: string): Promise<IAuthor | null> => {
    const result = await Author.findById(authorId);
    return result;
}

const updateSpecificAuthorInDB = async (authorId: string, payload: Partial<IAuthor>): Promise<IAuthor | null> => {
    const filter = { _id: authorId };
    const result = await Author.findOneAndUpdate(filter, payload, { new: true });
    return result;
}

const deleteSpecificAuthorFromDB = async (authorId: string): Promise<IAuthor | null> => {
    const result = await Author.findByIdAndDelete(authorId);
    return result;
}

export const AuthorServices = {
    createAuthorInDB,
    getAllAuthorsFromDB,
    getSpecificAuthorFromDB,
    updateSpecificAuthorInDB,
    deleteSpecificAuthorFromDB,
}