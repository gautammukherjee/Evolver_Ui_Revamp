import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";

declare var jQuery: any;

@Component({
  selector: 'app-ct_disease_assoc',
  templateUrl: './ct_disease_assoc.component.html',
  styleUrls: ['./ct_disease_assoc.component.scss'],
  providers: [DatePipe]
})
export class CTDiseaseAssocComponent implements OnInit {

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  loader: boolean = false;
  CTData: any = [];
  hideCardBody: boolean = false;
  loadingCTDisease = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  public isloading: boolean = false;
  diseaseAssocData: any = [];
  totlCountCTData: number = 0;
  diseaseAssocDetailsData: any = [];
  notEmptyData: boolean = true;
  noSourceNodeSelected: number = 0;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {

    // this.getCTDataAssocWithDisease();
    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventDataCT: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel

        this.filterParams = this.globalVariableService.getFilterParams();
        // console.log("params in CT1: ", this.filterParams);
        if (this.filterParams.source_node != undefined) {
          this.noSourceNodeSelected = 0;
          this.getCTDataAssocWithDisease();
        } else {
          this.noSourceNodeSelected = 1;
          this.notEmptyData = true;
        }
      }
    });
  }

  getCTDataAssocWithDisease() {

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("params in CT1: ", this.filterParams);

    // this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });

    // $('.overlay').fadeOut(500);
    this.loadingCTDisease = true;

    //console.log("filterparams: ", _filterParams);
    this.nodeSelectsService.getCTDiseaseAssoc_new(this.filterParams).subscribe(
      data => {
        //console.log("data: ", data);
        this.result = data;
        this.diseaseAssocData = this.result.CTDATA;
        console.log("CT data LOAD: ", this.diseaseAssocData);

        // this.loadingCTDisease = false;
        this.diseaseAssocDetailsData = [];
        this.diseaseAssocData.forEach((event: any) => {
          var temps: any = {};
          // temps["associated_pmids"] = event.associated_pmids;
          // temps["associated_tit_ids"] = event.associated_tit_ids;
          temps["ct_id"] = event.ct_id;
          temps["disease_name"] = event.disease_name;
          temps["has_expanded_access"] = event.has_expanded_access;
          temps["nct_id"] = event.nct_id;
          temps["node_id"] = event.node_id;
          temps["org_study_id"] = event.org_study_id;
          temps["secondary_study_id"] = event.secondary_study_id;
          temps["title"] = event.title;
          temps["overall_status"] = event.overall_status;
          temps["phase_name"] = event.phase_name;
          temps["minimum_age"] = event.minimum_age;
          temps["maximum_age"] = event.maximum_age;
          temps["healthy_volunteers"] = event.healthy_volunteers;
          temps["verification_date"] = event.verification_date;
          temps["last_update_submitted"] = event.last_update_submitted;
          temps["last_update_submitted_qc"] = event.last_update_submitted_qc;
          temps["study_first_posted"] = event.study_first_posted;
          temps["study_first_submitted"] = event.study_first_submitted;
          temps["study_first_submitted_qc"] = event.study_first_submitted_qc;
          temps["study_type"] = event.study_type;
          temps["gender"] = event.gender;
          temps["trial_design"] = event.trial_design;
          temps["phase_id"] = event.phase_id;

          this.diseaseAssocDetailsData.push(temps);
        });

      },
      err => {
        console.log(err.message);
        this.loadingCTDisease = false;
      },
      () => {
        this.notEmptyData = false;  
        this.bootstrapTableChartCT();
        this.loadingCTDisease = false;
      }
    );

  }

  bootstrapTableChartCT() {
    this.totlCountCTData = this.diseaseAssocData.length;
    console.log("CT data count: ", this.totlCountCTData);
    jQuery('#CT_data_new').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 500,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      // stickyHeader: true,
      showExport: true,
      data: this.diseaseAssocDetailsData,
      // onClickRow: (field: any, row: any, $element: any) => {
      // },
    });
    jQuery('#CT_data_new').bootstrapTable("load", this.diseaseAssocDetailsData);
  }


  // reloadCTData() {
  //   console.log("ct data: ")
  //   // this.globalVariableService.resetChartFilter();

  //   this.hideCardBody = !this.hideCardBody;
  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   if (!this.hideCardBody)
  //     this.getCTDataAssocWithDisease();
  // }

}
