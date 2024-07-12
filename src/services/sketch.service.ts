import { http } from './http.service';

export class SketchService {
  getAllSketches = async (user: string) => {
    try {
      const res = await http.default.get('/sketches', {
        params: {
          user: user,
        },
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching sketches:', error);
      throw error; // Re-throw the error to be caught by the caller if needed
    }
  };

  getSketchById = async (id: string) => {
    try {
      const res = await http.default.get(`/sketches/${id}`);
      return res.data.data;
    } catch (error) {
      console.error(`Error fetching sketch with id ${id}:`, error);
      throw error;
    }
  };

  createSketch = async (sketchData: any) => {
    try {
      const res = await http.default.post('/sketches', sketchData);
      return res.data.data;
    } catch (error) {
      console.error('Error creating sketch:', error);
      throw error;
    }
  };

  updateSketch = async (id: string, sketchData: any) => {
    try {
      const res = await http.default.put(`/sketches/${id}`, sketchData);
      return res.data.data;
    } catch (error) {
      console.error(`Error updating sketch with id ${id}:`, error);
      throw error;
    }
  };

  deleteSketch = async (id: string) => {
    try {
      const res = await http.default.delete(`/sketches/${id}`);
      return res.data.data;
    } catch (error) {
      console.error(`Error deleting sketch with id ${id}:`, error);
      throw error;
    }
  };
}

const sketchService = new SketchService();
export default sketchService;
