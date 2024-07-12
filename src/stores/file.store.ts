import { FILE } from '@enums';
import fileService from '@services/file.service';
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
      // self.uploading = true;
      files.forEach((file) => {
        const fileType = file.type === 'application/pdf' ? FILE.PDF : FILE.IMG;
        const newFile = FileModel.create({
          _id: ObjectID().toHexString(),
          name: file.name,
          fileName: file.name,
          fileType,
          downloadUrl: URL.createObjectURL(file),
          createdBy,
        });
        self.filesMap.set(newFile._id, newFile);
      });
      // const response = yield fileService.uploadToFileDB(files);
      // if (response) {
      //   console.log(response);

      //   const newFiles = response.map((file: any, index: number) => {
      //     const fileType = files[index].type === 'application/pdf' ? FILE.PDF : FILE.IMG;
      //     return {
      //       name: file.name,
      //       fileName: file.name,
      //       fileType,
      //       downloadUrl: file.id,
      //       createdBy,
      //     };
      //   });

      //   const res = yield fileService.uploadFile(newFiles);
      //   if (res) self.addFiles(res);
      //   console.log(res);
      // }

      self.uploading = false;
    }),

    loadFiles: flow(function* () {
      const createdBy = getRoot<IStore>(self).userStore.loggedInUserId;
      if (!createdBy) return;
      self.isLoading = true;
      const res = yield fileService.getFilesByUser(createdBy);
      if (res) self.addFiles(res);
      self.isLoading = false;
    }),
  }));

export type IFileStore = Instance<typeof FileStore>;
