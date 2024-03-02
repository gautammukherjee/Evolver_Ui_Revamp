import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
//import * as moment from "moment";
import moment from "moment";

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) { }

  doLogin(data: any) {
    return this.http.post(API_URL + 'login', data, httpOptions);
  }

  getCurrentUser(): any {
    return sessionStorage.getItem('currentUser');
  }

  isLoggednIn() {
    //return JSON.parse(this.getCurrentUser()) !== null;
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggednIn();
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  getExpiration() {
    const expiration: any = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getLoginUserStats() { // To show the user stats
    return this.http.get(API_URL + 'getLoginUserStats');
  }

  changeLoginPwd(params: any) {
    //let result = Object.values(params);//Converting object into array.
    //console.log("In Service - Current pwd =: "+result[0]);
    //console.log("In Service - New pwd: "+result.toString());
    return this.http.post(API_URL + 'changeLoginPwd', params, httpOptions);
  }

  getContactus(params: any) {
    //let result = Object.values(params);//Converting object into array.
    //console.log("In Service - Current pwd =: "+result[0]);
    //console.log("In Service - New pwd: "+result.toString());
    return this.http.post(API_URL + 'getContactus', params, httpOptions);
  }

}
