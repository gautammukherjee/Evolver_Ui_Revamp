import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import { Subject, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import Stock from 'highcharts/modules/stock';

// Stock(Highcharts)

@Component({
  selector: 'app-pmid-count-with-gene-and-disease',
  templateUrl: './pmid-count-with-gene-and-disease.component.html',
  styleUrls: ['./pmid-count-with-gene-and-disease.component.scss']
})
export class PmidCountWithGeneAndDiseaseComponent implements OnInit {
  //data: any = {};
  result: any = {};
  errorMsg: string | undefined;
  graphLoader: boolean = false;
  byDefault: boolean = false;
  private filterParams: any;
  highcharts = Highcharts;
  chartOptions: any;
  pmidCountGraph: any = [];
  pmidCountGraphFinal: any = [];
  pmid_Count: any = [];
  public graphDateCategory: any = [];
  datCatQuarter: any;
  noDataFound: boolean = false;

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  thirdLoadApiResult: any;
  masterListsDataCountGraph: any = [];
  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLevelTwo: any = [];
  masterListsDataDetailsLevelThree: any = [];
  noSourceNodeSelected: number = 0;
  groupDataByQuarter: any = [];
  uniqueYear: any = [];
  firstQuarterData: any = [];
  secondQuarterData: any = [];
  thirdQuarterData: any = [];
  fourthQuarterData: any = [];
  pmidCountQtr1: any = [];
  pmidCountQtr2: any = [];
  pmidCountQtr3: any = [];
  pmidCountQtr4: any = [];

  //dateCat: any;
  @Input() ProceedDoFilterApply?: Subject<any>;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.pmidCount(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.pmidCount(this.filterParams);
        console.log("new Filters for article count: ", this.filterParams);
      }
    });
  }

  pmidCount(_filterParams: any) {

    // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined) || ((_filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id2 != "") && _filterParams.source_node2 != undefined)) {
    if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined) ||
      (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined)) {
      console.log("Rel group charts IN: ", this.filterParams);

      this.graphLoader = true;
      this.noDataFound = false;
      this.noSourceNodeSelected = 0;

      if (_filterParams.nnrt_id != undefined) {

        const firstAPIs = this._RDS.pmid_count_gene_disease_revamp_level_one(this.filterParams);
        let combinedDataAPI;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPI = this._RDS.pmid_count_gene_disease_revamp_level_two(this.filterParams);
          if (_filterParams.nnrt_id3 != undefined) {
            const thirdAPI = this._RDS.pmid_count_gene_disease_revamp_level_three(this.filterParams);
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
              // console.log("first Load Api Result: ", this.firstLoadApiResult);
              // console.log("second Load Api Result: ", this.secondLoadApiResult);
              // console.log("third Load Api Result: ", this.thirdLoadApiResult);

              ////////// **************** Merging the data into one place *******************////////////////              
              this.masterListsDataDetailsLevelOne = this.firstLoadApiResult.nodeSelectsRecords;
              this.masterListsDataCountGraph = this.masterListsDataDetailsLevelOne;
              console.log("First Level Data: ", this.masterListsDataCountGraph);
              let firstLevelDataStore = this.masterListsDataDetailsLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsLevelTwo = [];
              if (this.secondLoadApiResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsLevelTwo = this.secondLoadApiResult.nodeSelectsRecords2;
                console.log("Second Level Data: ", this.masterListsDataDetailsLevelTwo);
                this.masterListsDataCountGraph = [].concat(firstLevelDataStore, this.masterListsDataDetailsLevelTwo);
              }
              let secondLevelDataStore = this.masterListsDataDetailsLevelTwo; //Store the Second level data

              //Third Degree Data
              this.masterListsDataDetailsLevelThree = [];
              if (this.thirdLoadApiResult != undefined) {
                //Third level data and Combined data first and second and third level
                this.masterListsDataDetailsLevelThree = this.thirdLoadApiResult.nodeSelectsRecords3;
                console.log("Third Level Data: ", this.masterListsDataDetailsLevelThree);
                this.masterListsDataCountGraph = [].concat(firstLevelDataStore, secondLevelDataStore, this.masterListsDataDetailsLevelThree);
              }
              console.log("Combined Data Load: ", this.masterListsDataCountGraph);

              this.pmidCountGraph = [];
              this.masterListsDataCountGraph.forEach((event: any) => {
                // const qrtrDate = (event.publication_date | date: 'dd/MM/yyyy');
                let quarterDateValue = this.datePipe.transform(event.publication_date, 'MM');
                let yearDateValue = this.datePipe.transform(event.publication_date, 'yyyy');

                this.pmidCountGraph.push({
                  unique_pmids: event.unique_pmids,
                  publication_date: event.publication_date,
                  quarter_date: quarterDateValue,
                  year_date: yearDateValue,
                  date: new Date(event.publication_date),
                  level: event.label
                });
              });
              this.pmidCountGraph.sort((a: any, b: any) => a.date - b.date);
              console.log("PMID Count Graph: ", this.pmidCountGraph);

              //Combined the three array with unique publication date and sum the count values
              this.pmidCountGraphFinal = this.pmidCountGraph.reduce((acc: any, ele: any) => {
                const existingPMIDCount = acc.find((x: any) => x.publication_date === ele.publication_date);
                if (!existingPMIDCount) return acc.concat(ele);
                return (existingPMIDCount.unique_pmids += ele.unique_pmids, acc);
              }, [])
              console.log("PMID Count Graph Final: ", this.pmidCountGraphFinal);

              this.uniqueYear = [...new Set(this.pmidCountGraphFinal.map((item: any) => item.year_date))];
              console.log("unique", this.uniqueYear);

              //Grouping according to quarter wise
              // this gives an object with dates as keys
              const groups = this.pmidCountGraphFinal.reduce((groups: any, data: any) => {
                const date = data.quarter_date;

                if (!groups[date]) {
                  groups[date] = [];
                }

                // this.uniqueYear.forEach((element: any) => {
                //   console.log("element2: ", data.year_date + "-" + data.quarter_date);
                groups[date].push({ "pmidCount": data.unique_pmids, "year": data.year_date });

                return groups;
              }, {});
              console.log("here1: ", groups);

              // console.log("key011: ", groups['01']);
              // console.log("key041: ", groups['04']);
              // console.log("key071: ", groups['07']);
              // console.log("key101: ", groups['10']);

              this.pmidCountQtr1 = [];
              if (groups['01'] != undefined) {
                let ids01 = new Set(groups['01'].map((e: any) => e.year));

                //First Quarter
                this.uniqueYear.forEach((e: any) => {
                  if (!ids01.has(e)) {
                    groups["01"].push({ 'pmidCount': '', 'year': e });
                  }
                });
                this.firstQuarterData = Object.values(groups["01"]).sort((a: any, b: any) => a.year - b.year);
                console.log("sort after groups1: ", this.firstQuarterData);

                this.firstQuarterData.forEach((element: any) => {
                  this.pmidCountQtr1.push(parseFloat(element.pmidCount));
                });
                console.log("sort after groups11: ", this.pmidCountQtr1);
              }

              this.pmidCountQtr2 = [];
              if (groups['04'] != undefined) {
                let ids04 = new Set(groups['04'].map((e: any) => e.year));

                //Second Quarter                
                this.uniqueYear.forEach((e: any) => {
                  if (!ids04.has(e)) {
                    groups["04"].push({ 'pmidCount': '', 'year': e });
                  }
                });
                this.secondQuarterData = Object.values(groups["04"]).sort((a: any, b: any) => a.year - b.year);
                console.log("sort after groups2: ", this.secondQuarterData);

                this.secondQuarterData.forEach((element: any) => {
                  this.pmidCountQtr2.push(parseFloat(element.pmidCount));
                });
                console.log("sort after groups22: ", this.pmidCountQtr2);
              }

              this.pmidCountQtr3 = [];
              if (groups['07'] != undefined) {
                let ids07 = new Set(groups['07'].map((e: any) => e.year));

                //Third Quarter                
                this.uniqueYear.forEach((e: any) => {
                  if (!ids07.has(e)) {
                    groups["07"].push({ 'pmidCount': '', 'year': e });
                  }
                });
                this.thirdQuarterData = Object.values(groups["07"]).sort((a: any, b: any) => a.year - b.year);
                console.log("sort after groups3: ", this.thirdQuarterData);

                this.thirdQuarterData.forEach((element: any) => {
                  this.pmidCountQtr3.push(parseFloat(element.pmidCount));
                });
                console.log("sort after groups33: ", this.pmidCountQtr3);
              }

              this.pmidCountQtr4 = [];
              if (groups['10'] != undefined) {
                let ids10 = new Set(groups['10'].map((e: any) => e.year));

                //Fourth Quarter                
                this.uniqueYear.forEach((e: any) => {
                  if (!ids10.has(e)) {
                    groups["10"].push({ 'pmidCount': '', 'year': e });
                  }
                });
                this.fourthQuarterData = Object.values(groups["10"]).sort((a: any, b: any) => a.year - b.year);
                console.log("sort after groups4: ", this.fourthQuarterData);

                this.fourthQuarterData.forEach((element: any) => {
                  this.pmidCountQtr4.push(parseFloat(element.pmidCount));
                });
                console.log("sort after groups44: ", this.pmidCountQtr4);
                //End fourth quarter
              }


              // console.log("here11: ", groups);
              // console.log("here11val: ", Object.values(groups));                           

              // Edit: to add it in the array format instead
              // this.groupDataByQuarter = Object.keys(groups).map((date) => {
              //   switch (date) {
              //     case '01':
              //       this.datCatQuarter = "Q1";
              //       break;
              //     case '04':
              //       this.datCatQuarter = "Q2";
              //       break;
              //     case '07':
              //       this.datCatQuarter = "Q3";
              //       break;
              //     default:
              //       this.datCatQuarter = "Q4";
              //       break;
              //   }

              //   return {
              //     name: this.datCatQuarter,
              //     data: groups[date]
              //   };
              // });
              // console.log("here2: ", this.groupDataByQuarter);
              this.drawAreaChart();
            });
      }
    }
    else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
      this.noSourceNodeSelected = 0;
    } else {
      this.noSourceNodeSelected = 1;
      this.pmidCountGraph = [];
    }
  }

  drawAreaChart() {
    // this.pmid_Count = [];
    // this.graphDateCategory = [];

    // this.pmidCountGraphFinal.forEach((element: any) => {
    //   var dateCat = element.publication_date;
    //   // console.log("dateCat: ", dateCat);

    //   let quarterSplit = dateCat.split(' ');
    //   let quarterSplitDate = quarterSplit[0].split('-');
    //   // console.log('urlSegments2: ', quarterSplitDate);

    //   // switch (quarterSplitDate[1]) {
    //   //   case '01':
    //   //     this.datCatQuarter = "Q1";
    //   //     break;
    //   //   case '04':
    //   //     this.datCatQuarter = "Q2";
    //   //     break;
    //   //   case '07':
    //   //     this.datCatQuarter = "Q3";
    //   //     break;
    //   //   default:
    //   //     this.datCatQuarter = "Q4";
    //   //     break;
    //   // }
    //   // var dateQuarter = this.datCatQuarter + " - " + quarterSplitDate[0];
    //   // this.pmid_Count.push({
    //   //   'y': parseFloat(element.unique_pmids),
    //   //   'date': dateQuarter,
    //   //   //'date': dateQuarter, toolTipText: '<table style="border: 1; border-color: #D0021B;" cellspacing="2" cellpadding="2"><tr><td style="font-size:12px;">Date Quarter: </td><td style="font-size:11px;">' + dateCat + '</td></tr><tr><td style="font-size:12px; color: #B9D4F4;"><strong>Event Count:</strong> </td><td style="font-size:11px; color: #B9D4F4;"><strong>' + element.count + '</strong></td></tr></table>',
    //   // });

    //   // this.graphDateCategory.push(dateQuarter);
    // });

    // console.log("pmid_Count: ", this.pmid_Count);
    // console.log("graphDateCategory: ", this.graphDateCategory);

    // this.chartOptions = {

    Highcharts.chart('containerColumnChart', <any>{
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Count of PMID with Relevant Genes or Diseases'
      },

      // legend: {
      //   layout: 'vertical',
      //   align: 'left',
      //   //verticalAlign: 'top',
      //   x: 150,
      //   y: 100,
      //   floating: true,
      //   borderWidth: 1,
      //   backgroundColor: '#FFFFFF'
      // },
      // yAxis: {
      //   scrollbar: {
      //     enabled: true
      //   },
      //   title: {
      //     text: 'Publication Date'
      //   },
      //   // categories: this.graphDateCategory
      //   categories: this.uniqueYear
      // },
      yAxis: {
        // min: 0,
        // max: 20,
        title: {
          text: 'Distinct values of PMID',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0,
        scrollbar: {
          enabled: true
        },
      },
      // xAxis: {
      //   scrollbar: {
      //     enabled: true
      //   },
      //   title: {
      //     text: 'Distinct values of PMID'
      //   }
      // },
      // scrollbar: {
      //   enabled: true
      // },
      xAxis: {
        type: 'category',
        title: {
          text: null
        },
        // min: 0,
        // max: 8,
        categories: this.uniqueYear,       
        gridLineWidth: 1,
        lineWidth: 0
      },
      // tooltip: {
      //   shared: true,
      //   valueSuffix: ''
      // },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          dataLabels: {
            enabled: true
          },
          groupPadding: 0.1
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },

      series: [
        {
          name: 'Q1',
          data: this.pmidCountQtr1
        }, {
          name: 'Q2',
          data: this.pmidCountQtr2
        }, {
          name: 'Q3',
          data: this.pmidCountQtr3
        }, {
          name: 'Q4',
          data: this.pmidCountQtr4
        }
      ]
      //this.groupDataByQuarter
      // [
      //   // {
      //   //   name: 'Distinct values of PMID',
      //   //   data: this.pmid_Count
      //   // },
      //   // this.groupDataByQuarter
      // ]
    });
    this.graphLoader = false;
  };
}