import { FILE } from '@enums';
import axios from 'axios';
import { flow, Instance, types as t } from 'mobx-state-tree';

export const FileModel = t
  .model('FileModel', {
    _id: t.identifier,
    name: t.string,
    fileName: t.string,
    fileType: t.enumeration('FILE', Object.values(FILE)),
    downloadUrl: t.string,
    createdBy: t.string,
    parentId: t.maybe(t.string),
    versions: t.maybe(t.array(t.string)),
  })
  .actions((self) => ({
    refreshDownloadUrl: flow(function* () {
      const data = yield axios.get(`https://api.pdfrest.com/resource/${self.downloadUrl}?format=url`);
      if (data.url) self.downloadUrl = data.url;
    }),
  }));

export type IFileModel = Instance<typeof FileModel>;
