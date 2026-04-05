using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Exceptions
{
    public class    UserAlreadyExists : Exception
    {
        public UserAlreadyExists(string message) : base(message) { }
        public UserAlreadyExists() : base("User already exists") { }
        
    }
}
