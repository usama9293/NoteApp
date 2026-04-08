import Api from "./api";
import type { Note } from "../Types";


export const createNote = async (noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const response = await Api.post('/note', noteData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await Api.get('/note');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateNote = async (noteId: string, noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const response = await Api.put(`/note/${noteId}`, noteData);       

    return response.data;
  }
    catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await Api.delete(`/note`, { data: { id: noteId } });
    } catch (error) {
    console.error(error);
    throw error;
  }
};

export const archiveNote = async (id: string): Promise<void> => {
  try {
    await Api.patch('/note/archive', { id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNoteById = async (noteId: string): Promise<Note> => {
    try {
    const response = await Api.get(`/note/${noteId}`);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};


    