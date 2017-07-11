import { Component, OnInit} from '@angular/core';
import { AuthenticationService } from "app/services/authentication/auth.service";

@Component({
  selector: 'fw-framework-body',
  templateUrl: './framework-body.component.html',
  styleUrls: ['./framework-body.component.css']
})
export class FrameworkBodyComponent implements OnInit {
  constructor(private authService:AuthenticationService ){ }
  ngOnInit() {

  }
}
