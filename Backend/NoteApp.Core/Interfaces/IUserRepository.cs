using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Entities;

namespace NoteApp.Core.Interfaces
{
    public interface IUserRepository
    {

        Task<User?> FindByEmailAsync(string email);
    }
}
