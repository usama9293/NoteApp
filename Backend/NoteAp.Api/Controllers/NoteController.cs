using Microsoft.AspNetCore.Mvc;
using NoteApp.Core.Dtos;
using NoteApp.Core.Interfaces;



namespace NoteApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoteController : ControllerBase
    {

        private readonly INoteService _noteService;

        public NoteController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notes = await _noteService.GetAllAsync();
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var note = await _noteService.GetByIdAsync(id);
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> Create(NoteCreateRequestDto noteDto)
        {
            var note = await _noteService.AddAsync(noteDto);
            return Ok(note);
        }

        [HttpPut]
        public async Task<IActionResult> Update(NoteUpdateRequestDto noteDto)
        {
            var note = await _noteService.UpdateAsync(noteDto);
            return Ok(note);
        }

        [HttpPatch("archive")]
        public async Task<IActionResult> Archive(NoteArchiveRequestDto noteDto)
        {
            await _noteService.ArchiveAsync(noteDto);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(NoteDeleteRequestDto noteDto)
        {
            await _noteService.DeleteAsync(noteDto);
            return Ok();
        }
        
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] NoteSearchRequestDto searchDto)
        {
            var notes = await _noteService.SearchAsync(searchDto);
            return Ok(notes);
        }

    }
}
