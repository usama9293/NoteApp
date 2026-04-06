using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Dtos;

namespace NoteApp.Core.Interfaces
{
    public interface IAuthService 
    {
        Task<AuthResponseDto> RegisterAsync(UserCreateRequestDto userDto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto LoginDto);
       
    }
}
