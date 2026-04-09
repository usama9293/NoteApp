using NoteApp.Core.Enums;
using System.ComponentModel.DataAnnotations;



namespace NoteApp.Core.Dtos
{
    public class NoteSearchRequestDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public NoteStatus? Status { get; set; }

        public string SearchTerm { get; set; } = string.Empty;

        public DateTime? FromCreatedAt { get; set; } = null;

        public DateTime? ToCreatedAt { get; set; } = null;

        public bool IncludeDeleted { get; set; } = false;

        [Range(1, int.MaxValue)]
        public int PageSize { get; set; } = 10;

        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;
    

        public NoteSort SortBy { get; set; } = NoteSort.CreatedAt;

        public NoteSortOrder SortOrder { get; set; } = NoteSortOrder.Descending;


        

    



    }

    
}