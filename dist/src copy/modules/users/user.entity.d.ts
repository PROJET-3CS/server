import { Model } from "sequelize-typescript";
declare enum Gender {
    female = "female",
    male = "male"
}
export declare class User extends Model {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    gender: Gender;
    birdthDay: String;
    birthPlace: String;
    adress: String;
    phone: Number;
    avaialable: Boolean;
    speciality: String;
    typePatient: String;
    status: Boolean;
    role: Number;
    age: number;
}
export {};
