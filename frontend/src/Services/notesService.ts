import Api from "./api";


export const createNote = async (noteData: { title: string; content: string }) => {
  try {
    const response = await Api.post('/notes', noteData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

};

export const getNotes = async () => {
  try {
    const response = await Api.get('/notes');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateNote = async (noteId: string, noteData: { title: string; content: string }) => {
  try {
    const response = await Api.put(`/notes/${noteId}`, noteData);       

    return response.data;
  }
    catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const response = await Api.delete(`/notes/${noteId}`);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNoteById = async (noteId: string) => {
    try {
    const response = await Api.get(`/notes/${noteId}`);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};


    