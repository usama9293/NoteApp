

export type UserResponseDto = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    userId: string;
};

export type UserCreateRequestDto = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type LoginRequestDto = {
    email: string;
    password: string;
};

export type AuthResponseDto = {
    token: string;
    user: UserResponseDto;
};

export type AuthContextType = {
  user: UserResponseDto | null
  token: string | null
  login: (data: AuthResponseDto) => void
  logout: () => void
}