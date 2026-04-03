using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Interfaces
{
    public interface IGenericRepository
    {

        public Task<T> GetByIdAsync<T>(Guid id) where T : class;

        public Task<IEnumerable<T>> GetAllAsync<T>() where T : class;

        public Task AddAsync<T>(T entity) where T : class;


        public Task UpdateAsync<T>(T entity) where T : class;
        public Task DeleteAsync<T>(T entity) where T : class;

            
    }
}
