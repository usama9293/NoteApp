using NoteApp.Core.Interfaces;
using NoteApp.Core.Dtos;
using NoteApp.Core.Entities;
using NoteApp.Core.Exceptions;



namespace NoteApp.Application.Services
{
    public class AuthService : IAuthService
    {
        public IGenericRepository<User> UserRepository { get; }
        public IUserRepository UserRepo { get; }
        public JwtService JwtService { get; }

        public AuthService(
            IGenericRepository<User> userRepository,
            IUserRepository userRepo,
            JwtService jwtService)
        {
            UserRepository = userRepository;
            UserRepo = userRepo;
            JwtService = jwtService;
        }

        public async Task<AuthResponseDto> RegisterAsync(UserCreateRequestDto userDto)
        {
            var existingUser = await UserRepo.FindByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                throw new UserAlreadyExists($"A user with the email {userDto.Email} already exists.");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password) 
            };

            await UserRepository.AddAsync(user);

            var token = JwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email
                }
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await UserRepo.FindByEmailAsync(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                throw new UserNotFound("Invalid email or password.");
            }

            var token = JwtService.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email
                }
            };
        }
    }
}
