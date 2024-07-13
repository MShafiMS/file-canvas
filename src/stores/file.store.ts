import { FILE } from '@enums';
import ObjectID from 'bson-objectid';
import { flow, getRoot, Instance, types as t } from 'mobx-state-tree';
import { FileModel, IFileModel } from './models';
import { IStore } from './root.store';

export const FileStore = t
  .model('FileStore', {
    filesMap: t.map(FileModel),
    selectedFileId: t.maybeNull(t.string),
    isLoading: t.optional(t.boolean, false),
    uploading: t.optional(t.boolean, false),
  })
  .actions((self) => ({
    addFiles(files: IFileModel[]) {
      files.forEach((file) => {
        self.filesMap.set(file._id, file);
      });
    },
  }))
  .views((self) => ({
    get files() {
      return Array.from(self.filesMap.values());
    },
  }))
  .actions((self) => ({
    uploadFiles: flow(function* (files: File[]) {
      const createdBy = getRoot<IStore>(self).userStore.loggedInUserId;
      if (!files.length || !createdBy) return;
      self.uploading = true;
      const filesPromises = files.map(async (file) => {
        const base64 = await fileToBase64(file);
        const fileType = file.type === 'application/pdf' ? FILE.PDF : FILE.IMG;
        return FileModel.create({
          _id: ObjectID().toHexString(),
          name: file.name,
          fileName: file.name,
          fileType,
          base64,
          createdBy,
        });
      });
      const newFiles = yield Promise.all(filesPromises);
      // const existingFiles = JSON.parse(Store.get('Files') || '[]');
      // const updatedFiles = [...existingFiles, ...newFiles];
      // Store.set('Files', JSON.stringify(updatedFiles));
      self.addFiles(newFiles);
      self.uploading = false;
    }),

    loadFiles: flow(function* () {
      const createdBy = getRoot<IStore>(self).userStore.loggedInUserId;
      if (!createdBy) return;
      self.isLoading = true;
      // const files = JSON.parse(Store.get('Files') || '[]');
      // if (files) self.addFiles(files);
      self.isLoading = false;
    }),
  }));

export type IFileStore = Instance<typeof FileStore>;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string); // Cast to string
    reader.onerror = (error) => reject(error);
  });
}
