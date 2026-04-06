using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using NoteApp.Application.Data;

namespace NoteApp.Api.Data
{
    public class ApDbContextFactory : IDesignTimeDbContextFactory<ApDbContext>
    {
        public ApDbContext CreateDbContext(string[] args)
        {
            var configuration = BuildConfiguration();
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is missing in configuration.");

            var optionsBuilder = new DbContextOptionsBuilder<ApDbContext>();
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new ApDbContext(optionsBuilder.Options);
        }

        private static IConfigurationRoot BuildConfiguration()
        {
            var basePath = FindApiProjectDirectory();

            return new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: false)
                .AddEnvironmentVariables()
                .Build();
        }

        private static string FindApiProjectDirectory()
        {
            var currentDirectory = new DirectoryInfo(Directory.GetCurrentDirectory());

            while (currentDirectory is not null)
            {
                var apiProjectDirectory = Path.Combine(currentDirectory.FullName, "NoteAp.Api");
                if (File.Exists(Path.Combine(apiProjectDirectory, "appsettings.json")))
                {
                    return apiProjectDirectory;
                }

                if (File.Exists(Path.Combine(currentDirectory.FullName, "appsettings.json")))
                {
                    return currentDirectory.FullName;
                }

                currentDirectory = currentDirectory.Parent;
            }

            return Directory.GetCurrentDirectory();
        }
    }
}