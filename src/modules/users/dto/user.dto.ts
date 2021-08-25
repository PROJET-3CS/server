import { Gender } from "../../../shared/enums/gender.enum";

export class UserDto {
  firstname: String;
  lastname: String;
  email: String;
  gender: Gender;
  birthDay: String;
  birthPlace: String;
  adress: String;
  phone: Number;
  speciality?: String;
  typePatient?: String;
  age: Number;
}
