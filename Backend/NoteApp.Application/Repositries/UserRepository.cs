using Microsoft.EntityFrameworkCore;
using NoteApp.Application.Data;
using NoteApp.Core.Entities;
using NoteApp.Core.Interfaces;

namespace NoteApp.Application.Repositories
{
    public class UserRepository : IUserRepository
    {
        public ApDbContext DbContext { get; }

        public UserRepository(ApDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public Task<User?> FindByEmailAsync(string email)
        {
            return DbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
