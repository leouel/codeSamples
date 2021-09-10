using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Addresses
{
    public class AddressAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LineOne { get; set; }
        public int SuiteNumber { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string City { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string State { get; set; }
        [Required]
        [StringLength(5, MinimumLength = 5)]
        public string PostalCode { get; set; }
        public bool IsActive { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
    }
}
