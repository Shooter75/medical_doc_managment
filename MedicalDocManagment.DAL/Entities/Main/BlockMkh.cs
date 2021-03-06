﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalDocManagment.DAL.Entities
{
    [Table("BlocksMkh")]
    public class BlockMkh
    {
        [Key]
        public string Id { get; set; }

        [StringLength(200)]
        [Column("BlockName")]
        public string Name { get; set; }

        public string ClassId { get; set; }

        [ForeignKey("ClassId")]
        public virtual ClassMkh ClassMkh { get; set; }

        public virtual ICollection<NosologyMkh> NosologiesMkh { get; set; }
    }
}
