import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-details-of-assoc-data',
  templateUrl: './details-of-assoc-data.component.html',
  styleUrls: ['./details-of-assoc-data.component.scss']
})
export class DetailsOfAssocDataComponent implements OnInit {
  data: any;
  errorMsg: string | undefined;
  graphLoader: boolean = true;
  private filterParams: any;
  highcharts = Highcharts;
  chartOptions: any;
  loadingChart: boolean = false;

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("you assoc charts:: ", this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("data1: ", data);
      // console.log("data2: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDetailsAssocData(this.filterParams);
        console.log("new Filters assoc charts: ", this.filterParams);
      }
    });
    this.getDetailsAssocData(this.filterParams);
  }

  getDetailsAssocData(_filterParams: any) {
    if (_filterParams.source_node != undefined) {
      this.loadingChart = true;
      this._RDS.details_of_association_type(this.filterParams).subscribe(
        (response: any) => {
          this.data = response.nodeSelectsRecords;
          this.drawLineChart();
        },
        (error: any) => {
          console.error(error)
          this.errorMsg = error;
          this.loadingChart = false;
        },
        () => {
          this.loadingChart = false;
        }
      );
    }
  }

  drawLineChart() {
    console.log("In drawColumnChart");
    console.log(this.data);

    let categories: any[] = [];
    let seriesData: any[] = [];

    //console.log(this.data);
    //console.log(this.data[4]['count']);
    for (let i = 0; i < this.data.length; i++) {
      categories.push(this.data[i]['node_node_relation_types']);
      seriesData.push(this.data[i]['count']);
    }

    this.chartOptions = {
      chart: {
        type: "spline",
        //width: 900,
      },
      title: {
        text: "Distribution by Association Type"
      },
      subtitle: {
        text: "EvolverAI"
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: "Count"
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [{
        name: 'count',
        data: seriesData
      },
      ]
    };



    this.graphLoader = false;
  }

}
