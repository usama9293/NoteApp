using System;
using System.Collections.Generic;
using System.Text;
using NoteApp.Core.Enums;

namespace NoteApp.Core.Entities
{
    public class Note
    {
        public Guid Id { get; set; } = Guid.Empty;

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }

        public User User { get; set; } = null!;

        public NoteStatus Status { get; set; } = NoteStatus.Active;

    }
}
