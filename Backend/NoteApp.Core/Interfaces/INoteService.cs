using System;
using System.Collections.Generic;
using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Dtos;
using NoteApp.Core.Models;

namespace NoteApp.Core.Interfaces
{
    public interface INoteService 
    {
       
        Task<IEnumerable<NoteModel>> GetAllAsync(Guid userId);
        Task<NoteModel?> GetByIdAsync(Guid id, Guid userId);
        Task<NoteModel> AddAsync(NoteCreateRequestDto noteDto, Guid userId);
        Task<NoteModel> UpdateAsync(NoteUpdateRequestDto noteDto, Guid userId);
        Task<PagedResult<NoteModel>> SearchAsync(NoteSearchRequestDto searchDto, Guid userId);
        Task ArchiveAsync(NoteArchiveRequestDto noteDto, Guid userId);
        Task DeleteAsync(NoteDeleteRequestDto noteDto, Guid userId);

    }
}