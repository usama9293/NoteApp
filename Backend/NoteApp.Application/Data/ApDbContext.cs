using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace NoteApp.Application.Data
{
    public class ApDbContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }

        public ApDbContext(DbContextOptions<ApDbContext> options) : base(options)
        {


        }


    }
}
