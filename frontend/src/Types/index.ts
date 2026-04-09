

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
    status: NoteStatusType;
};

export const NoteStatus = {
    Active: 0,
    Archived: 1,
    Deleted: 2,
} as const;

export type NoteStatusType = (typeof NoteStatus)[keyof typeof NoteStatus];

export const NoteSort = {
    CreatedAt: 0,
    UpdatedAt: 1,
    Title: 2,
} as const;

export type NoteSortType = (typeof NoteSort)[keyof typeof NoteSort];

export const NoteSortOrder = {
    Ascending: 0,
    Descending: 1,
} as const;

export type NoteSortOrderType = (typeof NoteSortOrder)[keyof typeof NoteSortOrder];

export type NoteSearchRequestDto = {
    title?: string;
    content?: string;
    status?: NoteStatusType;
    searchTerm: string;
    fromCreatedAt?: string;
    toCreatedAt?: string;
    includeDeleted: boolean;
    pageSize: number;
    pageNumber: number;
    sortBy: NoteSortType;
    sortOrder: NoteSortOrderType;
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


export type PagedResult<T> = {
    items: T[];
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
};

