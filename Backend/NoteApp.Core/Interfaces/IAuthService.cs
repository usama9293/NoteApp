using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Dtos;

namespace NoteApp.Core.Interfaces
{
    public interface IAuthService 
    {
        Task<string> RegisterAsync(UserCreateRequestDto userDto);
        Task<string> LoginAsync(LoginRequestDto LoginDto);
       
    }
}
