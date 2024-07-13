import { IFileModel } from '@stores';
import { http } from './http.service';

export class FileService {
  async upsertFile(file: IFileModel) {
    try {
      const res = await http.default.post(`/files/${file._id}`, file);
      return res.data.data;
    } catch (error) {
      console.error('Error upserting file:', error);
      throw error;
    }
  }

  async uploadFile(file: IFileModel[]) {
    try {
      const res = await http.default.post(`/files`, file);
      return res.data.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFileById(id: string) {
    try {
      const res = await http.default.get(`/files/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async getFilesByUser(user: string) {
    try {
      const res = await http.default.get('/files', {
        params: {
          user: user,
        },
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async deleteFileById(id: string) {
    try {
      await http.default.delete(`/files/${id}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

const fileService = new FileService();
export default fileService;
