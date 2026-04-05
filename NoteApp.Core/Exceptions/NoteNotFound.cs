using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Exceptions
{
    public class NoteNotFound : Exception
    {
        public NoteNotFound(string message) : base(message) { }
        public NoteNotFound() : base("Note not found") { }
        
    }
}
