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
  selector: 'app-umls-action-second',
  templateUrl: './umls-action-second.component.html',
  styleUrls: ['./umls-action-second.component.scss'],
  providers: [DatePipe]
})
export class UmlsActionSecondComponent implements OnInit {

  private result: any;
  private params: any;
  scenarios: object = [];
  scenario: any;
  filter_criteria: any;
  resultset: any;
  // chart: Chart;

  private maximum: any;
  show = false;
  searchText2: any;

  doFilterApplyTab3: Subject<any> = new Subject();  // ## P= Parent

  // private currentUser: any = JSON.parse(this.userService.getCurrentUser());
  public currentUser: any = JSON.parse(sessionStorage.getItem('currentUser') || "null");

  showClinicalDashboardScenario: boolean = false;
  showClinicalDetailScenario: boolean = false;
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
  
  // ##### End variables to Hide/show touched/untouched components of clinical details page ##//

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
    this.showLists();
  }

  showLists() {
    this.loadingSenarios = true;

    
    this.scenarioService.getUserArticleSentencesDashboard({ user_id: this.currentUser.user_id }).subscribe(
      data => {
        this.result = data;
        this.scenarios = this.result.scenarios;

        this.scenarioListsTables = [];
        this.result.scenarios.forEach((event: any) => {
          var temps: any = {};
          temps["created_at"] = event.created_at;
          temps["resultset"] = event.resultset;
          temps["name"] = event.name;
          temps["id"] = event.id;
          temps["description"] = event.description;          
          temps["visible"] = false;
          temps["uploaded_file_url"] = event.uploaded_file_url;
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

}
