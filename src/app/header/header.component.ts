import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalVariableService } from '../services/common/global-variable.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLightTheme = true;
  result: any;
  error = "false";
  errorMessage = "";
  userName: any = '';

  constructor(private router: Router, private _activatedRoute: ActivatedRoute, private usersService: UserService) {
    this.result = JSON.parse(sessionStorage.getItem('currentUser') || "null");
  }

  ngOnInit(): void {
    var sessVal = sessionStorage.getItem('currentUser');
    this.userName = JSON.parse(sessionStorage.getItem('currentUser') || "null");
    if (sessVal == null) {
      this.router.navigate(['login']);
    }
  }


  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

}
