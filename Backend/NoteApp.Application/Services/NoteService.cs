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

        public async Task<NoteModel> AddAsync(NoteCreateRequestDto noteDto)
        {

             var note = new Note
             {
                 Id = Guid.NewGuid(),
                 Title = noteDto.Title,
                 Content = noteDto.Content,
                 CreatedAt = DateTime.UtcNow,
                 UserId = noteDto.UserId,
                 Status = NoteStatus.Active
             };

             await NoteRepository.AddAsync(note);

             return _mapper.Map<NoteModel>(note);
        }

        public async Task DeleteAsync(NoteDeleteRequestDto noteDto)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Status = NoteStatus.Deleted;
            await NoteRepository.UpdateAsync(note);
        }

        public async Task<IEnumerable<NoteModel>> GetAllAsync()
        {
            var notes = await NoteRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NoteModel>>(notes.Where(note => note.Status != NoteStatus.Deleted));
        }

        public async Task<NoteModel?> GetByIdAsync(Guid id)
        {
            var note = await NoteRepository.GetByIdAsync(id);
            return note == null || note.Status == NoteStatus.Deleted ? null : _mapper.Map<NoteModel>(note);
        }
        

        public async Task<NoteModel> UpdateAsync(NoteUpdateRequestDto noteDto)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Title = noteDto.Title;
            note.Content = noteDto.Content;

            await NoteRepository.UpdateAsync(note);

            return _mapper.Map<NoteModel>(note);
        }

        public async Task ArchiveAsync(NoteArchiveRequestDto noteDto)
        {
            var note = await NoteRepository.GetByIdAsync(noteDto.Id);
            if (note == null || note.Status == NoteStatus.Deleted)
            {
                throw new NoteNotFound($"Note with ID {noteDto.Id} not found.");
            }

            note.Status = NoteStatus.Archived;
            await NoteRepository.UpdateAsync(note);
        }


    }
}
