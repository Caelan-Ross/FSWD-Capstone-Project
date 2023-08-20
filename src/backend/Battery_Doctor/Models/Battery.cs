using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Battery_Doctor.Models
{
    public class Battery
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("battery_id", TypeName = "int(10)")]
        public int Id { get; set; }

        [ForeignKey("BatteryType")]
        [Column("type_id", TypeName = "int(10)")]
        public int TypeId { get; set; }

        [Required]
        [ForeignKey("BatteryModel")]
        [Column("model_id", TypeName = "int(10)")]
        public int ModelId { get; set; }

        [Required]
        [ForeignKey("BatteryMake")]
        [Column("make_id", TypeName = "int(10)")]
        public int MakeId { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        [Column("voltage")]
        public float Voltage { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        [Column("capacity")]
        public float Capacity { get; set; }

        [Required, Range(0, float.MaxValue, ErrorMessage = "Please enter valid float Number")]
        [Column("price")]
        public float Price { get; set; }

        [Required, Range(0, int.MaxValue, ErrorMessage = "Please enter a valid quantity")]
        [Column("quantity_on_hand")]
        public int QuantityOnHand { get; set; }

        [Required]
        [ForeignKey("BatteryGroup")]
        [Column("groupd_id", TypeName = "int(10)")]
        public int GroupId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        public virtual BatteryType BatteryType { get; set; }

        public virtual BatteryModel BatteryModel { get; set; }

        public virtual BatteryMake BatteryMake { get; set; }

        public virtual BatteryGroup BatteryGroup { get; set; }
    }
}


