using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Dtos
{
    public class NoteCreateRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        
    }
}
