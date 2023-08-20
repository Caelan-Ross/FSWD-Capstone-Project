using Battery_Doctor.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class BatteryGroup
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("groupd_id", TypeName = "int(10)")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("group_name", TypeName = "varchar(50)")]
    public string GroupName { get; set; }

    [Required]
    [Column("length")]
    public float Length { get; set; }

    [Required]
    [Column("width")]
    public float Width { get; set; }

    [Required]
    [Column("height")]
    public float Height { get; set; }

    [Required]
    [ForeignKey("Unit")]
    [Column("unit_id", TypeName = "int(10)")]
    public int UnitId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual Unit Unit { get; set; }
}
