using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Models
{
    public class NoteModel
    {
        
            public Guid Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public Guid UserId { get; set; }

    }
}
