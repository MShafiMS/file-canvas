import { templates } from '@constant';
import { Instance, applySnapshot, destroy, types as t } from 'mobx-state-tree';
import { useMemo } from 'react';
import { FileStore, IFileStore } from './file.store';
import { ISketch } from './models';
import { ISketchStore, SketchStore } from './sketch.store';
import { IUserStore, UserStore } from './user.store';

export const RootStore = t
  .model('RootStore', {
    userStore: t.optional(UserStore, {}),
    fileStore: t.optional(FileStore, {}),
    sketchStore: t.optional(SketchStore, {
      templates: templates as unknown as ISketch[],
    }),
    isLoadingIntitalData: t.optional(t.boolean, false),
    isLoadedIntitalData: t.optional(t.boolean, false),
  })
  .actions((self) => {
    const reset = () => {
      destroy(self.userStore);
      destroy(self.sketchStore);
      destroy(self.fileStore);
    };

    return { reset };
  });

export interface IStore {
  userStore: IUserStore;
  fileStore: IFileStore;
  sketchStore: ISketchStore;
}

export type IRootStore = Instance<typeof RootStore>;

let store: IRootStore | undefined;

export function initializeStore(snapshot = null) {
  const _store = store ?? RootStore.create({});

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return store;
}

export function useStores(initialState?: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

// Access store outside of react component
export const appStores = initializeStore();
