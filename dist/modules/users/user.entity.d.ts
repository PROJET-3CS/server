import { Model } from "sequelize-typescript";
import { Gender } from "../../shared/enums/gender.enum";
export declare class User extends Model {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    password: String;
    gender: Gender;
    birdthDay: String;
    birthPlace: String;
    adress: String;
    phone: Number;
    avaialable: Boolean;
    speciality: String;
    typePatient: String;
    status: String;
    role: Number;
    age: Number;
    token: String;
}
