import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RelationDistributionService {

  constructor(public _http: HttpClient) { }

  details_of_association_type(params:any){
    console.log("in service -- 1");
    return this._http.post<any>(API_URL +'details_of_association_type', params, httpOptions);
  }

  distribution_by_relation_grp(params: any){
    //console.log("in service -- 2");
    return this._http.post<any>(API_URL +'distribution_by_relation_grp', params, httpOptions);
  }

  pmid_count_gene_disease(params:any){
    return this._http.post<any>(API_URL +'pmid_count_with_gene_disease', params, httpOptions);
  }

  distribution_by_relation_grp_get_edge_type_drilldown(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_get_edge_type_drilldown', params, httpOptions);
  }

  //Revamp
  pmid_count_gene_disease_revamp_level_one(params:any){
    return this._http.post<any>(API_URL +'pmid_count_gene_disease_revamp_level_one', params, httpOptions);
  }
  pmid_count_gene_disease_revamp_level_two(params:any){
    return this._http.post<any>(API_URL +'pmid_count_gene_disease_revamp_level_two', params, httpOptions);
  }
  pmid_count_gene_disease_revamp_level_three(params:any){
    return this._http.post<any>(API_URL +'pmid_count_gene_disease_revamp_level_three', params, httpOptions);
  }
  distribution_by_relation_grp_level_one(params: any){
    //console.log("in service -- 2");
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_level_one', params, httpOptions);
  }
  distribution_by_relation_grp_level_two(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_level_two', params, httpOptions);
  }
  distribution_by_relation_grp_level_three(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_level_three', params, httpOptions);
  }

  distribution_by_relation_grp_get_edge_type_drilldown_level_one(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_get_edge_type_drilldown_level_one', params, httpOptions);
  }
  distribution_by_relation_grp_get_edge_type_drilldown_level_two(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_get_edge_type_drilldown_level_two', params, httpOptions);
  }
  distribution_by_relation_grp_get_edge_type_drilldown_level_three(params: any){
    return this._http.post<any>(API_URL +'distribution_by_relation_grp_get_edge_type_drilldown_level_three', params, httpOptions);
  }
  

}
