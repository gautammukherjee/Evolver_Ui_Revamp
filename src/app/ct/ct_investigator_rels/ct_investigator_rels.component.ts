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
  selector: 'app-ct_investigator_rels',
  templateUrl: './ct_investigator_rels.component.html',
  styleUrls: ['./ct_investigator_rels.component.scss']
})
export class CTInvestigatorRelsComponent implements OnInit {

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  loadingCTInvestRelData = false;
  loader: boolean = false;
  InvestigatorRelData: any = [];
  InvestigatorRelDetailsData: any = [];
  hideCardBody: boolean = true;
  itemsPerPage: number = 2;
  notEmptyData: boolean = true;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // this.getCTDataInvestigatorWithRels();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData in CT rel: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.hideCardBody = true;
        // this.getCTDataInvestigatorWithRels();
      }
    });
  }

  getCTDataInvestigatorWithRels() {
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("params in CT in rels: ", this.filterParams);
 
    if (this.filterParams.source_node != undefined) {
      // $('.overlay').fadeOut(500);
      this.loadingCTInvestRelData = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getCTTrialInvestRels_new(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.result = data;
          this.InvestigatorRelData = this.result.CTUNIQUEDATA;
          console.log("CT Unique data LOAD: ", this.InvestigatorRelData);

          // this.loadingCTInvestRelData = false;
          this.InvestigatorRelDetailsData = [];
          this.InvestigatorRelData.forEach((event: any) => {
            var temps: any = {};
            temps["ct_id"] = event.ct_id;
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

            this.InvestigatorRelDetailsData.push(temps);
          });
          this.bootstrapTableChartInRels();
        },
        err => {
          console.log(err.message);
          this.loadingCTInvestRelData = false;
        },
        () => {
          this.loadingCTInvestRelData = false;
          this.notEmptyData = false;
        }
      );
    }else{
      this.notEmptyData = true;
    }

  }

  bootstrapTableChartInRels() {
    jQuery('#CT_Investigator_data').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 25,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      data: this.InvestigatorRelDetailsData,
      // onClickRow: (field: any, row: any, $element: any) => {
      // },
    });
    jQuery('#CT_Investigator_data').bootstrapTable("load", this.InvestigatorRelDetailsData);
  }

  reloadInvestigatorRelsData() {
    console.log("investigator Rels data: ")
    // this.globalVariableService.resetChartFilter();
    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTDataInvestigatorWithRels();
  }
}
