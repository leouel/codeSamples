using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
	// for data coming from the database
	public class Address : BaseAddress
    {

		//public int Id { get; set; }
		//public string LineOne { get; set; }
		//public int SuiteNumber { get; set; }
		//public string City { get; set; }
		//public string State { get; set; }
		//public string PostalCode { get; set; }
		public bool IsActive { get; set; }
		public double Lat { get; set; }
		public double Long { get; set; }

	}
}
