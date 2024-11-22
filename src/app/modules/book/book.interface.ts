
export enum Category {
    Fiction="Fiction",
    Science="Science",
    SelfDevelopment="SelfDevelopment",
    Poetry="Poetry",
    Religious="Religious"
}

export default interface IBook{
title:string,
author:string,
price:number,
category:Category,
description:string,
quantity:number,
inStock:boolean
}