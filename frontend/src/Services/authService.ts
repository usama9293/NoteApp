import Api from "./api";




export const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
  try {
    const response = await Api.post('/user/register', userData);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await Api.post('/user/login', credentials);    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



