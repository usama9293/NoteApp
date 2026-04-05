using Microsoft.AspNetCore.Mvc;
using NoteApp.Core.Dtos;
using NoteApp.Core.Interfaces;


namespace NoteApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        public IAuthService AuthService { get; }

        public UserController(IAuthService authService)
        {
            AuthService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserCreateRequestDto userDto)
        {
            try
            {
                var result = await AuthService.RegisterAsync(userDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                var result = await AuthService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
