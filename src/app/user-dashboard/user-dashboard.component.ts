import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../services/common/scenario.service';
import { UserService } from '../services/users.service';
import { Chart } from 'angular-highcharts';
import * as $ from "jquery";
import { DatePipe, Location } from '@angular/common';
declare var jQuery: any;
declare var require: any;
var Highcharts = require('highcharts');
import { Router } from '@angular/router';
import { GlobalVariableService } from '../services/common/global-variable.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  providers: [DatePipe]
})
export class UserDashboardComponent implements OnInit {

  private result: any;
  private params: any;
  scenarios: object = [];
  scenario: any;
  filter_criteria: any;
  resultset: any;
  // chart: Chart;

  private maximum: any;
  show = false;
  searchText: any;

  doFilterApplyTab3: Subject<any> = new Subject();  // ## P= Parent

  // private currentUser: any = JSON.parse(this.userService.getCurrentUser());
  public currentUser: any = JSON.parse(sessionStorage.getItem('currentUser') || "null");

  showClinicalDashboardScenario: boolean = false;
  showClinicalDetailScenario: boolean = false;
  showClinicalTopDrugsScenario: boolean = false;
  showEarlyInnovationDashboardScenario: boolean = false;
  showEarlyInnovationDetailScenario: boolean = false;
  loadingSenarios: boolean = false;
  userId: any;
  link: string = "";
  apiss: any = [];

  loadingDel: boolean = false;
  scenarioDel: object = {};
  // isReadMore = true;

  // showText() {
  //   this.isReadMore = !this.isReadMore
  // }

  // ##### Start variables to Hide/show touched/untouched components of clinical details page ##//
  showAverageOfIntensityByYearQuarterAndPhaseName: boolean = false;
  showIntensityByEventAndPhase: boolean = false;
  showCountofEventIDandStandardDeviationofIntensityByDiseaseName: boolean = false;
  showCountOfEventIDAndStandardDeviationOfIntensityByDrugName: boolean = false;
  showCountOfEventIDAndStandardDeviationOfIntensityByCompanyName: boolean = false;
  showEventDetails: boolean = false;
  showCountOfEventIdByIntensity4Bins: boolean = false;
  showCountOfEventIdByIntensity2Bins: boolean = false;
  // ##### End variables to Hide/show touched/untouched components of clinical details page ##//

  // ##### Start variables to Hide/show touched/untouched components of EarlyInnovation details page ##//
  showAverageOfIntensityIntensityAndCountOfEventIdByDateLineChartComponent: boolean = false;
  showMaxOfIntensityByPmidAreaChartComponent: boolean = false;
  showDiseaseByEventCountTreeChartComponent: boolean = false;
  showGeneByEventCountTreeChartComponent: boolean = false;
  showDrugByEventCountTreeChartComponent: boolean = false;
  showCompanyByEventCountTreeChartComponent: boolean = false;
  showEventsScheduleComponent: boolean = false;
  showEvent2BinComponent: boolean = false;
  showEvent4BinComponent: boolean = false;
  showTechEventCountComponent: boolean = false;
  showPhaseEventCountComponent: boolean = false;
  showGeneOntologyComponent: boolean = false;
  fromDate: any;
  frmDate1: any;
  scenarioListsTables: any = [];
  private filterParams: any;

  // ##### End variables to Hide/show touched/untouched components of EarlyInnovation details page ##//

  constructor(private scenarioService: ScenarioService,
    private userService: UserService,
    private location: Location,
    private router: Router,
    private globalVariableService: GlobalVariableService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.showAllScenarioLists();
  }

  showAllScenarioLists() {
    this.loadingSenarios = true;
    this.scenarioService.getUserScenarios({ user_id: this.currentUser.user_id }).subscribe(
      data => {
        this.result = data;
        this.scenarios = this.result.scenarios;

        this.scenarioListsTables = [];
        this.result.scenarios.forEach((event: any) => {
          var temps: any = {};
          temps["created_at"] = event.created_at;
          temps["filter_criteria"] = event.filter_criteria;
          temps["scenario_name"] = event.scenario_name;
          temps["id"] = event.id;
          temps["comments"] = event.comments;
          temps["user_id"] = event.user_id;
          temps["user_name"] = event.user_name;
          temps["visible"] = false;
          temps["uploaded_file_url"] = event.uploaded_file_url;
          temps["uploaded_file_url2"] = event.uploaded_file_url2;
          this.scenarioListsTables.push(temps);
        });
        console.log("scenario lists: ", this.scenarioListsTables);
      },
      err => {
        this.loadingSenarios = false;
        console.log(err);
      },
      () => {
        this.loadingSenarios = false;
        console.log("finished");
      }
    );
  }

  //Select the scenario from the scenarios lists
  selectscenario(scenario: any, evt: any) {
    // console.log("scenario: ", JSON.stringify(scenario));

    var _filterparams = JSON.parse(scenario.filter_criteria);

    console.log("filter_criteria: ", _filterparams);
    // console.log("page_id: ", scenario.page_id);

    localStorage.setItem("scenarioID", '1');
    localStorage.setItem("cameFromScenario", '1');
    localStorage.setItem("scenarioName", scenario.scenario_name);
    localStorage.setItem("uploadedFileUrl", scenario.uploaded_file_url);

    /////////// From date fields ///////////
    // var fromDateFields = _filterparams['from_date'].split('-');
    // var fromDate = new Date(fromDateFields[2] + '-' + fromDateFields[0] + '-' + fromDateFields[1]);
    // var initFromDate = { month: ((new Date(fromDate.toDateString())).getMonth() + 1), day: ((new Date(fromDate.toDateString())).getDate()), year: ((new Date(fromDate.toDateString())).getFullYear()) };
    // this.globalVariableService.setFromDate({ month: initFromDate.month, day: initFromDate.day, year: initFromDate.year });

    //Level1
    _filterparams['nnrt_id'] != undefined ? (this.globalVariableService.setSelectedNodeSelects(_filterparams['nnrt_id'])) : undefined;
    _filterparams['source_node'] != undefined ? (this.globalVariableService.setSelectedSourceNodes(_filterparams['source_node'])) : undefined;
    _filterparams['edge_type_id'] != undefined ? (this.globalVariableService.setSelectedEdgeTypes(_filterparams['edge_type_id'])) : undefined;
    _filterparams['destination_node'] != undefined ? (this.globalVariableService.setSelectedDestinationNodes(_filterparams['destination_node'])) : undefined;

    //Level2
    _filterparams['nnrt_id2'] != undefined ? (this.globalVariableService.setSelectedNodeSelects2(_filterparams['nnrt_id2'])) : undefined;
    _filterparams['source_node2'] != undefined ? (this.globalVariableService.setSelectedSourceNodes2(_filterparams['source_node2'])) : undefined;
    _filterparams['edge_type_id2'] != undefined ? (this.globalVariableService.setSelectedEdgeTypes2(_filterparams['edge_type_id2'])) : undefined;
    _filterparams['destination_node2'] != undefined ? (this.globalVariableService.setSelectedDestinationNodes2(_filterparams['destination_node2'])) : undefined;

    //Level3
    _filterparams['nnrt_id3'] != undefined ? (this.globalVariableService.setSelectedNodeSelects3(_filterparams['nnrt_id3'])) : undefined;
    _filterparams['source_node3'] != undefined ? (this.globalVariableService.setSelectedSourceNodes3(_filterparams['source_node3'])) : undefined;
    _filterparams['edge_type_id3'] != undefined ? (this.globalVariableService.setSelectedEdgeTypes3(_filterparams['edge_type_id3'])) : undefined;
    _filterparams['destination_node3'] != undefined ? (this.globalVariableService.setSelectedDestinationNodes3(_filterparams['destination_node3'])) : undefined;

    //Level2
    // if (_filterparams['nnrt_id2'] != undefined) {
    //   this.globalVariableService.setSelectedNodeSelects2((_filterparams['nnrt_id2'] !== undefined ? _filterparams['nnrt_id2'] : undefined));
    //   this.globalVariableService.setSelectedSourceNodes2((_filterparams['source_node2'] != undefined ? _filterparams['source_node2'] : undefined));
    //   this.globalVariableService.setSelectedEdgeTypes2((_filterparams['edge_type_id2'] != undefined ? _filterparams['edge_type_id2'] : undefined));
    //   this.globalVariableService.setSelectedDestinationNodes2((_filterparams['destination_node2'] != undefined ? _filterparams['destination_node2'] : undefined));
    // }

    //Level3
    // if (_filterparams['nnrt_id3'] != undefined) {
    //   this.globalVariableService.setSelectedNodeSelects3((_filterparams['nnrt_id3'] !== undefined ? _filterparams['nnrt_id3'] : undefined));
    //   this.globalVariableService.setSelectedSourceNodes3((_filterparams['source_node3'] != undefined ? _filterparams['source_node3'] : undefined));
    //   this.globalVariableService.setSelectedEdgeTypes3((_filterparams['edge_type_id3'] != undefined ? _filterparams['edge_type_id3'] : undefined));
    //   this.globalVariableService.setSelectedDestinationNodes3((_filterparams['destination_node3'] != undefined ? _filterparams['destination_node3'] : undefined));
    // }

    this.globalVariableService.setSelectedAllDestinationNodes((_filterparams['destination_node_all'] != undefined ? _filterparams['destination_node_all'] : 0));
    this.globalVariableService.setSelectedAllDestinationNodes2((_filterparams['destination_node_all2'] != undefined ? _filterparams['destination_node_all2'] : 0));
    this.globalVariableService.setSelectedAllDestinationNodes3((_filterparams['destination_node_all3'] != undefined ? _filterparams['destination_node_all3'] : 0));

    this.globalVariableService.setTabsSelected((_filterparams['tabType'] != undefined ? "preview" : "preview"));
    // localStorage.setItem("api_scenarios", JSON.parse(JSON.stringify(this.apiss)));

    console.log("here1: ", _filterparams);
    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("here2: ", this.filterParams);

    if (_filterparams['tabType'] == "details") {
      // this.doFilterApplyTab3.next(undefined);
      this.router.navigate(['/preview/']);
    }

    // this.router.navigate(['/modules/active-ingredient/dashboard'], { queryParams: { scenarioId: '1' } });
    // this.router.navigate(['/modules/active-ingredient/dashboard']);
    // this.router.navigate([]).then(result => { window.open(this.link, '_blank'); });
  }

  ////////// Delete the user scenarios /////////////////
  delUserScenario(id: number) {
    if (confirm("Are you sure to delete!")) {
      this.loadingDel = true;

      this.scenarioDel = {
        user_id: this.currentUser.user_id,
        scenario_id: id,
      };
      this.scenarioService.delUserScenario(this.scenarioDel).subscribe(
        data => {
          this.showAllScenarioLists();
        },
        err => {
          alert("Can't delete..");
          this.loadingDel = false;
          console.log(err);
        },
        () => {
          this.loadingDel = false;
        }
      )
    }
  }

}
