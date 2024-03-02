import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";
import Highcharts from "highcharts/highmaps";
import topology from "@highcharts/map-collection/custom/world.topo.json";

@Component({
  selector: 'app-investigator-by-country',
  templateUrl: './investigator-by-country.component.html',
  styleUrls: ['./investigator-by-country.component.scss'],
  providers: [DatePipe]
})

export class InvestigatorByCountryComponent implements OnInit {

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  // chart: any = Chart;
  hideCardBody: boolean = true;
  loadingCTCountry = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  ctInvestigatorCountryData: any = [];
  ctInvestigatorCountryDetailsData: any = [];
  graphData: any = [];
  chartOptions: any;

  loader: boolean = false;
  noSourceNodeSelected: number = 0;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
  }


  ngOnInit() {
    this.ProceedDoFilterApply?.subscribe(data => {
      console.log("word map data: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.hideCardBody = true;
        // this.getCTDataInvestigatorCountry();
      }
    });
  }

  getCTDataInvestigatorCountry() {
    this.loadingCTCountry = true;
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    // console.log("params in CT in word map: ", this.filterParams);

    this.nodeSelectsService.getCTInvestigatorCountry_new(this.filterParams).subscribe(
      data => {
        //console.log("data: ", data);
        this.result = data;
        this.ctInvestigatorCountryData = this.result.countryData;
        console.log("Country data LOAD: ", this.ctInvestigatorCountryData);

        this.graphData = [];
        for (let i = 0; i < this.ctInvestigatorCountryData.length; i++) {
          this.graphData.push([this.ctInvestigatorCountryData[i]['country_code'].toLowerCase(), this.ctInvestigatorCountryData[i]['count_investigator_ids']]);
        }
        // this.graphData.push(["bd", 5],["be", 6]);
        console.log("graphData: ", this.graphData);

        // this.ctInvestigatorCountryDetailsData = [];
        // if (this.graphData.length > 0) {
        //   this.ctInvestigatorCountryDetailsData = this.graphData
        //   // this.ctInvestigatorCountryDetailsData = this.graphData
        // }
        // console.log("ctInvestigatorCountryDetailsData: ", this.ctInvestigatorCountryDetailsData);
      },
      err => {
        console.log(err.message);
        this.loadingCTCountry = false;
      },
      () => {
        this.chartWordMap();
        console.log("topology: ", topology);
        this.loadingCTCountry = false;
      }
    );
    // if (this.filterParams.source_node != undefined) {
    // this.loadingCTCountry = true;
    // this.chartWordMap();
    // console.log("topology: ", topology);
    // }
  }

  chartWordMap() {
    Highcharts.mapChart('container2', <any>{
      // this.chartOptions = {
      chart: {
        map: topology
      },
      // colors: ['rgba(195, 177, 225,0.05)', 'rgba(195, 177, 225,0.2)', 'rgba(195, 177, 225,0.4)',
      //   'rgba(195, 177, 225,0.5)', 'rgba(195, 177, 225,0.6)', 'rgba(195, 177, 225,0.8)', 'rgba(195, 177, 225,1)'],
      colors: ['rgb(245,209,13)', 'rgb(40,77,44)', 'rgb(126,48,9)',
        'rgb(244,154,192)', 'rgb(207,156,38)', 'rgb(201,107,73)', 'rgb(118,59,87)'],
      title: {
        text: 'Investigator Count',
        align: 'left'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          align: 'right'
        }
      },
      mapView: {
        fitToGeometry: {
          type: 'MultiPoint',
          coordinates: [
            // Alaska west
            [-164, 54],
            // Greenland north
            [-35, 84],
            // New Zealand east
            [179, -38],
            // Chile south
            [-68, -55]
          ]
        }
      },
      legend: {
        title: {
          text: ' ',
          style: {
            color: ( // theme
              Highcharts.defaultOptions &&
              Highcharts.defaultOptions.legend &&
              Highcharts.defaultOptions.legend.title &&
              Highcharts.defaultOptions.legend.title.style &&
              Highcharts.defaultOptions.legend.title.style.color
            ) || 'black'
          }
        },
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        layout: 'vertical',
        valueDecimals: 0,
        backgroundColor: ( // theme
          Highcharts.defaultOptions &&
          Highcharts.defaultOptions.legend &&
          Highcharts.defaultOptions.legend.backgroundColor
        ) || 'rgba(255, 255, 255, 0.85)',
        symbolRadius: 0,
        symbolHeight: 14
      },
      colorAxis: {
        dataClasses: [{
          to: 3,
          color: 'rgb(245,209,13)'
        }, {
          from: 3,
          to: 10,
          color: 'rgb(40,77,44)'
        }, {
          from: 10,
          to: 30,
          color: 'rgb(126,48,9)'
        }, {
          from: 30,
          to: 100,
          color: 'rgb(244,154,192)'
        }, {
          from: 100,
          to: 300,
          color: 'rgb(207,156,38)'
        }, {
          from: 300,
          to: 1000,
          color: 'rgb(201,107,73)'
        }, {
          from: 1000,
          color: 'rgb(118,59,87)'
        }]
      },
      series: [
        {
          type: "map",
          name: "Investigator count",
          states: {
            hover: {
              color: "#BADA55"
            }
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}"
          },
          allAreas: false,
          // data: [
          //   ["fo", 0],
          //   ["um", 1],
          //   ["us", 2]
          // ]
          data: this.graphData
        }
      ]
    })
  }

  // chartWordMap2(){
  //   (async () => {

  //     const topology = await fetch(
  //         'https://code.highcharts.com/mapdata/custom/europe.topo.json'
  //     ).then(response => response.json());

  //     // Instantiate the map
  //     Highcharts.mapChart('container2', <any> {
  //         chart: {
  //             map: topology,
  //             spacingBottom: 20
  //         },

  //         title: {
  //             text: 'Europe time zones'
  //         },

  //         accessibility: {
  //             series: {
  //                 descriptionFormat: 'Timezone {series.name} with {series.points.length} countries.'
  //             },
  //             point: {
  //                 valueDescriptionFormat: '{point.name}.'
  //             }
  //         },

  //         legend: {
  //             enabled: true
  //         },

  //         plotOptions: {
  //             map: {
  //                 allAreas: false,
  //                 joinBy: ['iso-a2', 'code'],
  //                 dataLabels: {
  //                     enabled: true,
  //                     color: '#FFFFFF',
  //                     style: {
  //                         fontWeight: 'bold'
  //                     },
  //                     // Only show dataLabels for areas with high label rank
  //                     format: '{#if (lt point.properties.labelrank 5)}' +
  //                         '{point.properties.iso-a2}' +
  //                         '{/if}'
  //                 },
  //                 tooltip: {
  //                     headerFormat: '',
  //                     pointFormat: '{point.name}: <b>{series.name}</b>'
  //                 }
  //             }
  //         },

  //         series: [{
  //             name: 'UTC',
  //             data: ['IE', 'IS', 'GB', 'PT'].map(code => ({ code }))
  //         }, {
  //             name: 'UTC + 1',
  //             data: [
  //                 'NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL',
  //                 'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR',
  //                 'BA', 'YF', 'ME', 'AL', 'MK'
  //             ].map(code => ({ code }))
  //         }, {
  //             name: 'UTC + 2',
  //             data: [
  //                 'FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 'GR',
  //                 'TR', 'CY'
  //             ].map(code => ({ code }))
  //         }, {
  //             name: 'UTC + 3',
  //             data: [{
  //                 code: 'RU'
  //             }]
  //         }]
  //     });

  // })();
  // }

  reloadInvestigatorCountry() {
    // console.log("ct country data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (this.filterParams.source_node != undefined) {
      this.noSourceNodeSelected = 0;
      if (!this.hideCardBody)
        this.getCTDataInvestigatorCountry();
    } else {
      this.noSourceNodeSelected = 1;
    }
  }



}
