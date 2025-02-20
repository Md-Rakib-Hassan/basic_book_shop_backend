import { Schema, model } from 'mongoose';
import { IAuthor } from './author.interface';

const AuthorSchema = new Schema<IAuthor>({
    Name: { type: String, required: [true, 'Name is required'] },
    Email: { type: String, required: [true, 'Email is required'], unique: true },
    Phone: { type: String, required: [true, 'Phone is required'], unique: true },
    BioGraphy: { type: String, required: [true, 'Biography is required'] },
    DateOfBirth: { type: Date, required: [true, 'Date of Birth is required'] },
    Nationality: { type: String, required: [true, 'Nationality is required'] },
    Website: { type: String },
    ImageUrl: { type: String, required: [true, 'Image URL is required'] }
}, {
    timestamps: true
}
);

const Author = model<IAuthor>('Author', AuthorSchema);

export default Author;
