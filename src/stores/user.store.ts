import userService from '@services/user.service';
import { flow, Instance, types as t } from 'mobx-state-tree';
import { User } from './models';

export const UserStore = t
  .model('UserStore', {
    userMap: t.map(User),
    isLoading: t.optional(t.boolean, false),
    loggedInUserId: t.maybeNull(t.string),
  })
  .views((self) => ({
    get users() {
      return Array.from(self.userMap.values());
    },
  }))
  .actions((self) => ({
    loadLoggedInUser: flow(function* (user: any) {
      const userRes = yield userService.loadLoggedInUser(user);
      self.isLoading = true;
      if (userRes) {
        self.userMap.put(userRes);
        self.loggedInUserId = userRes._id;
      }
      self.isLoading = true;
    }),
  }))
  .views((self) => ({
    get loggedInUser() {
      return self.users.find((user) => user._id === self.loggedInUserId);
    },
  }));

export type IUserStore = Instance<typeof UserStore>;
