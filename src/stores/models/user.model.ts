import { Instance, types as t } from 'mobx-state-tree';

export const User = t.model('User', {
  _id: t.identifier,
  name: t.optional(t.string, ''),
  email: t.string,
  image: t.maybe(t.string),
});

export type IUser = Instance<typeof User>;
