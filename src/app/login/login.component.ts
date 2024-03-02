import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loading = false;
  error = "false";
  errorMessage = '';
  result: any;
  userCredentials: any = {};

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private userService: UserService,
    private router: Router,
    private _router: ActivatedRoute) {
    this._router.queryParams.subscribe(params => {
      this.error = params['error'];
      this.errorMessage = params['errorMessage'];
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.loading = true;
    this.error = "false";
    // console.warn("warn: ", this.loginForm.value);

    this.userCredentials = { email: this.loginForm.value.email, password: this.loginForm.value.password };
    this.userService.doLogin(this.userCredentials).subscribe(
      data => {
        this.result = data;
        console.log("resultStatus: ", this.result);

        if (this.result.success == false) {
          this.error = "true";
          this.loading = false;
          this.errorMessage = "Invalid User name or password";
        } else {
          if (this.result.success == true) {
            console.log("result: ", this.result.search[0]);
            this.setSession(this.result.search[0]);
            // this._router.navigate(['/index'], { relativeTo: this._activatedRoute });
            this.router.navigate(['./home']);
          }
        }

        // if (this.result.status == 1) {
        //   this.setSession(this.result);
        //   this.router.navigate(['./index']);
        // } else {
        //   this.error = "true";
        //   this.loading = false;
        //   this.errorMessage = "Invalid Email or Password...";
        // }
      },
      err => {
        this.error = "true";
        this.errorMessage = err.message;
        this.loading = false;
      },
      () => {
        // this.loading = false;
      }
    );

  }

  private setSession(authResult: any) {
    // const expiresAt = moment().add(authResult.expires_in, authResult.expireTimeUnit);
    sessionStorage.setItem('currentUser', JSON.stringify({ user_name: authResult.name, user_id: authResult.user_id, user_type_id: authResult.user_type_id, email: authResult.email }));
    // localStorage.setItem('id_token', authResult.access_token);
    // localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}