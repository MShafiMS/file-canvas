import { IUser } from '@stores';
import { http } from './http.service';

export class UserService {
  loadLoggedInUser = async (user: IUser) => {
    try {
      const res = await http.default.post('/user', user);
      return res.data.data;
    } catch (error) {
      console.error('Error creating sketch:', error);
      throw error;
    }
  };
}

const userService = new UserService();
export default userService;
