import Api from "./api";
import type {
  AuthResponseDto,
  LoginRequestDto,
  UserCreateRequestDto,
} from "../Types";



export const register = async (userData: UserCreateRequestDto): Promise<AuthResponseDto> => {
  try {
    const response = await Api.post('/user/register', userData);
    return response.data;
    } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (credentials: LoginRequestDto): Promise<AuthResponseDto> => {
  try {
    const response = await Api.post('/user/login', credentials);    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



