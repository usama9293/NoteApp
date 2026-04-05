using NoteApp.Core.Interfaces;
using NoteApp.Core.Dtos;
using NoteApp.Core.Entities;



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

        public async Task<string> RegisterAsync(UserCreateRequestDto userDto)
        {
            var existingUser = await UserRepo.FindByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email already exists.");
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

            return "User registered successfully.";
        }

        public async Task<string> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await UserRepo.FindByEmailAsync(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                throw new Exception("Invalid email or password.");
            }

            var token = JwtService.GenerateToken(user);
            return token;
        }
    }
}
