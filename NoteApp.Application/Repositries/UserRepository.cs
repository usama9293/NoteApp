using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using NoteApp.Core.Entities;

namespace NoteApp.Application.Repositries
{
    public class UserRepository
    {
        public DbContext DbContext { get; }

        public UserRepository(DbContext dbContext)
        {
            DbContext = dbContext;
        }
        public Task<User?> FindByEmailAsync(string email)
        {
            return DbContext.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
            
        }

    }
}
