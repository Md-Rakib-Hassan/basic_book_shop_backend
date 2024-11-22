import { model, Schema } from "mongoose";
import IBook from "./book.interface";

const bookSchema = new Schema<IBook>({
title:{type:String, required:true},
author:{type:String, required:true},
price:{type:Number, required:true},
    category: {
        type: String,
        enum: {
            values: ["Fiction", "Science", "SelfDevelopment", "Poetry", "Religious"],
            message:"{VALUE} is not a valid category.",
        },
        required: true
    },
description:{type:String, required:true},
quantity:{type:Number, required:true},
inStock:{type:Boolean, required:true},
})

export const Book = model<IBook>('Book', bookSchema);