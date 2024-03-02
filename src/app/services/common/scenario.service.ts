import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private _user_scenario: any;

  constructor(private http: HttpClient) {
  }
  addUserScenario(params: any) {
    return this.http.post(API_URL + 'addUserScenario', params, httpOptions);
  }
  updateUserScenario(params: any) {
    return this.http.post(API_URL + 'updateUserScenario', params, httpOptions);
  }
  getUserScenarios(params: any) {

    return this.http.post(API_URL + 'getUserScenarios', params, httpOptions);
    // console.log("params: ", params);
    // if (this._user_scenario) {
    //   return of(this._user_scenario);
    // } else {
    //   // return this.http.post(API_URL + 'getUserScenarios', params, httpOptions);
    //   return this.http.post(API_URL + 'getUserScenarios', params, httpOptions).pipe(
    //     tap(
    //     (data:any) => {
    //       this._user_scenario = data;
    //     })
    //   )
    // }
  }

  getPerUserScenarios(params: any) {
    return this.http.post(API_URL + 'getPerUserScenarios', params, httpOptions);
  }

  getPerUserSentenceScenarios(params: any) {
    return this.http.post(API_URL + 'getPerUserSentenceScenarios', params, httpOptions);
  }

  // getScenarioDetail(params) {
  //   return this.http.post(API_URL + 'getScenarioDetail', params, httpOptions);
  // }
  delUserScenario(params: any) {
    return this.http.post(API_URL + 'delUserScenario', params, httpOptions);
  }

  //////////
  getUserArticleSentencesDashboard(params: any) {
    return this.http.post(API_URL + 'getUserArticleSentencesDashboard', params, httpOptions);
  }

  delArticleSentencesScenario(params: any) {
    return this.http.post(API_URL + 'delArticleSentencesScenario', params, httpOptions);
  }



}
