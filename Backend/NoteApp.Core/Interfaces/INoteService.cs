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
       
        Task<IEnumerable<NoteModel>> GetAllAsync();
        Task<NoteModel?> GetByIdAsync(Guid id);
        Task<NoteModel> AddAsync(NoteCreateRequestDto noteDto);
        Task<NoteModel> UpdateAsync(NoteUpdateRequestDto noteDto);
        Task<PagedResult<NoteModel>> SearchAsync(NoteSearchRequestDto searchDto);
        Task ArchiveAsync(NoteArchiveRequestDto noteDto);
        Task DeleteAsync(NoteDeleteRequestDto noteDto);

    }
}