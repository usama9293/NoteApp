using NoteApp.Core.Interfaces;
using NoteApp.Core.Dtos;
using NoteApp.Core.Entities;
using NoteApp.Core.Exceptions;
using NoteApp.Core.Models;
using NoteApp.Core.Enums;
using AutoMapper;



namespace NoteApp.Application.Services
{
    public class NoteService : INoteService
    {
       
            public IGenericRepository<Note> NoteRepository { get; }
            private readonly IMapper _mapper;




        public NoteService( IGenericRepository<Note> noteRepository, IMapper mapper)
        {
            NoteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<NoteModel> AddAsync(NoteCreateRequestDto noteDto, Guid userId)
        {

             var note = new Note
             {
                 Id = Guid.NewGuid(),
                 Title = noteDto.Title,
                 Content = noteDto.Content,
                 CreatedAt = DateTime.UtcNow,
                 UserId = userId,
                 Status = NoteStatus.Active
             };

             await NoteRepository.AddAsync(note);

             return _mapper.Map<NoteModel>(note);
        }

        public async Task DeleteAsync(NoteDeleteRequestDto noteDto, Guid userId)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted || note.UserId != userId)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Status = NoteStatus.Deleted;
            await NoteRepository.UpdateAsync(note);
        }

        public async Task<IEnumerable<NoteModel>> GetAllAsync(Guid userId)
        {
            var notes = await NoteRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NoteModel>>(notes.Where(note => note.UserId == userId && note.Status != NoteStatus.Deleted));
        }

        public async Task<NoteModel?> GetByIdAsync(Guid id, Guid userId)
        {
            var note = await NoteRepository.GetByIdAsync(id);
            return note == null || note.Status == NoteStatus.Deleted || note.UserId != userId ? null : _mapper.Map<NoteModel>(note);
        }
        

        public async Task<NoteModel> UpdateAsync(NoteUpdateRequestDto noteDto, Guid userId)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted || note.UserId != userId)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Title = noteDto.Title;
            note.Content = noteDto.Content;

            await NoteRepository.UpdateAsync(note);

            return _mapper.Map<NoteModel>(note);
        }

        public async Task ArchiveAsync(NoteArchiveRequestDto noteDto, Guid userId)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted || note.UserId != userId)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Status = NoteStatus.Archived;
            await NoteRepository.UpdateAsync(note);
        }


        public async Task<PagedResult<NoteModel>> SearchAsync(NoteSearchRequestDto searchDto, Guid userId)
        {
            var notes = await NoteRepository.GetAllAsync();
            var query = notes.Where(note => note.UserId == userId).AsQueryable();

            if (!searchDto.IncludeDeleted)
            {
                query = query.Where(note => note.Status != NoteStatus.Deleted);
            }

            if (searchDto.Status.HasValue)
            {
                query = query.Where(note => note.Status == searchDto.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchDto.Title))
            {
                query = query.Where(note => note.Title.Contains(searchDto.Title, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(searchDto.Content))
            {
                query = query.Where(note => note.Content.Contains(searchDto.Content, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
            {
                query = query.Where(note =>
                    note.Title.Contains(searchDto.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                    note.Content.Contains(searchDto.SearchTerm, StringComparison.OrdinalIgnoreCase));
            }

            if (searchDto.FromCreatedAt.HasValue)
            {
                query = query.Where(note => note.CreatedAt >= searchDto.FromCreatedAt.Value);
            }

            if (searchDto.ToCreatedAt.HasValue)
            {
                query = query.Where(note => note.CreatedAt <= searchDto.ToCreatedAt.Value);
            }

            query = searchDto.SortBy switch
            {
                NoteSort.CreatedAt => searchDto.SortOrder == NoteSortOrder.Descending ? query.OrderByDescending(n => n.CreatedAt) : query.OrderBy(n => n.CreatedAt),
                NoteSort.UpdatedAt => searchDto.SortOrder == NoteSortOrder.Descending ? query.OrderByDescending(n => n.UpdatedAt) : query.OrderBy(n => n.UpdatedAt),
                NoteSort.Title => searchDto.SortOrder == NoteSortOrder.Descending ? query.OrderByDescending(n => n.Title) : query.OrderBy(n => n.Title),
                _ => query.OrderByDescending(n => n.CreatedAt)
            };

            var totalCount = query.Count();
            var pageNumber = searchDto.PageNumber < 1 ? 1 : searchDto.PageNumber;
            var pageSize = searchDto.PageSize < 1 ? 10 : searchDto.PageSize;
            var items = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResult<NoteModel>
            {
                Items = _mapper.Map<IEnumerable<NoteModel>>(items),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }



    }
}
