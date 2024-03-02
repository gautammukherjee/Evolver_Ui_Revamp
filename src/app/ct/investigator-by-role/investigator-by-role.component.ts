import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";
// import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import cylinder from 'highcharts/modules/cylinder';
import funnel from 'highcharts/modules/funnel';
import funnel3d from 'highcharts/modules/funnel3d';
cylinder(Highcharts);
funnel(Highcharts);
// var Highcharts = require('./../../../../../../node_modules/highcharts');
declare var jQuery: any;

@Component({
  selector: 'app-investigator-by-role',
  templateUrl: './investigator-by-role.component.html',
  styleUrls: ['./investigator-by-role.component.scss'],
  providers: [DatePipe]
})
export class InvestigatorByRoleComponent implements OnInit {
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  // chart: any = Chart;
  hideCardBody: boolean = true;
  loadingCTRole = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  ctInvestigatorRoleData: any = [];
  ctInvestigatorRoleDetailsData: any = [];
  graphData: any = [];

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // this.getCTDataInvestigatorRole();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        // this.getCTDataInvestigatorRole();
      }
    });
  }

  getCTDataInvestigatorRole() {

    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("params in CT2: ", this.filterParams);

    if (this.filterParams.source_node != undefined) {
      // $('.overlay').fadeOut(500);
      this.loadingCTRole = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getCTInvestigatorRole(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.result = data;
          this.ctInvestigatorRoleData = this.result.CTInvestigatorRoleDATA;
          console.log("CT Role Tunnel: ", this.ctInvestigatorRoleData);

          // this.loadingCTRole = false;
          this.ctInvestigatorRoleDetailsData = [];
          this.ctInvestigatorRoleData.forEach((event: any) => {
            this.ctInvestigatorRoleDetailsData.push([event.investigator_name, event.count_nct_ids]);
          });

          console.log("chkData: ", this.ctInvestigatorRoleDetailsData);
          this.chartRoleTunnel();
        },
        err => {
          console.log(err.message);
          this.loadingCTRole = false;
        },
        () => {
          this.loadingCTRole = false;
        }
      );
    }
  }

  chartRoleTunnel() {
    Highcharts.chart('CT_InvestigatorRoleData', <any>{
      // let chart = new Highcharts.Chart('CT_InvestigatorRoleData', <any>{
      chart: {
        // type: 'funnel3d',
        type: 'funnel',
        // options3d: {
        //   enabled: true,
        //   alpha: 10,
        //   depth: 50,
        //   viewDistance: 50
        // }
      },
      title: {
        text: 'Distinct Values of Name'
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            softConnector: true
          },
          center: ['40%', '50%'],
          neckWidth: '30%',
          neckHeight: '25%',
          width: '80%'
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Distinct Values of Name',
        data: this.ctInvestigatorRoleDetailsData
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 400
          },
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: {
                  inside: true
                },
                center: ['50%', '50%'],
                width: '50%'
              }
            }
          }
        }]
      }
    });
  }

  reloadCTDataInvestigatorRole() {
    console.log("ct data Investigator Role: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTDataInvestigatorRole();
  }

}
