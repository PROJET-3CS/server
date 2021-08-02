import { Gender } from "../../../shared/enums/gender.enum";
export declare class UserDto {
    firstname: String;
    lastname: String;
    email: String;
    gender: Gender;
    bird: any;
    thDay: String;
    birthPlace: String;
    adress: String;
    phone: Number;
    speciality?: String;
    typePatient?: String;
}
