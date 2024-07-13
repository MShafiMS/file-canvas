import { FILE } from '@enums';
import { Instance, types as t } from 'mobx-state-tree';

export const FileModel = t
  .model('FileModel', {
    _id: t.identifier,
    name: t.string,
    fileName: t.string,
    fileType: t.enumeration('FILE', Object.values(FILE)),
    base64: t.string,
    createdBy: t.string,
    parentId: t.maybe(t.string),
    versions: t.maybe(t.array(t.string)),
  })
  .views((self) => ({
    get downloadUrl() {
      return base64ToObjectURL(self.base64);
    },
  }));

export type IFileModel = Instance<typeof FileModel>;

function base64ToObjectURL(base64: string): string {
  const byteCharacters = atob(base64.split(',')[1]); // Decode base64 string
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteNumbers]); // No MIME type specified
  return URL.createObjectURL(blob);
}
