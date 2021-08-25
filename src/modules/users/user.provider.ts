import { User } from "./models/user.entity";
import { UserRequests } from "./models/userRequests.entity";

export const usersProvider = {
  provide: "UserRepository",
  useValue: User,
};

export const usersRequestsProvider = {
  provide: "UserRequestsRepository",
  useValue: UserRequests,
};


