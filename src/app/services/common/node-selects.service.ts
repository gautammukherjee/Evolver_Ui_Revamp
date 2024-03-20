import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

// import { Observable } from 'rxjs';
import { Observable, of, throwError } from "rxjs";
// import { Observable, throwError } from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/of';
// import { tap } from "rxjs/operators";
// import {tap} from 'rxjs/internal/operators';
import { tap, catchError, map } from 'rxjs/operators';
import { data } from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NodeSelectsService {
  private API_URL: string = environment.apiUrl;
  private _node_selects2: any;
  private _edge_types: any;
  private _edge_types_first: any;

  constructor(private http: HttpClient) { }

  getNodeSelects(params: any) {
    return this.http.post(this.API_URL + 'getNodeSelects', params, httpOptions);
  }

  getNodeSelects2(params: any) {
    return this.http.post(this.API_URL + 'getNodeSelects2', params, httpOptions);
  }
  getNodeSelects3(params: any) {
    return this.http.post(this.API_URL + 'getNodeSelects3', params, httpOptions);
  }

  //for CT
  getNodeSelectsCT(params: any) {
    return this.http.post(this.API_URL + 'getNodeSelectsCT', params, httpOptions);
  }

  // getCategories() {
  //   if (this._TAs) {
  //     return Observable.of(this._TAs);
  //   } else {
  //     //return this.http.get(API_URL + 'getTherapeuticAreas');
  //     return this._http.get(this.API_URL + 'getTasLists', httpOptions).do(
  //       (data: any) => {
  //         this._TAs = data;
  //       });
  //   }
  // }

  getSourceNode(params: any) {
    return this.http.post(this.API_URL + 'getSourceNode', params, httpOptions);
  }
  getDestinationNode(params: any) {
    return this.http.post(this.API_URL + 'getDestinationNode', params, httpOptions);
  }

  getSourceNode2(params: any) {
    return this.http.post(this.API_URL + 'getSourceNode2', params, httpOptions);
  }

  getSourceNode3(params: any) {
    return this.http.post(this.API_URL + 'getSourceNode3', params, httpOptions);
  }

  getDestinationNode2(params: any) {
    return this.http.post(this.API_URL + 'getDestinationNode2', params, httpOptions);
  }
  getDestinationNode3(params: any) {
    return this.http.post(this.API_URL + 'getDestinationNode3', params, httpOptions);
  }

  getEdgeTypeFirst() {
    if (this._edge_types_first) {
      return of(this._edge_types_first);
    } else {
      return this.http.get(this.API_URL + 'getEdgeTypeFirst', httpOptions).pipe(tap(
        (data: any) => {
          this._edge_types_first = data;
        })
      )
    }
  }

  // getEdgeTypeFirst() { // old
  //   return this.http.get(this.API_URL + 'getEdgeTypeFirst', httpOptions);
  // }

  getEdgeType() {
    if (this._edge_types) {
      return of(this._edge_types);
    } else {
      return this.http.get(this.API_URL + 'getEdgeType', httpOptions).pipe(tap(
        (data: any) => {
          this._edge_types = data;
        })
      )
    }
  }

  // getEdgeType() { //old
  //   return this.http.get(this.API_URL + 'getEdgeType', httpOptions);
  // }

  getMasterLists(params: any) {
    return this.http.post(this.API_URL + 'getMasterLists', params, httpOptions);
  }
  getMasterListsRevampLevelOne(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelOne', params, httpOptions);
  }
  getMasterListsRevampLevelTwo(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelTwo', params, httpOptions);
  }
  getMasterListsRevampLevelThree(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelThree', params, httpOptions);
  }
  getMasterListsRevampLevelOneCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelOneCount', params, httpOptions);
  }
  getMasterListsRevampLevelTwoCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelTwoCount', params, httpOptions);
  }
  getMasterListsRevampLevelThreeCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelThreeCount', params, httpOptions);
  }

  //new APIs UNIQUE PMID count
  getMasterListsRevampLevelOneUniquePMIDCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelOneUniquePMIDCount', params, httpOptions);
  }
  getMasterListsRevampLevelTwoUniquePMIDCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelTwoUniquePMIDCount', params, httpOptions);
  }
  getMasterListsRevampLevelThreeUniquePMIDCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampLevelThreeUniquePMIDCount', params, httpOptions);
  }
  //end PMID count

  //For download in details page
  getMasterListsRevampEdgeTypeLevelOne(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampEdgeTypeLevelOne', params, httpOptions);
  }
  getMasterListsRevampEdgeTypeLevelTwo(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampEdgeTypeLevelTwo', params, httpOptions);
  }
  getMasterListsRevampEdgeTypeLevelThree(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsRevampEdgeTypeLevelThree', params, httpOptions);
  }

  //network map
  getMasterListsMapRevampLevelOne(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelOne', params, httpOptions);
  }
  getMasterListsMapRevampLevelTwo(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelTwo', params, httpOptions);
  }
  getMasterListsMapRevampLevelThree(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelThree', params, httpOptions);
  }
  getMasterListsMapRevampLevelOneCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelOneCount', params, httpOptions);
  }
  getMasterListsMapRevampLevelTwoCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelTwoCount', params, httpOptions);
  }
  getMasterListsMapRevampLevelThreeCount(params: any) {
    return this.http.post(this.API_URL + 'getMasterListsMapRevampLevelThreeCount', params, httpOptions);
  }

  getAllRecords(params: any) {
    return this.http.post(this.API_URL + 'getAllRecords', params, httpOptions);
  }

  getEdgeTypeName(params: any): Observable<any> {
    return this.http.post(this.API_URL + 'getEdgeTypeName', params, httpOptions)
      .pipe(map((data: any) => {
        // debug error here
        // console.log("data22: ", data);
        return data.edgeTypeName;
      }),
        catchError(this.handleError)
      );
  }

  getDistributionRelationType(params: any) {
    return this.http.post(this.API_URL + 'getDistributionRelationType', params, httpOptions);
  }

  getEdgePMIDLists(params: any) {
    return this.http.post(this.API_URL + 'getEdgePMIDLists', params, httpOptions);
  }
  getEdgeTypeSentencePMIDLists(params: any) {
    return this.http.post(this.API_URL + 'getEdgeTypeSentencePMIDLists', params, httpOptions);
  }
  getCTPMIDLists(params: any) {
    return this.http.post(this.API_URL + 'getCTPMIDLists', params, httpOptions);
  }

  getPMIDListsInRelation(params: any) {
    return this.http.post(this.API_URL + 'getPMIDListsInRelation', params, httpOptions);
  }

  getEdgePMIDCount(params: any) {
    return this.http.post(this.API_URL + 'getEdgePMIDCount', params, httpOptions);
  }

  getEvidenceData(params: any) {
    return this.http.post(this.API_URL + 'getEvidenceData', params, httpOptions);
  }

  //Clinical trials services start
  getCTDiseaseAssoc(params: any) {
    return this.http.post(this.API_URL + 'getCTDiseaseAssoc', params, httpOptions);
  }

  getCTInvestigatorName(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorName', params, httpOptions);
  }

  getCTInvestigatorRole(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorRole', params, httpOptions);
  }

  getCTInvestigatorCountry(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorCountry', params, httpOptions);
  }

  getCTInvestigatorRelsByStats(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorRelsByStats', params, httpOptions);
  }

  //Clinical trials new services start
  getCTDiseaseAssoc_new(params: any) {
    return this.http.post(this.API_URL + 'getCTDiseaseAssoc_new', params, httpOptions);
  }

  getCTTrialInvestRels_new(params: any) {
    return this.http.post(this.API_URL + 'getCTTrialInvestRels_new', params, httpOptions);
  }

  getCTInvestigatorName_new(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorName_new', params, httpOptions);
  }

  getCTInvestigatorRole_new(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorRole_new', params, httpOptions);
  }

  getCTInvestigatorCountry_new(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorCountry_new', params, httpOptions);
  }

  getCTInvestigatorRelsByStats_new(params: any) {
    return this.http.post(this.API_URL + 'getCTInvestigatorRelsByStats_new', params, httpOptions);
  }
  //END NEW CT data APIS


  downloadAtricleAndEvidencesData(params: any) {
    return this.http.post(this.API_URL + 'downloadAtricleAndEvidencesData', params, httpOptions)
  }

  getEdgeTypeSce1(params: any) {
    return this.http.post(this.API_URL + 'getEdgeTypeSce1', params, httpOptions);
  }
  getEdgeTypeSce2(params: any) {
    return this.http.post(this.API_URL + 'getEdgeTypeSce2', params, httpOptions);
  }
  getEdgeTypeSce3(params: any) {
    return this.http.post(this.API_URL + 'getEdgeTypeSce3', params, httpOptions);
  }

  getArticleSentencesScenario(params: any) {
    return this.http.post(this.API_URL + 'getArticleSentencesScenario', params, httpOptions);
  }

  getConceptIdByNode(params: any) {
    // console.log("datas: ", params.node_ids);
    return this.http.post(this.API_URL + 'getConceptIdByNode', params, httpOptions);
  }

  // getUmlsDataByConceptIds(params: any) {
  //   // return this.http.post("https://uts-ws.nlm.nih.gov/rest/content/current/CUI/"+params.conceptIds+"?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8", httpOptions);
  //   return this.http.post(this.API_URL + 'getUmlsDataByConceptIds', params, httpOptions);
  // }

  // getTeams() : Observable <TeamData[]> {
  //   var urlPrefix = "http://api.football-data.org/v1/competitions/424/teams;
  //   return this.http.get<TeamData[]>(urlPrefix, httpOptions);
  //   }

  getUmlsDataByConceptIds(params: any) {
    var urlPrefix = "https://uts-ws.nlm.nih.gov/rest/content/current/CUI/" + params.conceptIds + "?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8";
    // console.log("urlPrefix: ", urlPrefix);
    return this.http.get(urlPrefix).pipe(
      catchError(this.handleError)
    );
  }

  getUmlsDataDefintionsByConceptIds(params: any) {
    let urlPrefix = "https://uts-ws.nlm.nih.gov/rest/content/2023AB/CUI/" + params.conceptIds + "/definitions?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8";
    return this.http.get(urlPrefix).pipe(
      catchError(this.handleError)
    );
  }

  getUmlsDataAtomsByConceptIds(params: any) {
    let codeUrlPrefix = "https://uts-ws.nlm.nih.gov/rest/content/2023AB/CUI/" + params.conceptIds + "/atoms?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8";
    console.log(codeUrlPrefix);
    return this.http.get(codeUrlPrefix).pipe(
      catchError(this.handleError)
    );
  }

  getUmlsDataRelationsByConceptIds(params: any) {
    let urlRelationPrefix = params.codeUrl + "/relations?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8";
    return this.http.get(urlRelationPrefix).pipe(
      catchError(this.handleError)
    );
  }

  getPMIDSearchData(params: any) {
    return this.http.post(this.API_URL + 'getPMIDSearchData', params, httpOptions)
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
      errorMessage = `API doesn't return any data.`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);


    // if (error.status === 0) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.error('An error occurred:', error.error);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong.
    //   console.error(
    //     `Backend returned code ${error.status}, body was: `, error.error);
    // }
    // // Return an observable with a user-facing error message.
    // return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
