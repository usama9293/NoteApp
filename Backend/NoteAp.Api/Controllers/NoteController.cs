using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoteApp.Core.Dtos;
using NoteApp.Core.Interfaces;
using System.Security.Claims;



namespace NoteApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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
            var userId = GetCurrentUserId();
            var notes = await _noteService.GetAllAsync(userId);
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetCurrentUserId();
            var note = await _noteService.GetByIdAsync(id, userId);
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> Create(NoteCreateRequestDto noteDto)
        {
            var userId = GetCurrentUserId();
            var note = await _noteService.AddAsync(noteDto, userId);
            return Ok(note);
        }

        [HttpPut]
        public async Task<IActionResult> Update(NoteUpdateRequestDto noteDto)
        {
            var userId = GetCurrentUserId();
            var note = await _noteService.UpdateAsync(noteDto, userId);
            return Ok(note);
        }

        [HttpPatch("archive")]
        public async Task<IActionResult> Archive(NoteArchiveRequestDto noteDto)
        {
            var userId = GetCurrentUserId();
            await _noteService.ArchiveAsync(noteDto, userId);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(NoteDeleteRequestDto noteDto)
        {
            var userId = GetCurrentUserId();
            await _noteService.DeleteAsync(noteDto, userId);
            return Ok();
        }
        
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] NoteSearchRequestDto searchDto)
        {
            var userId = GetCurrentUserId();
            var notes = await _noteService.SearchAsync(searchDto, userId);
            return Ok(notes);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user context.");
            }

            return userId;
        }

    }
}
