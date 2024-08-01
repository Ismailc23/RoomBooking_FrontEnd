import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import baseUrl from 'src/app/services/helper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  };
  customerId: number;

  constructor(private customerService: CustomerService,private router:Router,private snack: MatSnackBar,private http:HttpClient) { }

  ngOnInit(): void {
    this.customerId = Number(sessionStorage.getItem('customerId'));
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    this.customerService.getCustomerById(this.customerId).subscribe(
      (data: any) => {
        this.customer = data;
      },
      (error) => {
        this.snack.open("Failed to load customer details!", '', { duration: 3000 });
        this.router.navigate(['customer-form'])
      }
    );
  }

  continue() {
    this.router.navigate(['availability-check-form']);
  }

  navigateToUpdate() {
    this.router.navigate([`/customer-update/${this.customerId}`]);
  }

  deleteCustomer(id:number) {
    if(confirm("Are you sure you want to delete ? ")){
      this.http.delete(`${baseUrl}/request/api/customer/${id}`,{responseType:'text'}).subscribe(
        response =>{
          Swal.fire("Success","Customer has been deleted Successfully", "success");
          sessionStorage.removeItem("customerId");
          sessionStorage.removeItem("customerName");
          this.router.navigate(['customer-form']);
        },
        error => {
          this.snack.open("Something went wrong !!",'',{
            duration:3000
          })
        }
      );
    }
  }
}
