using Microsoft.EntityFrameworkCore;
using NoteApp.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Dtos;
using NoteApp.Core.Entities;



namespace NoteApp.Application.Services
{
    public class AuthService : IAuthService
    {
      
        public IGenericRepository<User> UserRepository { get; }

        public AuthService(DbContext dbContext, IGenericRepository<User> userRepository)
        {
            
            UserRepository = userRepository;
        }
         public Task<string> RegisterAsync(UserCreateRequestDto userDto)
        {

            var existingUser = UserRepository.GetAllAsync().Result.FirstOrDefault(u => u.Email == userDto.Email);
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

            UserRepository.AddAsync(user);

            return Task.FromResult("User registered successfully.");

          
        }

        public Task<string> LoginAsync(LoginRequestDto LoginDto)
        {

        var user = UserRepository.GetAllAsync().Result.FirstOrDefault(u => u.Email == LoginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(LoginDto.Password, user.Password))
        {
            throw new Exception("Invalid email or password.");
        }

        return Task.FromResult("Login successful.");
   
                 
        
        }



    }
}
