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
  selector: 'app-nct-investigator-name',
  templateUrl: './nct-investigator-name.component.html',
  styleUrls: ['./nct-investigator-name.component.scss'],
  providers: [DatePipe]
})
export class NctInvestigatorNameComponent implements OnInit {

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  hideCardBody: boolean = true;
  loadingCTInvestigatorName = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  // public isloading: boolean = false;
  ctInvestigatorNameData: any = [];
  ctInvestigatorNameDetailsData: any = [];
  noSourceNodeSelected: number = 0;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // this.getCTInvestigatorName();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("event Data in investigator name: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.hideCardBody = true;
        // this.getCTInvestigatorName();
      }
    });
  }

  getCTInvestigatorName() {
    // this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("params in CT investi name: ", this.filterParams);

    if (this.filterParams.source_node != undefined) {
      // $('.overlay').fadeOut(500);
      this.loadingCTInvestigatorName = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getCTInvestigatorName_new(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.result = data;
          this.ctInvestigatorNameData = this.result.CTInvestigatorNameDATA;
          console.log("CT investigator Name Data: ", this.ctInvestigatorNameData);

          // this.loadingCTInvestigatorName = false;
          this.ctInvestigatorNameDetailsData = [];
          this.ctInvestigatorNameData.forEach((event: any) => {
            var temps: any = {};
            temps["investigator_id"] = event.investigator_id;
            temps["investigator_name"] = event.investigator_name;
            temps["investigator_role"] = event.investigator_role;
            temps["affiliation"] = event.affiliation;
            temps["count_nct_ids"] = event.count_nct_ids;
            this.ctInvestigatorNameDetailsData.push(temps);
          });
          this.bootstrapTableChartInvestigatorName();
        },
        err => {
          console.log(err.message);
          this.loadingCTInvestigatorName = false;
        },
        () => {
          this.loadingCTInvestigatorName = false;
        }
      );
    }
  }

  bootstrapTableChartInvestigatorName() {
    jQuery('#CT_Investigator_name_data').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 1000,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      data: this.ctInvestigatorNameDetailsData,
      // onClickRow: (field: any, row: any, $element: any) => {
      // },
    });
    jQuery('#CT_Investigator_name_data').bootstrapTable("load", this.ctInvestigatorNameDetailsData);
  }


  reloadInvestigatorName() {
    console.log("ct investigator name data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();

    if (this.filterParams.source_node != undefined) {
      this.noSourceNodeSelected = 0;
      if (!this.hideCardBody)
      this.getCTInvestigatorName();
    } else {
      this.noSourceNodeSelected = 1;
    }

  }
}
