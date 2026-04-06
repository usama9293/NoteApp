using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Dtos
{
    public class NoteUpdateRequestDto
    {
        
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        
    }
}
