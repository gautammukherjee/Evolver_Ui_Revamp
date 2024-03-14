import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

import More from 'highcharts/highcharts-more';
More(Highcharts);

import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-distribution-by-rel-grp',
  templateUrl: './distribution-by-rel-grp.component.html',
  styleUrls: ['./distribution-by-rel-grp.component.scss']
})
export class DistributionByRelGrpComponent implements OnInit {
  data: any;
  errorMsg: string | undefined;
  graphLoader: boolean = true;
  graphLoaderDrill: boolean = false;
  private filterParams: any;
  loadingChart: boolean = false;
  loadingMessage: boolean = true;
  noDataFound: boolean = false;
  // Highcharts: typeof Highcharts = Highcharts;
  highcharts = Highcharts;
  chartOptions: any;
  dataEdgeNames: any = [];
  dataEdgeNamesFull: any = [];
  dataEdgeNamesFinal: any = [];

  categories: any = [];
  categories2: any = [];
  graphData: any = [];
  graphData2: any = [];
  graphData3: any = [];
  levelOneData: any = "";
  levelTwoData: any = "";
  levelThreeData: any = "";
  finalLevelData: any = [];
  drillDownData: any = [];
  drillDownData2: any = [];
  drillDownData3: any = [];
  levelOneDrillData: any = "";
  levelTwoDrillData: any = "";
  levelThreeDrillData: any = "";
  finalLevelDrillData: any = [];



  firstLoadApiResult: any;
  secondLoadApiResult: any;
  thirdLoadApiResult: any;
  firstLoadDrillApiResult: any;
  secondLoadDrillApiResult: any;
  thirdLoadDrillApiResult: any;
  masterListsDataEdgeGraph: any = [];
  masterListsDataEdgeGraphs: any = [];
  masterListsDataEdgeGraphFinal: any = [];
  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLevelTwo: any = [];
  masterListsDataDetailsLevelThree: any = [];
  masterListsDrillDataDetailsLevelOne: any = [];
  masterListsDrillDataDetailsLevelTwo: any = [];
  masterListsDrillDataDetailsLevelThree: any = [];


  public edgeTypesFirst: any = [];
  // public edgeTypes: any = [];
  private result: any = [];
  public selectedEdgeTypes: any = [];
  public selectedEdgeTypesByGroup: any = [];
  public selectedEdgeTypesByGroups: any = [];

  public alpha: number = 1;
  public beta: number = 1;
  public depth: number = 1;
  private modalRef: any;
  noSourceNodeSelected: number = 0;

  @ViewChild('showPopupEvent', { static: false }) show_popup_event: ElementRef | any;

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();


    this.nodeSelectsService.getEdgeTypeFirst()
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesFirst = this.result.edgeTypeFirstRecords;
          console.log("edge Types First: ", this.edgeTypesFirst);
        });

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      // console.log("data2: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDistributionByRelGroup(this.filterParams, 'polar');
        console.log("new Filters by rel group charts: ", this.filterParams);
      }
    });
    // this.getDistributionByRelGroup(this.filterParams);
  }

  getDistributionByRelGroup(_filterParams: any, type: any) {

    // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined) || (_filterParams.nnrt_id2 != undefined && _filterParams.source_node2!=undefined)) {
    if ((_filterParams.source_node != undefined
      && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined
      && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined && _filterParams.destination_node3 == undefined)
      || (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined)
      || (_filterParams.source_node3 != undefined && _filterParams.nnrt_id3 != undefined)) {
      console.log("new Filters by Rel group charts IN: ", this.filterParams);
      this.loadingChart = true;
      this.noDataFound = false;
      this.noSourceNodeSelected = 0;

      if (_filterParams.nnrt_id != undefined) {

        const firstAPIs = this._RDS.distribution_by_relation_grp_level_one(this.filterParams);
        let combinedDataAPI;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPI = this._RDS.distribution_by_relation_grp_level_two(this.filterParams);
          if (_filterParams.nnrt_id3 != undefined) {
            const thirdAPI = this._RDS.distribution_by_relation_grp_level_three(this.filterParams);
            combinedDataAPI = [firstAPIs, secondAPI, thirdAPI];
          } else {
            combinedDataAPI = [firstAPIs, secondAPI];
          }
        } else {
          combinedDataAPI = [firstAPIs];
        }

        forkJoin(combinedDataAPI) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("you load here: ", result);
              //this will return list of array of the result
              this.firstLoadApiResult = result[0];
              this.secondLoadApiResult = result[1];
              this.thirdLoadApiResult = result[2];
              console.log("first Load Api Result: ", this.firstLoadApiResult);
              console.log("second Load Api Result: ", this.secondLoadApiResult);
              console.log("third Load Api Result: ", this.thirdLoadApiResult);

              ////////// **************** Merging the data into one place *******************////////////////              
              this.masterListsDataDetailsLevelOne = this.firstLoadApiResult.nodeSelectsRecords;
              this.masterListsDataEdgeGraph = this.masterListsDataDetailsLevelOne;
              console.log("First Level Data: ", this.masterListsDataDetailsLevelOne);
              let firstLevelDataStore = this.masterListsDataDetailsLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsLevelTwo = [];
              if (this.secondLoadApiResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsLevelTwo = this.secondLoadApiResult.nodeSelectsRecords2;
                console.log("Second Level Data: ", this.masterListsDataDetailsLevelTwo);
                this.masterListsDataEdgeGraph = [].concat(firstLevelDataStore, this.masterListsDataDetailsLevelTwo);
              }
              let secondLevelDataStore = this.masterListsDataDetailsLevelTwo; //Store the First level data

              this.masterListsDataDetailsLevelThree = [];
              if (this.thirdLoadApiResult != undefined) {
                //Third level data and Combined data first and third level
                this.masterListsDataDetailsLevelThree = this.thirdLoadApiResult.nodeSelectsRecords3;
                console.log("Third Level Data: ", this.masterListsDataDetailsLevelThree);
                this.masterListsDataEdgeGraph = [].concat(firstLevelDataStore, secondLevelDataStore, this.masterListsDataDetailsLevelThree);
              }
              console.log("Combined Data Load: ", this.masterListsDataEdgeGraph);

              // this.masterListsDataEdgeGraphFinal = [...new Set(this.masterListsDataEdgeGraph.map((x: any) => ({ 'edge_group_id': x.edge_group_id, 'grouped_edge_types_name': x.grouped_edge_types_name })))];
              // console.log("masterListsDataEdgeGraphFinal1: ", this.masterListsDataEdgeGraphFinal);

              //Start to Get the unique/distinct after combined data
              var map = new Map();
              for (let masterListsDataEdgeGraphs of this.masterListsDataEdgeGraph) {
                map.set(masterListsDataEdgeGraphs["edge_group_id"], masterListsDataEdgeGraphs);
              }
              var iteratorValues = map.values();
              this.masterListsDataEdgeGraphFinal = [...iteratorValues];
              console.log("masterListsDataEdgeGraphFinal: ", this.masterListsDataEdgeGraphFinal);
              //End to Get the unique/distinct after combined data

              const ids = new Set(this.masterListsDataDetailsLevelOne.map((e: any) => e.edge_group_id));
              const ids2 = new Set(this.masterListsDataDetailsLevelTwo.map((e: any) => e.edge_group_id));
              const ids3 = new Set(this.masterListsDataDetailsLevelThree.map((e: any) => e.edge_group_id));

              //First Degree              
              this.masterListsDataEdgeGraphFinal.forEach((e: any) => {
                if (!ids.has(e.edge_group_id)) {
                  this.masterListsDataDetailsLevelOne.push({ edge_group_id: e.edge_group_id, grouped_edge_types_name: e.grouped_edge_types_name, label: 1, pmids: 0 });
                }
              });

              //Second Degree              
              this.masterListsDataEdgeGraphFinal.forEach((e: any) => {
                if (this.secondLoadApiResult != undefined) {
                  if (!ids2.has(e.edge_group_id)) {
                    this.masterListsDataDetailsLevelTwo.push({ edge_group_id: e.edge_group_id, grouped_edge_types_name: e.grouped_edge_types_name, label: 2, pmids: 0 });
                  }
                }
              });

              //Third Degree              
              this.masterListsDataEdgeGraphFinal.forEach((e: any) => {
                if (this.thirdLoadApiResult != undefined) {
                  if (!ids3.has(e.edge_group_id)) {
                    this.masterListsDataDetailsLevelThree.push({ edge_group_id: e.edge_group_id, grouped_edge_types_name: e.grouped_edge_types_name, label: 3, pmids: 0 });
                  }
                }
              });

              //Start For First level sorting
              this.masterListsDataDetailsLevelOne.sort(function (a: any, b: any) {
                return (a.edge_group_id - b.edge_group_id);
              });
              console.log("First Level New Data: ", this.masterListsDataDetailsLevelOne);
              //End For First level

              //Start For Second level sorting
              if (this.secondLoadApiResult != undefined) {
                this.masterListsDataDetailsLevelTwo.sort(function (a: any, b: any) {
                  return (a.edge_group_id - b.edge_group_id);
                });
              }
              console.log("Second Level New Data: ", this.masterListsDataDetailsLevelTwo);
              //End For Second level

              //Start For Third level sorting
              if (this.thirdLoadApiResult != undefined) {
                this.masterListsDataDetailsLevelThree.sort(function (a: any, b: any) {
                  return (a.edge_group_id - b.edge_group_id);
                });
              }
              console.log("Third Level New Data: ", this.masterListsDataDetailsLevelThree);
              //End For Third level

              //First Degree
              this.categories = [];
              this.graphData = [];
              for (let i = 0; i < this.masterListsDataDetailsLevelOne.length; i++) {
                this.categories.push(this.masterListsDataDetailsLevelOne[i]['grouped_edge_types_name']);
                // this.graphData.push(this.masterListsDataDetailsLevelOne[i]['pmids']);
                this.graphData.push({ name: this.masterListsDataDetailsLevelOne[i]['grouped_edge_types_name'], y: this.masterListsDataDetailsLevelOne[i]['pmids'], edge_group_id: this.masterListsDataDetailsLevelOne[i]['edge_group_id'] });
              }
              console.log("categories: ", this.categories);
              console.log("graphData1: ", this.graphData);

              //Second Degree
              this.graphData2 = [];
              for (let i = 0; i < this.masterListsDataDetailsLevelTwo.length; i++) {
                // this.graphData2.push(this.masterListsDataDetailsLevelTwo[i]['pmids']);
                this.graphData2.push({ name: this.masterListsDataDetailsLevelTwo[i]['grouped_edge_types_name'], y: this.masterListsDataDetailsLevelTwo[i]['pmids'], edge_group_id: this.masterListsDataDetailsLevelTwo[i]['edge_group_id'] });
              }
              console.log("graphData2: ", this.graphData2);

              //Third Degree
              this.graphData3 = [];
              for (let i = 0; i < this.masterListsDataDetailsLevelThree.length; i++) {
                // this.graphData3.push(this.masterListsDataDetailsLevelThree[i]['pmids']);
                this.graphData3.push({ name: this.masterListsDataDetailsLevelThree[i]['grouped_edge_types_name'], y: this.masterListsDataDetailsLevelThree[i]['pmids'], edge_group_id: this.masterListsDataDetailsLevelThree[i]['edge_group_id'] });
              }
              console.log("graphData3: ", this.graphData3);

              this.levelOneData = "";
              if (this.graphData.length > 0) {
                this.levelOneData = [{ name: 'Level1', data: this.graphData, color: '#bc5090' }]
              }
              this.levelTwoData = "";
              if (this.graphData2.length > 0) {
                this.levelTwoData = [{ name: 'Level2', data: this.graphData2, color: '#58508d' }]
              }

              this.levelThreeData = "";
              if (this.graphData3.length > 0) {
                this.levelThreeData = [{ name: 'Level3', data: this.graphData3, color: '#003f5c' }]
              }

              if (this.levelOneData != "") { // First Level
                this.finalLevelData = this.levelOneData
              }
              if (this.levelTwoData != "") { // Second Level
                this.finalLevelData = this.finalLevelData.concat(this.levelTwoData)
              }
              if (this.levelThreeData != "") { // Third Level
                this.finalLevelData = this.finalLevelData.concat(this.levelThreeData)
              }
              console.log("Final data: ", this.finalLevelData);

              this.loadingChart = false;
              this.loadingMessage = false;

              console.log("here TYPes: ", type);
              this.drawColumnChart(type);

            },
            (error: any) => {
              console.error(error)
              this.errorMsg = error;
              // this.loadingChart = false;
            },
          );
      }
    } else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
      this.noSourceNodeSelected = 0
    }
    else {
      this.loadingMessage = true;
      this.noSourceNodeSelected = 1;
    }
  }

  drawColumnChart(type: any) {
    if (type == 'bar') {
      var chkVal = false
    } else {
      var chkVal = true
    }
    // console.log("chkVal", chkVal);

    Highcharts.chart('container', <any>{
      chart: {
        polar: chkVal,
        type: 'column',
        // marginBottom: 120
      },
      // chart: {
      //   type: 'column',
      //   plotBorderWidth: 1,
      //   marginLeft: 100
      // },

      title: {
        text: 'Distribution by Relation Group'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        categories: this.categories,
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        type: 'logarithmic',
        title: {
          text: 'Article Count',
        },
        // min: 0,
        // endOnTick: false,
        // showLastLabel: true,
        // labels: {
        //   format: '{value}%'
        // },
        // reversedStacks: false
      },
      legend: {
        // align: 'left',
        // x: 240,
        verticalAlign: 'bottom',
        align: 'center',
        x: 0,
        y: 0
        // labelFormatter: function() {
        //   return categories[0]
        // },
      },
      tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
          'Total: {point.stackTotal}'
      },
      plotOptions: {
        // column: {
        //   stacking: "normal"
        // },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          },
          stacking: "normal",
          cursor: 'pointer',
          point: {
            events: {
              click: (event: any) => {
                console.log(event);
                this.modalRef = this.modalService.open(this.show_popup_event, { size: 'xl', keyboard: false, backdrop: 'static' });
                this.onRegionSelection(event, type);
              }
            }
          },
        }
      },
      series:
        this.finalLevelData
    });

    this.graphLoader = false;
  }

  onRegionSelection(event: any, type: any) {
    console.log("points: ", event.point);
    this.selectedEdgeTypesByGroups = [];
    this.graphLoaderDrill = true;

    this.selectedEdgeTypesByGroups.push(event.point.options.edge_group_id);
    console.log("edge groups: ", this.selectedEdgeTypesByGroups);

    this.selectedEdgeTypes = this.edgeTypesFirst.filter((item: any) => (
      this.selectedEdgeTypesByGroups.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types2", this.selectedEdgeTypes);

    // start here to get the drill down api
    this.filterParams = this.globalVariableService.getFilterParams({ "edge_type_id_selected": this.selectedEdgeTypes });

    const firstDrillAPIs = this._RDS.distribution_by_relation_grp_get_edge_type_drilldown_level_one(this.filterParams);
    let combinedDataDrillAPI;
    if (this.filterParams.nnrt_id2 != undefined) {
      const secondDrillAPIs = this._RDS.distribution_by_relation_grp_get_edge_type_drilldown_level_two(this.filterParams);
      if (this.filterParams.nnrt_id3 != undefined) {
        const thirdDrillAPIs = this._RDS.distribution_by_relation_grp_get_edge_type_drilldown_level_three(this.filterParams);
        combinedDataDrillAPI = [firstDrillAPIs, secondDrillAPIs, thirdDrillAPIs];
      } else {
        combinedDataDrillAPI = [firstDrillAPIs, secondDrillAPIs];
      }
    } else {
      combinedDataDrillAPI = [firstDrillAPIs];
    }

    forkJoin(combinedDataDrillAPI) //we can use more that 2 api request 
      .subscribe(
        result => {
          console.log("you load here: ", result);
          //this will return list of array of the result
          this.firstLoadDrillApiResult = result[0];
          this.secondLoadDrillApiResult = result[1];
          this.thirdLoadDrillApiResult = result[2];
          console.log("first Load Drill Api Result: ", this.firstLoadDrillApiResult);
          console.log("second Load Drill Api Result: ", this.secondLoadDrillApiResult);
          console.log("third Load Drill Api Result: ", this.thirdLoadDrillApiResult);

          ////////// **************** Merging the data into one place *******************////////////////              
          this.masterListsDrillDataDetailsLevelOne = this.firstLoadDrillApiResult.edgeNamesDrillDown;
          this.dataEdgeNames = this.masterListsDrillDataDetailsLevelOne;
          console.log("First Level Data Drill: ", this.dataEdgeNames);
          let firstLevelDrillDataStore = this.masterListsDrillDataDetailsLevelOne; //Store the First level data

          //Second Degree Data
          this.masterListsDrillDataDetailsLevelTwo = [];
          if (this.secondLoadDrillApiResult != undefined) {
            //Second level data and Combined data first and second level
            this.masterListsDrillDataDetailsLevelTwo = this.secondLoadDrillApiResult.edgeNamesDrillDown2;
            console.log("Second Level Data Drill: ", this.masterListsDrillDataDetailsLevelTwo);
            this.dataEdgeNames = [].concat(firstLevelDrillDataStore, this.masterListsDrillDataDetailsLevelTwo);
          }
          let secondLevelDrillDataStore = this.masterListsDrillDataDetailsLevelTwo; //Store the First level data

          this.masterListsDrillDataDetailsLevelThree = [];
          if (this.thirdLoadDrillApiResult != undefined) {
            //Third level data and Combined data first and third level
            this.masterListsDrillDataDetailsLevelThree = this.thirdLoadDrillApiResult.edgeNamesDrillDown3;
            console.log("Third Level Data: ", this.masterListsDrillDataDetailsLevelThree);
            this.dataEdgeNames = [].concat(firstLevelDrillDataStore, secondLevelDrillDataStore, this.masterListsDrillDataDetailsLevelThree);
          }
          console.log("Combined Data Load Drill: ", this.dataEdgeNames);

          // this.dataEdgeNamesFinal = [...new Set(this.dataEdgeNames.map((x: any) => ({ 'edge_type_id': x.edge_type_id, 'edge_types_name': x.edge_types_name })))];
          // console.log("dataEdgeNamesFinal1: ", this.dataEdgeNamesFinal);

          //Start to Get the unique/distinct after combined data
          var map = new Map();
          for (let dataEdgeNamess of this.dataEdgeNames) {
            map.set(dataEdgeNamess["edge_type_id"], dataEdgeNamess);
          }
          var iteratorValues = map.values();
          this.dataEdgeNamesFinal = [...iteratorValues];
          console.log("dataEdgeNamesFinal2: ", this.dataEdgeNamesFinal);
          //End to Get the unique/distinct after combined data

          const ids = new Set(this.masterListsDrillDataDetailsLevelOne.map((e: any) => e.edge_type_id));
          const ids2 = new Set(this.masterListsDrillDataDetailsLevelTwo.map((e: any) => e.edge_type_id));
          const ids3 = new Set(this.masterListsDrillDataDetailsLevelThree.map((e: any) => e.edge_type_id));
          this.dataEdgeNamesFinal.forEach((e: any) => {
            //First Degree Drill
            if (!ids.has(e.edge_type_id)) {
              this.masterListsDrillDataDetailsLevelOne.push({ edge_type_id: e.edge_type_id, edge_types_name: e.edge_types_name, label: 1, pmids: 0 });
            }
            //Second Degree
            if (this.secondLoadDrillApiResult != undefined) {
              if (!ids2.has(e.edge_type_id)) {
                this.masterListsDrillDataDetailsLevelTwo.push({ edge_type_id: e.edge_type_id, edge_types_name: e.edge_types_name, label: 2, pmids: 0 });
              }
            }
            //Third Degree
            if (this.thirdLoadDrillApiResult != undefined) {
              if (!ids3.has(e.edge_type_id)) {
                this.masterListsDrillDataDetailsLevelThree.push({ edge_type_id: e.edge_type_id, edge_types_name: e.edge_types_name, label: 3, pmids: 0 });
              }
            }
          });

          //Start For First level sorting
          this.masterListsDrillDataDetailsLevelOne.sort(function (a: any, b: any) {
            return (a.edge_type_id - b.edge_type_id);
          });
          console.log("First Level New Drill Data: ", this.masterListsDrillDataDetailsLevelOne);
          //End For First level

          //Start For Second level sorting
          if (this.secondLoadDrillApiResult != undefined) {
            this.masterListsDrillDataDetailsLevelTwo.sort(function (a: any, b: any) {
              return (a.edge_type_id - b.edge_type_id);
            });
          }
          console.log("Second Level New Drill Data: ", this.masterListsDrillDataDetailsLevelTwo);
          //End For Second level

          //Start For Third level sorting
          if (this.thirdLoadDrillApiResult != undefined) {
            this.masterListsDrillDataDetailsLevelThree.sort(function (a: any, b: any) {
              return (a.edge_type_id - b.edge_type_id);
            });
          }
          console.log("Third Level New Drill Data: ", this.masterListsDrillDataDetailsLevelThree);
          //End For Third level

          //First Degree
          this.categories2 = [];
          this.drillDownData = [];
          for (let i = 0; i < this.masterListsDrillDataDetailsLevelOne.length; i++) {
            this.categories2.push(this.masterListsDrillDataDetailsLevelOne[i]['edge_types_name']);
            // this.drillDownData.push(this.masterListsDrillDataDetailsLevelOne[i]['pmids']);
            this.drillDownData.push({ name: this.masterListsDrillDataDetailsLevelOne[i]['edge_types_name'], y: this.masterListsDrillDataDetailsLevelOne[i]['pmids'], edge_type_id: this.masterListsDrillDataDetailsLevelOne[i]['edge_type_id'] });
          }
          console.log("drillDownData1: ", this.drillDownData);
          console.log("categories2: ", this.categories2);

          //Second Degree
          this.drillDownData2 = [];
          for (let i = 0; i < this.masterListsDrillDataDetailsLevelTwo.length; i++) {
            // this.drillDownData2.push(this.masterListsDrillDataDetailsLevelTwo[i]['pmids']);
            this.drillDownData2.push({ name: this.masterListsDrillDataDetailsLevelTwo[i]['edge_types_name'], y: this.masterListsDrillDataDetailsLevelTwo[i]['pmids'], edge_type_id: this.masterListsDrillDataDetailsLevelTwo[i]['edge_type_id'] });
          }
          console.log("drillDownData2: ", this.drillDownData2);

          //Third Degree
          this.drillDownData3 = [];
          for (let i = 0; i < this.masterListsDrillDataDetailsLevelThree.length; i++) {
            // this.drillDownData3.push(this.masterListsDrillDataDetailsLevelThree[i]['pmids']);
            this.drillDownData3.push({ name: this.masterListsDrillDataDetailsLevelThree[i]['edge_types_name'], y: this.masterListsDrillDataDetailsLevelThree[i]['pmids'], edge_type_id: this.masterListsDrillDataDetailsLevelThree[i]['edge_type_id'] });
          }
          console.log("drillDownData3: ", this.drillDownData3);

          this.levelOneDrillData = "";
          if (this.drillDownData.length > 0) {
            this.levelOneDrillData = [{ name: 'Level1', data: this.drillDownData, color: '#bc5090' }]
          }

          this.levelTwoDrillData = "";
          if (this.drillDownData2.length > 0) {
            this.levelTwoDrillData = [{ name: 'Level2', data: this.drillDownData2, color: '#58508d' }]
          }

          this.levelThreeDrillData = "";
          if (this.drillDownData3.length > 0) {
            this.levelThreeDrillData = [{ name: 'Level3', data: this.drillDownData3, color: '#003f5c' }]
          }

          if (this.levelOneDrillData != "") { // First Level
            this.finalLevelDrillData = this.levelOneDrillData
          }
          if (this.levelTwoDrillData != "") { // Second Level
            this.finalLevelDrillData = this.finalLevelDrillData.concat(this.levelTwoDrillData)
          }
          if (this.levelThreeDrillData != "") { // Third Level
            this.finalLevelDrillData = this.finalLevelDrillData.concat(this.levelThreeDrillData)
          }
          console.log("Final Drill data: ", this.finalLevelDrillData);

          this.loadingChart = false;
          this.drawColumnChartDrillDown(type);
        },
        err => {
          console.log(err.message);
          this.graphLoaderDrill = false;
        },
        () => {
          this.graphLoaderDrill = false;
        });

  }

  drawColumnChartDrillDown(type: any) {
    if (type == 'bar') {
      var chkVal2 = false
    } else {
      var chkVal2 = true
    }

    Highcharts.chart('container_popup', <any>{
      chart: {
        polar: chkVal2,
        type: 'column',
        // plotBorderWidth: 1,
        // marginLeft: 200
      },
      title: {
        text: 'Distribution by Relation Group'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        categories: this.categories2,
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        type: 'logarithmic',
        title: {
          text: 'Article Count',
        },

        min: 0,
        endOnTick: false,
        showLastLabel: true,
        labels: {
          format: '{value}%'
        },
        reversedStacks: false

      },

      legend: {
        verticalAlign: 'bottom',
        align: 'center',
        x: 0,
        y: 0
      },
      tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
          'Total: {point.stackTotal}'
      },
      plotOptions: {
        // column: {
        //   stacking: "normal"
        // },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          },
          // stacking: "normal",
        }
      },

      // plotOptions: {
      //   // column: {          
      //   // },
      //   series: {
      //     stacking: "normal",
      //     borderWidth: 0,
      //     dataLabels: {
      //       enabled: true,
      //       format: '{point.y}'
      //     }
      //   }
      // },         

      series: this.finalLevelDrillData
      // [{
      //   name: 'Level1',
      //   data: this.drillDownData,
      //   color: '#f7786b'
      // }, {
      //   name: 'Level2',
      //   data: this.drillDownData2,
      //   color: '#618685'
      // }, {
      //   name: 'Level3',
      //   data: this.drillDownData3,
      //   color: '#80ced6'
      // }]
    });
  }


  selectGraph(event: any) {
    // console.log("event: ", event);
    console.log("event2: ", event.target.value);

    // if (event.target.value == 1) {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("Rank Map:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getDistributionByRelGroup(this.filterParams, event.target.value);
    // } 
    // else {
    //   this.filterParams = this.globalVariableService.getFilterParams();
    //   console.log("Rank Map:: ", this.filterParams);
    //   if (this.filterParams.nnrt_id != undefined)
    //     this.getDistributionByRelGroup(this.filterParams, 'polar');
    // }



  }

}
