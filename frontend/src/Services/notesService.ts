import Api from "./api";
import type { Note } from "../Types";


export const createNote = async (noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const response = await Api.post('/notes', noteData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await Api.get('/notes');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateNote = async (noteId: string, noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const response = await Api.put(`/notes/${noteId}`, noteData);       

    return response.data;
  }
    catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await Api.delete(`/notes/${noteId}`);
    } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNoteById = async (noteId: string): Promise<Note> => {
    try {
    const response = await Api.get(`/notes/${noteId}`);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};


    