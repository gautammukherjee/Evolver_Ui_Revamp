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
  selector: 'app-ct-investigator-rels-by-stats',
  templateUrl: './ct-investigator-rels-by-stats.component.html',
  styleUrls: ['./ct-investigator-rels-by-stats.component.scss'],
  providers: [DatePipe]
})
export class CtInvestigatorRelsByStatsComponent {

  

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  hideCardBody: boolean = true;
  loadingCTInvestigatorStats = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  // public isloading: boolean = false;
  ctInvestigatorRelsByStatsData: any = [];
  ctInvestigatorRelsByStatsDetailsData: any = [];

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // this.getCTInvestigatorRelsByStats();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("event Data in investigator name: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        // this.getCTInvestigatorRelsByStats();
      }
    });
  }

  getCTInvestigatorRelsByStats() {
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("params in CT investi stats: ", this.filterParams);

    if (this.filterParams.source_node != undefined) {
      // $('.overlay').fadeOut(500);
      this.loadingCTInvestigatorStats = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getCTInvestigatorRelsByStats(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.result = data;
          this.ctInvestigatorRelsByStatsData = this.result.CTInvestigatorRelsByStatsDATA;
          console.log("CT investigator Rels By Stats Data: ", this.ctInvestigatorRelsByStatsData);

          // this.loadingCTInvestigatorStats = false;
          this.ctInvestigatorRelsByStatsDetailsData = [];
          this.ctInvestigatorRelsByStatsData.forEach((event: any) => {
            var temps: any = {};
            temps["investigator_id"] = event.investigator_id;
            temps["investigator_name"] = event.investigator_name;
            temps["count_nct_ids"] = event.count_nct_ids;
            temps["count_pm_ids"] = event.count_pm_ids;
            this.ctInvestigatorRelsByStatsDetailsData.push(temps);
          });
          this.bootstrapTableChartInvestigatorName();
        },
        err => {
          console.log(err.message);
          this.loadingCTInvestigatorStats = false;
        },
        () => {
          this.loadingCTInvestigatorStats = false;
        }
      );
    }
  }

  bootstrapTableChartInvestigatorName() {
    jQuery('#CT_Investigator_rels_data').bootstrapTable({
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
      data: this.ctInvestigatorRelsByStatsDetailsData,
      // onClickRow: (field: any, row: any, $element: any) => {
      // },
    });
    jQuery('#CT_Investigator_rels_data').bootstrapTable("load", this.ctInvestigatorRelsByStatsDetailsData);
  }


  reloadInvestigatorRelsByStats() {
    console.log("ct investigator rels by stats data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTInvestigatorRelsByStats();
  }


}
