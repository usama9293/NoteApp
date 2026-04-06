using System;
using System.Collections.Generic;
using System.Text;

namespace NoteApp.Core.Exceptions
{
    public class UserNotFound : Exception
    {
        public UserNotFound(string message) : base(message) { }
        public UserNotFound() : base("User not found") { }
    }
}
