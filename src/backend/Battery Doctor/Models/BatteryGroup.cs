using Battery_Doctor.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class BatteryGroup
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string GroupName { get; set; }

    [Required]
    [Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
    public float Length { get; set; }

    [Required]
    [Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
    public float Width { get; set; }

    [Required]
    [Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
    public float Height { get; set; }

    [Required]
    public int UnitId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    [ForeignKey("UnitId")]
    public Unit Unit { get; set; }
}
