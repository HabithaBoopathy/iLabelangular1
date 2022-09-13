import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  constructor(private http:HttpClient) { }

  contact(){
    alert("Please contact Administrator")
  }

  ngOnInit(): void {
  }

}
