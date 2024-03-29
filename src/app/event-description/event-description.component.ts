import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from './../services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { ScenarioService } from '../services/common/scenario.service';
import { Subject, BehaviorSubject, map, mergeMap, forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

declare var jQuery: any;

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.scss'],
  providers: [DatePipe]
})
export class EventDescriptionComponent implements OnInit {
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];
  resultPMIDLists: any = [];
  resultNodesLoadLevelOne: any = [];
  resultNodesLoadLevelTwo: any = [];
  resultNodesScrollLevelOne: any = [];
  resultNodesScrollLevelTwo: any = [];
  resultNodesTotal: any = [];
  resultPMID: any = [];
  pmidCount: any;
  myDate = new Date();
  myDateValue: any;

  loadingDesc = false;
  params: any;
  layout: any = {};
  graphData: any = [];
  // diseaseCheck: any;
  // hideCardBody: boolean = true;
  private modalRef: any;

  loaderEdgeType = false;
  loaderArticle = false;
  loaderCTLists = false;

  // private edgeTypeDescModal: any;
  // private articleModal: any;

  // @ViewChild('edgeTypeDescModal', { static: false }) edgeTypeDescModal_Detail: ElementRef | any;
  @ViewChild('articleModal', { static: false }) articleModal_Detail: ElementRef | any;
  @ViewChild('ctModal', { static: false }) ctListsModal_Detail: ElementRef | any;

  edgeTypeList: any = [];
  helpContents: any;
  masterListsData: any = [];
  masterListsDataNew: any = [];
  masterListsEdgeDataNew: any = [];

  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLengthLevelOne: number = 0;
  masterListsDataDetailsLevelTwo: any = [];
  masterListsDataDetailsLevelThree: any = [];
  masterListsDataDetailsLengthLevelTwo: number = 0;
  masterListsDataDetailsLengthLevelThree: number = 0;
  masterListsDataDetailsExtraLevelOne: any = [];
  masterListsDataDetailsExtraLevelTwo: any = [];
  masterListsDataDetailsExtraLevelThree: any = [];

  // masterListsDataLength: number = 0;
  // masterListsDataLoaded: any = [];
  // masterListsDataOnScroll: any = [];
  masterListsDataDetailsLoaded: any = [];
  masterListsDataDetailsExtra: any = [];
  masterListsDataDetailsCombined: any = [];
  masterListsDataDetailsCombined_ORG: any = [];
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];
  public articleHere: any = [];
  public ctListsHere: any = [];
  articleList: any = [];
  ctList: any = [];
  public articleHerePMID: any = [];
  articlePMID: any = [];
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 100;
  public isloading: boolean = false;
  public loadingArticleSaved: boolean = false;
  loaderEvidence = false;
  noDataFoundDetails: boolean = false;
  noSourceNodeSelected: number = 0;

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  thirdLoadApiResult: any;
  firstCompleteApiResult: any;
  secondCompleteApiResult: any;
  thirdCompleteApiResult: any;
  firstScrollApiResult: any;
  secondScrollApiResult: any;
  thirdScrollApiResult: any;
  scenarioExistName: any;
  firstLoadApiNewResult: any;
  secondLoadApiNewResult: any;
  thirdLoadApiNewResult: any;
  masterListsDataDetailsNewLevelOne: any = [];
  masterListsDataDetailsNewLevelTwo: any = [];
  masterListsDataDetailsNewLevelThree: any = [];

  firstLoadApiNewEdgeResult: any;
  secondLoadApiNewEdgeResult: any;
  thirdLoadApiNewEdgeResult: any;
  masterListsDataDetailsNewEdgeLevelOne: any = [];
  masterListsDataDetailsNewEdgeLevelTwo: any = [];
  masterListsDataDetailsNewEdgeLevelThree: any = [];

  scenario: object = {};
  articleSentencesScenario: object = {};
  moduleTypes: number = 0;
  scenariosPerUserCount: number = 0;
  sentenceScenariosPerUserCount: number = 0;
  private userScenario: any;
  private userSentences: any;
  // private userScenarioWithResult: any;
  private currentUser: any = JSON.parse(sessionStorage.getItem('currentUser') || "null");
  loadingScenario: boolean = false;
  loadingArticleScenarioLists = false;
  returnResultsetData: boolean = false;
  returnWithEdgeTypeResultsetData: boolean = false;
  detailsLists: Array<object> = [];
  detailsEdgeLists: Array<object> = [];
  public selectedPMIDCount: any = [];
  // firstAPI: any;
  // secondAPI: any;

  firstUniquePMIDApiResult: any;
  secondUniquePMIDApiResult: any;
  thirdUniquePMIDApiResult: any;
  masterListsDataUniquePMIDOne: number = 0;
  masterListsDataUniquePMIDTwo: number = 0;
  masterListsDataUniquePMIDThree: number = 0;
  uniquePMIDCounts:any=[];

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  fileName: string = '';
  downloadData: any = [];
  public readonly pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";

  scenarioForm = new FormGroup({
    filter_name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
    user_comments: new FormControl(''),
    result_set_checked: new FormControl(0),
    result_set_with_edge_type: new FormControl(0)
  })
  sentenceForm = new FormGroup({
    filter1_name: new FormControl('', [Validators.required]),
    scenario_exist_name: new FormControl('', [Validators.required]),
    user1_comments: new FormControl(''),
  })

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private scenarioService: ScenarioService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.myDateValue = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss a');
  }

  ngOnInit() {

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters For Details: ", this.filterParams);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    this.getEventDescription(this.filterParams, null);
    // this.getEventTotalDescription(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      this.notEmptyPost = true;
      this.currentPage = 1;
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
        this.getEventDescription(this.filterParams, null);
        // this.getEventTotalDescription(this.filterParams);
        console.log("new Filters for description: ", this.filterParams);
      }
    });
  }

  // getEventTotalDescription(_filterParams: any) {
  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   const firstAPIsFull = this.nodeSelectsService.getMasterListsRevampLevelOne(this.filterParams);
  //   const secondAPIFull = this.nodeSelectsService.getMasterListsRevampLevelTwo(this.filterParams);

  //   // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined) || ((_filterParams.source_node2 != undefined || _filterParams.destination_node2 != undefined) && (_filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id2 != ""))) {
  //   if (this.filterParams.source_node != undefined) {
  //     // this.loadingDesc = true;
  //     this.masterListsDataLength = 0;

  //     console.log("filterparams for all records: ", _filterParams);
  //     this.nodeSelectsService.getAllRecords(this.filterParams).subscribe(
  //       data => {
  //         //console.log("data: ", data);
  //         this.resultNodesTotal = data;
  //         console.log("Total datas1: ", this.resultNodesTotal);
  //         this.masterListsDataLength = this.resultNodesTotal.masterListsDataTotal[0].total;
  //       }
  //     )
  //   }
  // }

  getEventDescription(_filterParams: any, pmidChecked: any) {
    //console.log("abc = "+_limit.load_value);

    if ((_filterParams.source_node != undefined
      && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined
      && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined && _filterParams.destination_node3 == undefined)
      || (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined)
      || (_filterParams.source_node3 != undefined && _filterParams.nnrt_id3 != undefined)) {
      this.loadingDesc = true;
      this.noDataFoundDetails = false;
      this.noSourceNodeSelected = 0;

      this.filterParams = this.globalVariableService.getFilterParams();
      console.log("new data complete: ", this.filterParams);

      ///////////////// Start To get the complete data for level 1 and level 2 /////////////////////////////
      if (_filterParams.nnrt_id != undefined) {
        const firstAPIsFull = this.nodeSelectsService.getMasterListsRevampLevelOneCount(this.filterParams);
        const firstAPIsPMIDCountFull = this.nodeSelectsService.getMasterListsRevampLevelOneUniquePMIDCount(this.filterParams);
        let combinedDataAPIFull;
        let combinedDataAPIUniquePMID;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPIFull = this.nodeSelectsService.getMasterListsRevampLevelTwoCount(this.filterParams);
          const secondAPIsPMIDCountFull = this.nodeSelectsService.getMasterListsRevampLevelTwoUniquePMIDCount(this.filterParams);
          if (_filterParams.nnrt_id3 != undefined) {
            const thirdAPIFull = this.nodeSelectsService.getMasterListsMapRevampLevelThreeCount(this.filterParams);
            const thirdAPIsPMIDCountFull = this.nodeSelectsService.getMasterListsRevampLevelThreeUniquePMIDCount(this.filterParams);
            combinedDataAPIFull = [firstAPIsFull, secondAPIFull, thirdAPIFull];
            combinedDataAPIUniquePMID = [firstAPIsPMIDCountFull, secondAPIsPMIDCountFull, thirdAPIsPMIDCountFull];
          } else {
            combinedDataAPIFull = [firstAPIsFull, secondAPIFull];
            combinedDataAPIUniquePMID = [firstAPIsPMIDCountFull, secondAPIsPMIDCountFull];
          }
        } else {
          combinedDataAPIFull = [firstAPIsFull];
          combinedDataAPIUniquePMID = [firstAPIsPMIDCountFull];
        }

        forkJoin(combinedDataAPIFull) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("you full data here: ", result);
              //this will return list of array of the result
              this.firstCompleteApiResult = result[0];
              this.secondCompleteApiResult = result[1];
              this.thirdCompleteApiResult = result[2];
              console.log("first Complete Api Result: ", this.firstCompleteApiResult);
              console.log("second Complete Api Result: ", this.secondCompleteApiResult);
              console.log("third Complete Api Result: ", this.thirdCompleteApiResult);
              this.masterListsDataDetailsLengthLevelOne = this.firstCompleteApiResult.masterListsData[0].count;
              if (this.secondCompleteApiResult != undefined) {
                this.masterListsDataDetailsLengthLevelTwo = this.secondCompleteApiResult.masterListsData[0].count;
              }
              if (this.thirdCompleteApiResult != undefined) {
                this.masterListsDataDetailsLengthLevelThree = this.thirdCompleteApiResult.masterListsData[0].count;
              }
            });

        forkJoin(combinedDataAPIUniquePMID) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("your unique PMID count: ", result);
              //this will return list of array of the result
              this.firstUniquePMIDApiResult = result[0];
              this.secondUniquePMIDApiResult = result[1];
              this.thirdUniquePMIDApiResult = result[2];
              console.log("first uniue PMID count: ", this.firstUniquePMIDApiResult);
              console.log("second uniue PMID count: ", this.secondUniquePMIDApiResult);
              console.log("third uniue PMID count: ", this.thirdUniquePMIDApiResult);
              this.masterListsDataUniquePMIDOne = this.firstUniquePMIDApiResult.masterListsUniquePMIDData[0].pmids;
              if (this.secondUniquePMIDApiResult != undefined) {
                this.masterListsDataUniquePMIDTwo = this.secondUniquePMIDApiResult.masterListsUniquePMIDData[0].pmids;
              }
              if (this.thirdUniquePMIDApiResult != undefined) {
                this.masterListsDataUniquePMIDThree = this.thirdUniquePMIDApiResult.masterListsUniquePMIDData[0].pmids;
              }
            });
      }
      ///////////////// End To get the complete data for level 1 and level 2 and level 3 /////////////////////////////

      //First Degree Data
      if (_filterParams.nnrt_id != undefined) {
        this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
        console.log("new data limit: ", this.filterParams);

        const firstAPIs = this.nodeSelectsService.getMasterListsRevampLevelOne(this.filterParams);
        let combinedDataAPI;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPI = this.nodeSelectsService.getMasterListsRevampLevelTwo(this.filterParams);
          if (_filterParams.nnrt_id3 != undefined) {
            const thirdAPI = this.nodeSelectsService.getMasterListsRevampLevelThree(this.filterParams);
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
              this.masterListsDataDetailsLevelOne = this.firstLoadApiResult.masterListsData;
              this.masterListsData = this.masterListsDataDetailsLevelOne;
              console.log("First Level Data: ", this.masterListsDataDetailsLevelOne);
              let firstLevelDataStore = this.masterListsDataDetailsLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsLevelTwo = [];
              if (this.secondLoadApiResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsLevelTwo = this.secondLoadApiResult.masterListsData;
                console.log("Second Level Data: ", this.masterListsDataDetailsLevelTwo);
                this.masterListsData = [].concat(firstLevelDataStore, this.masterListsDataDetailsLevelTwo);
              }
              let secondLevelDataStore = this.masterListsDataDetailsLevelTwo; //Store the First level data

              //Third Degree Data
              this.masterListsDataDetailsLevelThree = [];
              if (this.thirdLoadApiResult != undefined) {
                this.masterListsDataDetailsLevelThree = this.thirdLoadApiResult.masterListsData;
                console.log("Third Level Data: ", this.masterListsDataDetailsLevelThree);
                this.masterListsData = [].concat(firstLevelDataStore, secondLevelDataStore, this.masterListsDataDetailsLevelThree);
              }
              console.log("Combined Data Load: ", this.masterListsData);

              // here one checked

              this.loadingDesc = false;
              ////////// **************** End Merging the data into one place *******************////////////////

              this.masterListsDataDetailsLoaded = [];
              let j = 1;
              this.masterListsData.forEach((event: any, index: any) => {
                var temps: any = {};
                //Get the Edge Type Name
                const regex = /[{}]/g;
                const edgeTypeIds = event.edge_type_ids;
                const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
                //console.log("event: ", event);//use this variable, gautam
                const edgeTypeNeIds = event.ne_ids;
                const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
                // temps["news_id"] = event.news_id;
                temps["news_id"] = (index + 1);
                temps["sourcenode_name"] = event.sourcenode_name;
                temps["destinationnode"] = event.destinationnode;
                temps["destinationnode_name"] = event.destinationnode_name;
                temps["level"] = event.level;
                //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
                //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
                temps["pmidCount"] = event.pmids;
                temps["rank_score"] = (event.rank_score != null ? event.rank_score : 'N/A');
                temps["edgeTypesID"] = edgeTypeIdsPost;
                temps["edgeNeId"] = edgeTypeNeIdsPost;
                // temps["edgeNeCount"] = event.pmids + "&nbsp;&nbsp;<span class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i></span>";
                temps["edgeNeCount"] = "<span class='btn btn-sm btn-primary'><i class='bi bi-list'></i></span>";
                // temps["ctLists"] = "<button class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i>&nbsp;CT Lists</button> &nbsp;";
                this.masterListsDataDetailsLoaded.push(temps);
              });
              this.masterListsDataDetailsCombined = this.masterListsDataDetailsLoaded;
              this.masterListsDataDetailsCombined_ORG = this.masterListsDataDetailsLoaded;
              console.log("Total Combined Load Data: ", this.masterListsDataDetailsCombined);
              console.log("Total Combined Load Data ORG: ", this.masterListsDataDetailsCombined_ORG);
              //GET the unique PMID count
              this.uniquePMIDCounts = [...new Set(this.masterListsDataDetailsCombined_ORG.map((item:any) => item.pmidCount))].sort((a:any,b:any) => a-b);
              console.log(this.uniquePMIDCounts);            
              this.bootstrapTableChart();
            });
      }
    }
    else if (_filterParams.source_node != undefined) {
      this.noDataFoundDetails = true;
      this.noSourceNodeSelected = 0
      // this.masterListsData = [];
      // this.loadingDesc = false;
    } else {
      this.noSourceNodeSelected = 1;
    }
  }

  bootstrapTableChart() {
    // debugger
    console.log("total Data: ", this.masterListsDataDetailsCombined)
    jQuery('#showEventDescription').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 100,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      exportOptions: {
        ignoreColumn: [6],
        // columns: [6],
        // visible: [6,'true'],
      },
      data: this.masterListsDataDetailsCombined,

      // onCreatedControls () {  
      //   $('select.bootstrap-table-filter-control-rank_score').each(function (index:any, i:any) {
      //     i.setAttribute('multiple','multiple');
      //     jQuery(this).find('option[value=""]').remove();
      //     jQuery(this).multipleSelect('destroy').multipleSelect({
      //       container: 'body',
      //       filter: true,
      //       selectAll:true  
      //     })
      //   })
      // },
      onClickRow: (field: any, row: any, $element: any) => {
        //edge types
        // if ($element == "edgeNeCount") {
        //   this.loaderEdgeType = true;
        //   this.modalRef = this.modalService.open(this.edgeTypeDescModal_Detail, { size: 'lg', keyboard: false, backdrop: 'static' });
        //   this.showPMIDLists(field.edgeNeId, field.sourcenode_name, field.destinationnode_name);
        // }
        // if ($element == "edgeNe") {
        //   this.loaderArticle = true;
        //   this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
        //   this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID, this.getArticles);
        // }
        if ($element == "edgeNeCount") {
          this.loaderArticle = true;
          // this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', windowClass: 'rightWindow', keyboard: false, backdrop: 'static' });
          this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
          this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID, field.level);
        }
        if ($element == "ctLists") {
          this.loaderCTLists = true;
          this.modalRef = this.modalService.open(this.ctListsModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
          this.CTPopup(field.destinationnode);
        }
      },
    });

    jQuery('#showEventDescription').bootstrapTable("load", this.masterListsDataDetailsCombined);

    //start here for multi select but not working
    //   jQuery('#showEventDescription').bootstrapTable({
    //     data: this.masterListsDataDetailsCombined,
    //     onCreatedControls () {  
    //       jQuery('select.bootstrap-table-filter-control-rank_score').each(function (index:any, i:any) {
    //         i.setAttribute('multiple','multiple');
    //         i.find('option[value=""]').remove();
    //         i.multipleSelect('destroy').multipleSelect({
    //           container: 'body',
    //           filter: true,
    //           selectAll:true  
    //         })
    //       })
    //     }
    //  })

  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Commented by Gautam Mukherjee
  getEdgeTypesInternally() is executing to get edge-types in Article Popup. 
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  getEdgeTypesInternally(edgeTypeIdsPost: any) {
    this.edgeHere = "";
    this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe((p: any) => {
      this.edgeHere = "";
      this.result = p;
      this.result.forEach((event: any) => {
        this.edgeHere += event.edge_type_name + "<br>";
      });
    });
  }
  // reloadDescription() {
  //   console.log("Event description: ")
  //   // this.globalVariableService.resetChartFilter();
  //   this.hideCardBody = !this.hideCardBody;
  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   if (!this.hideCardBody)
  //     this.getEventDescription(this.filterParams);
  // }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Commented by Gautam Mukherjee
  ArticlePopup() is the main function and getArticles() is the callback function. 
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, getArticles_callback: any) {
  //   this.getEdgeTypesInternally(edgeTypesID);
  //   //if(this.edgeHere!=""){
  //   getArticles_callback(edgeNeId, sourceNode, destinationNode, edgeTypesID, this);
  //   //}
  // }


  ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, level: number) {
    this.articleHere = [];
    const edgeNeIdArr = edgeNeId.split(",");
    //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);


    // this.nodeSelectsService.getEdgeTypeSentencePMIDLists({ 'ne_ids': edgeNeIdArr, 'edge_type_id': (level == 1 ? this.filterParams['edge_type_id'] : this.filterParams['edge_type_id2']) }).subscribe((p: any) => {
    this.nodeSelectsService.getEdgeTypeSentencePMIDLists({ 'ne_ids': edgeNeIdArr, 'edge_type_id': (level == 1 ? this.filterParams['edge_type_id'] : (level == 2 ? this.filterParams['edge_type_id2'] : this.filterParams['edge_type_id3'])) }).subscribe((p: any) => {
      this.result = p;
      console.log(this.result);
      this.articleHere = this.result.pmidListsSentence;
      this.articleList = [];
      var i = 1;
      this.articleHere.forEach((event: any, index: any) => {
        var temps: any = {};
        temps["id"] = (index + 1);
        temps["source"] = sourceNode;
        temps["destination"] = destinationNode;
        temps["pubmed_id"] = event.pmid;
        temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + this.pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
        temps["publication_date"] = event.publication_date;
        temps["title"] = event.title;
        temps["edge_type"] = event.edge_type_name
        temps["ne_id"] = event.ne_id;
        temps["sentence_btn"] = "<button class='btn btn-sm btn-primary' id='" + event.ne_id + "'>Sentences</button><button class='btn bt-sm btn-secondary' style='display:none;background-color:#B765A3;border:1px solid #B765A3;'>Hide</button>";
        //temps["display_btn"] = "<button class='btn bt-sm btn-secondary'>Hide</button>";
        i++
        this.articleList.push(temps);
      });
      jQuery('#articles_details').bootstrapTable({
        bProcessing: true,
        bServerSide: true,
        pagination: true,
        showToggle: true,
        showColumns: true,
        search: true,
        pageSize: 500,
        striped: true,
        showFullscreen: true,
        stickyHeader: true,
        showExport: true,
        data: this.articleList,
        exportOptions: {
          ignoreColumn: ["sentence_btn"]
        },
        onClickCell: (field: any, value: any, row: any, $element: any) => {
          //console.log(field);//sentence_btn
          //console.log(value);//<button class='btn btn-sm btn-primary' value='8785438'>Sentences</button>
          //console.log(JSON.stringify(row));// ** entire row data

          //console.log("Sentence class container:-" + $($element).parent().next().attr("class"));
          let tr_class = $($element).parent().next().attr("class");
          if (((tr_class === undefined) || (tr_class === "selected")) || (tr_class != "sentence_container")) {

            let sentences: any;
            let html: string;
            let html_str: string;
            let html_res: string;

            console.log("field1: ", field);
            if (field == "sentence_btn") {
              //console.log(row.ne_id);

              this.loaderEvidence = true;
              this.nodeSelectsService.getEvidenceData({ 'ne_id': row.ne_id, 'pubmed_id': row.pubmed_id }).subscribe((p: any) => {
                sentences = p;
                //console.log(JSON.stringify(sentences));
                if (sentences.evidence_data.length == 0) {
                  this.loaderEvidence = false;
                  $($element).parent().after('<tr class="sentence_container"><td colspan="9"><div class="alert alert-danger">No Evidence found in database!</div></td></tr>');
                  //$($element).children().eq(0).css({ "background-color": "#B765A3", "border": "1px solid #B765A3" });//effect in sentence button
                  $($element).children().eq(0).hide(500);
                  $($element).children().eq(1).show(600);
                  $($element).parent().children().css({ "background-color": "#A4A4A4", "color": "#fff" });//change color of all tds of row
                  this.loaderEvidence = false;
                } else {
                  html = "";
                  html_str = "";
                  html_res = "";
                  let e1_color: string;
                  let e2_color: string;
                  let sentence_text1: string;

                  for (let i = 0; i < sentences.evidence_data.length; i++) {

                    if (sentences.evidence_data[i].e1_type_name === "DISEASE_OR_SYMPTOM") {
                      e1_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e1_type_name === "FUNCTIONAL_MOLECULE") {
                      e1_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e1_type_name === "GENE_OR_GENE_PRODUCT") {
                      e1_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e1_type_name === "ANATOMY") {
                      e1_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e1_type_name === "MODEL") {
                      e1_color = "#118ab2";
                    } else {
                      e1_color = "#000";
                    }

                    if (sentences.evidence_data[i].e2_type_name === "DISEASE_OR_SYMPTOM") {
                      e2_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e2_type_name === "FUNCTIONAL_MOLECULE") {
                      e2_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e2_type_name === "GENE_OR_GENE_PRODUCT") {
                      e2_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e2_type_name === "ANATOMY") {
                      e2_color = "#118ab2";
                    } else if (sentences.evidence_data[i].e2_type_name === "MODEL") {
                      e2_color = "#118ab2";
                    } else {
                      e2_color = "#000";
                    }

                    sentence_text1 = sentences.evidence_data[i].sentence;
                    sentence_text1 = sentence_text1.replace("<E1>", "<mark style='color:#A8E890'>");
                    sentence_text1 = sentence_text1.replace("</E1>", "</mark>");
                    sentence_text1 = sentence_text1.replace("<E2>", "<mark style='color:#FF8787'>");
                    sentence_text1 = sentence_text1.replace("</E2>", "</mark>");

                    //console.log(sentence_text1);
                    html_str = "<table width='100%' border='1' cellpadding='2'>";
                    html_str += "<tr>";
                    html_str += "<td width='30%'><span style='color:" + e1_color + "'>" + sentences.evidence_data[i].gene_symbol_e1 + "</span>(" + sentences.evidence_data[i].e1_type_name + ")</td>";
                    html_str += "<td  width='19%'>" + sentences.evidence_data[i].edge_name + "</td>";
                    html_str += "<td  width='30%'><span style='color:" + e1_color + "'>" + sentences.evidence_data[i].gene_symbol_e2 + "</span>(" + sentences.evidence_data[i].e2_type_name + ")</td>";
                    html_str += "<td  width='19%'>PMID: <a target='_blank' style='color: #BF63A2 !important;' href='" + this.pubmedBaseUrl + sentences.evidence_data[i].pubmed_id + "'>" + sentences.evidence_data[i].pubmed_id + "</a></td>"
                    html_str += "<td width='2%'>&nbsp;</td>";
                    html_str += "</tr>";

                    html_str += "<tr>";
                    html_str += "<td colspan='5'>" + sentence_text1 + "</td>";
                    html_str += "</tr>";
                    html_str += "</table>";

                    html_res += html_str;
                    this.loaderEvidence = false;
                  };//for

                  $($element).parent().after('<tr class="sentence_container"><td colspan="9">' + html_res + '</td></tr>');
                  // $($element).children().eq(0).css({ "background-color": "#B765A3", "border": "1px solid #B765A3" });//change color of sentence button
                  $($element).children().eq(0).hide(500);
                  $($element).children().eq(1).show(600);
                  $($element).parent().children().css({ "background-color": "#A4A4A4", "color": "#fff" });//change color of all tds of row

                  this.loaderEvidence = false;
                }

              });
            }
          } else {

            //$($element).parent().next().hide(700);
            if ($($element).parent().next().is(":visible")) {//if sentence-table is visible
              //console.log("in if...");
              $($element).parent().next().hide(950);
              $($element).children().eq(1).text("Show");
            } else {
              //console.log("in else...");
              $($element).parent().next().show(950);
              $($element).children().eq(1).text("Hide")
            }
          }
        },
      });
      this.loaderArticle = false;
    });
  }

  //Start For CT details

  CTPopup(destinationNode: string) {
    this.ctListsHere = [];
    console.log("destinationNode: ", destinationNode);
    this.nodeSelectsService.getCTPMIDLists({ 'unique_destination_node': destinationNode }).subscribe((p: any) => {
      this.result = p;
      console.log(this.result);
      this.ctListsHere = this.result.CTDATAInDetails;
      this.ctList = [];
      var i = 1;
      this.ctListsHere.forEach((event: any, index: any) => {
        var temps: any = {};
        temps["id"] = (index + 1);
        temps["nctid"] = event.nct_id;
        temps["title"] = event.title;
        temps["disease_name"] = event.disease_name;
        temps["phase_name"] = event.phase_name;
        temps["verification_date"] = event.verification_date;
        i++
        this.ctList.push(temps);
      });
      jQuery('#ct_details').bootstrapTable({
        bProcessing: true,
        bServerSide: true,
        pagination: true,
        showToggle: true,
        showColumns: true,
        search: true,
        pageSize: 500,
        striped: true,
        showFullscreen: true,
        stickyHeader: true,
        showExport: true,
        data: this.ctList
      });
      this.loaderCTLists = false;
    });
  }

  //End for CT details

  // showPMIDLists(edgeNeId: any, sourceNode: string, destinationNode: string) {
  //   const edgeNeIdArr = edgeNeId.split(",");
  //   //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);
  //   var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
  //   this.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeNeIdArr }).subscribe((pmid: any) => {
  //     this.loaderEdgeType = false;
  //     this.resultPMIDLists = pmid;
  //     console.log(this.resultPMIDLists);
  //     this.articleHerePMID = this.resultPMIDLists.pmidLists;
  //     this.articlePMID = [];
  //     this.articleHerePMID.forEach((event: any) => {
  //       var temps: any = {};
  //       temps["source"] = sourceNode;
  //       temps["destination"] = destinationNode;
  //       temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
  //       temps["publication_date"] = event.publication_date;
  //       temps["title"] = event.title;
  //       this.articlePMID.push(temps);
  //     });
  //     jQuery('#articles_details_pmid').bootstrapTable({
  //       bProcessing: true,
  //       bServerSide: true,
  //       pagination: true,
  //       showToggle: true,
  //       showColumns: true,
  //       search: true,
  //       pageSize: 25,
  //       striped: true,
  //       showFullscreen: true,
  //       stickyHeader: true,
  //       showExport: true,
  //       data: this.articlePMID
  //     });
  //   });
  // }

  onDescScroll() {
    console.log('onScroll Here');
    if (!this.isloading && !this.loadingDesc) {
      if (this.notscrolly && this.notEmptyPost && (this.filterParams['tabType'] == "details" || this.filterParams['tabType'] == "default")) {
        console.log('onScroll Here inside');
        // this.spinner.show();
        this.notscrolly = false;
        this.currentPage++;
        this.loadNextDataSet();
      }
    } else {
      console.log('onScroll Here2', this.isloading);
    }
  }

  loadNextDataSet() {
    // console.log("currentPage: ", this.currentPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": startIndex, "limitValue": this.itemsPerPage });
    this.notscrolly = true;
    // this.getEventDescription(this.filterParams);

    if (this.filterParams.source_node != undefined) {
      // this.loadingDesc = true;
      // this.isloading = true;

      //First Degree Data
      if (this.filterParams.nnrt_id != "") {
        this.isloading = true;
        const firstScrollAPIs = this.nodeSelectsService.getMasterListsRevampLevelOne(this.filterParams);

        let combinedScrollDataAPI;
        if (this.filterParams.nnrt_id2 != undefined) {
          const secondScrollAPI = this.nodeSelectsService.getMasterListsRevampLevelTwo(this.filterParams);
          if (this.filterParams.nnrt_id3 != undefined) {
            const thirdScrollAPI = this.nodeSelectsService.getMasterListsRevampLevelThree(this.filterParams);
            combinedScrollDataAPI = [firstScrollAPIs, secondScrollAPI, thirdScrollAPI];
          } else {
            combinedScrollDataAPI = [firstScrollAPIs, secondScrollAPI];
          }
        } else {
          combinedScrollDataAPI = [firstScrollAPIs];
        }

        forkJoin(combinedScrollDataAPI) //we can use more that 2 api request 
          .subscribe(
            result => {
              // console.log("you scroll here: ", result);
              //this will return list of array of the result
              this.firstScrollApiResult = result[0];
              this.secondScrollApiResult = result[1];
              this.thirdScrollApiResult = result[2];
              // console.log("first Scroll Api Result: ", this.firstScrollApiResult);
              // console.log("second Scroll Api Result: ", this.secondScrollApiResult);
              // console.log("third Scroll Api Result: ", this.thirdScrollApiResult);

              if (this.thirdScrollApiResult != undefined) {
                if (this.firstScrollApiResult.masterListsData.length === 0 && this.secondScrollApiResult.masterListsData.length === 0 && this.thirdScrollApiResult.masterListsData.length === 0) {
                  this.notEmptyPost = false;
                  this.isloading = false;
                }
              }
              else if (this.secondScrollApiResult != undefined) {
                if (this.firstScrollApiResult.masterListsData.length === 0 && this.secondScrollApiResult.masterListsData.length === 0) {
                  this.notEmptyPost = false;
                  this.isloading = false;
                }
              } else {
                if (this.firstScrollApiResult.masterListsData.length === 0) {
                  this.notEmptyPost = false;
                  this.isloading = false;
                }
              }

              ////////// **************** Merging the data into one place *******************////////////////
              this.masterListsDataDetailsExtraLevelOne = this.firstScrollApiResult.masterListsData;
              this.masterListsData = this.masterListsDataDetailsExtraLevelOne;
              console.log("First Level Scroll Data Store: ", this.masterListsDataDetailsExtraLevelOne);
              let firstLevelExtraDataStore = this.masterListsDataDetailsExtraLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsExtraLevelTwo = [];
              if (this.secondScrollApiResult != undefined) {
                this.masterListsDataDetailsExtraLevelTwo = this.secondScrollApiResult.masterListsData;
                console.log("Second Level Extra Data: ", this.masterListsDataDetailsExtraLevelTwo);
                this.masterListsData = [].concat(firstLevelExtraDataStore, this.masterListsDataDetailsExtraLevelTwo);
              }
              let secondLevelExtraDataStore = this.masterListsDataDetailsExtraLevelTwo; //Store the Second level data

              //Third Degree Data
              this.masterListsDataDetailsExtraLevelThree = [];
              if (this.thirdScrollApiResult != undefined) {
                this.masterListsDataDetailsExtraLevelThree = this.thirdScrollApiResult.masterListsData;
                console.log("Third Level Data: ", this.masterListsDataDetailsExtraLevelThree);
                this.masterListsData = [].concat(firstLevelExtraDataStore, secondLevelExtraDataStore, this.masterListsDataDetailsExtraLevelThree);
              }
              console.log("Combined Scroll Data: ", this.masterListsData);
              // console.log("here combined: ", this.masterListsDataDetailsCombined);
              // console.log("here combined count: ", this.masterListsDataDetailsCombined.length);

              this.loadingDesc = false;
              ////////// **************** End Merging the data into one place *******************////////////////

              this.masterListsDataDetailsExtra = [];
              let j = (this.masterListsDataDetailsCombined.length + 1);
              this.masterListsData.forEach((event: any, index: any) => {
                var temps: any = {};
                //Get the Edge Type Name
                const regex = /[{}]/g;
                const edgeTypeIds = event.edge_type_ids;
                const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
                //console.log("event: ", event);//use this variable, gautam
                const edgeTypeNeIds = event.ne_ids;
                const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
                //console.log(edgeTypeNeIdsPost);
                // temps["news_id"] = event.news_id;
                temps["news_id"] = j;
                temps["sourcenode_name"] = event.sourcenode_name;
                temps["destinationnode"] = event.destinationnode;
                temps["destinationnode_name"] = event.destinationnode_name;
                temps["level"] = event.level;
                //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
                //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
                temps["pmidCount"] = event.pmids;
                temps["rank_score"] = (event.rank_score != null ? event.rank_score : 'N/A');
                temps["edgeTypesID"] = edgeTypeIdsPost;
                temps["edgeNeId"] = edgeTypeNeIdsPost;
                // temps["edgeNeCount"] = event.pmids + "&nbsp;&nbsp;<span class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i></span>";
                temps["edgeNeCount"] = "<span class='btn btn-sm btn-primary' style='background-color: var(--bs-btn-hover-bg)'><i class='bi bi-list'></i></span>";
                // temps["ctLists"] = "<button class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i>&nbsp;CT Lists</button> &nbsp;";
                this.masterListsDataDetailsExtra.push(temps);
                j++;
              });
              console.log("New data Scroll Added: ", this.masterListsDataDetailsExtra);
              this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined.concat(this.masterListsDataDetailsExtra);
              this.masterListsDataDetailsCombined_ORG = this.masterListsDataDetailsCombined_ORG.concat(this.masterListsDataDetailsExtra);
              console.log("Total Combined Scroll Data: ", this.masterListsDataDetailsCombined);
              console.log("Total Combined Scroll Data Scroll ORIGINAL: ", this.masterListsDataDetailsCombined_ORG);

              //Selected filter applied when you load the page
              if (this.selectedPMIDCount.length > 0) {
                // debugger
                this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined_ORG.filter((obj: any) => this.selectedPMIDCount.some((d: any) =>
                  d == obj.pmidCount
                ));
                console.log("After Filter: ", this.masterListsDataDetailsCombined);
              } else {
                // debugger
                this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined_ORG;
                console.log("Before Filter: ", this.masterListsDataDetailsCombined);
              }
              //end here to filter the load more data

              this.notscrolly = true;
              this.bootstrapTableChart();
              this.loadingDesc = false;
              this.isloading = false;
            });
      }
    }
  }

  scrollTop() {
    document.querySelector("#articleModal")?.parentElement?.parentElement?.parentElement?.scrollTo({ top: 0 })
  }

  gotoPageTop() {
    window.scrollTo({ top: 0 });
  }

  // loadNextDataSetOLD(event: any) {
  //   //console.log(event.target.value);
  //   this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": event.target.value, "limitValue": 8000 });
  //   this.getEventDescription(this.filterParams);
  // }

  captureScenario(userScenario: any) {
    // this.scenarioForm.value.filter_name = "";
    // this.scenarioForm.value.user_comments = "";
    this.userScenario = this.modalService.open(userScenario, { size: 'lg' });
  }

  //Start to get the data when you click the save with result set
  saveWithResultsetData(event: any) {
    console.log("checked or not: ", event.target.checked);

    if (event.target.checked == true) {
      this.returnResultsetData = true;
      //Start to get all the data from level1, level2 and level3 and combined into one place            
      // this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
      this.filterParams = this.globalVariableService.getFilterParams();
      if (this.filterParams.nnrt_id != undefined) {
        const firstNewAPIs = this.nodeSelectsService.getMasterListsRevampLevelOne(this.filterParams);
        let combinedDataNewAPI;
        if (this.filterParams.nnrt_id2 != undefined) {
          const secondNewAPI = this.nodeSelectsService.getMasterListsRevampLevelTwo(this.filterParams);
          if (this.filterParams.nnrt_id3 != undefined) {
            const thirdNewAPI = this.nodeSelectsService.getMasterListsRevampLevelThree(this.filterParams);
            combinedDataNewAPI = [firstNewAPIs, secondNewAPI, thirdNewAPI];
          } else {
            combinedDataNewAPI = [firstNewAPIs, secondNewAPI];
          }
        } else {
          combinedDataNewAPI = [firstNewAPIs];
        }

        forkJoin(combinedDataNewAPI) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("you load here: ", result);
              //this will return list of array of the result
              this.firstLoadApiNewResult = result[0];
              this.secondLoadApiNewResult = result[1];
              this.thirdLoadApiNewResult = result[2];

              ////////// **************** Merging the data into one place *******************////////////////              
              this.masterListsDataDetailsNewLevelOne = this.firstLoadApiNewResult.masterListsData;
              this.masterListsDataNew = this.masterListsDataDetailsNewLevelOne;
              console.log("First Level New Data: ", this.masterListsDataDetailsNewLevelOne);
              let firstLevelNewDataStore = this.masterListsDataDetailsNewLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsNewLevelTwo = [];
              if (this.secondLoadApiNewResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsNewLevelTwo = this.secondLoadApiNewResult.masterListsData;
                console.log("Second Level New Data: ", this.masterListsDataDetailsNewLevelTwo);
                this.masterListsDataNew = [].concat(firstLevelNewDataStore, this.masterListsDataDetailsNewLevelTwo);
              }
              let secondLevelNewDataStore = this.masterListsDataDetailsNewLevelTwo; //Store the First level data

              //Third Degree Data
              this.masterListsDataDetailsNewLevelThree = [];
              if (this.thirdLoadApiNewResult != undefined) {
                this.masterListsDataDetailsNewLevelThree = this.thirdLoadApiNewResult.masterListsData;
                console.log("Third Level New Data: ", this.masterListsDataDetailsNewLevelThree);
                this.masterListsDataNew = [].concat(firstLevelNewDataStore, secondLevelNewDataStore, this.masterListsDataDetailsNewLevelThree);
              }
              console.log("Combined Data New Load: ", this.masterListsDataNew);
              //End here

              this.detailsLists = [];
              for (var i = 0; i < this.masterListsDataNew.length; i++) {
                this.detailsLists.push({
                  'news_id': i + 1,
                  'sourcenode': this.masterListsDataNew[i].sourcenode_name,
                  'destinationnode': this.masterListsDataNew[i].destinationnode_name,
                  'level': this.masterListsDataNew[i].level,
                  'PMIDCount': this.masterListsDataNew[i].pmids,
                  'RankScore': this.masterListsDataNew[i].rank_score
                });
              }
              console.log("detailsLists: ", this.detailsLists);
            },
            err => {
              alert("Something's went wrong, Please try again!");
              // this.loadingScenario = false;
              this.returnResultsetData = false;
              console.log(err);
            },
            () => {
              // this.scenarioForm.value.filter_name = "";
              // this.scenarioForm.value.user_comments = "";
              // this.scenarioForm.value.result_set_checked = 0;
              // this.loadingScenario = false;
              this.returnResultsetData = false;
            });
      }//end if nnrt_id is not empty tag closed
    } else {
      this.detailsLists = [];
    }

  }
  //End to get the data

  //Start to get the data when you click the save with result set
  saveWithEdgeTypeResultsetData(event: any) {
    console.log("checked or not: ", event.target.checked);

    if (event.target.checked == true) {
      this.returnWithEdgeTypeResultsetData = true;
      this.filterParams = this.globalVariableService.getFilterParams();
      if (this.filterParams.nnrt_id != undefined) {
        const firstNewEdgeTypeAPIs = this.nodeSelectsService.getMasterListsRevampEdgeTypeLevelOne(this.filterParams);
        let combinedDataNewEdgeTypeAPI;
        if (this.filterParams.nnrt_id2 != undefined) {
          const secondNewEdgeTypeAPI = this.nodeSelectsService.getMasterListsRevampEdgeTypeLevelTwo(this.filterParams);
          if (this.filterParams.nnrt_id3 != undefined) {
            const thirdNewEdgeTypeAPI = this.nodeSelectsService.getMasterListsRevampEdgeTypeLevelThree(this.filterParams);
            combinedDataNewEdgeTypeAPI = [firstNewEdgeTypeAPIs, secondNewEdgeTypeAPI, thirdNewEdgeTypeAPI];
          } else {
            combinedDataNewEdgeTypeAPI = [firstNewEdgeTypeAPIs, secondNewEdgeTypeAPI];
          }
        } else {
          combinedDataNewEdgeTypeAPI = [firstNewEdgeTypeAPIs];
        }

        forkJoin(combinedDataNewEdgeTypeAPI) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("you load here edge type: ", result);
              //this will return list of array of the result
              this.firstLoadApiNewEdgeResult = result[0];
              this.secondLoadApiNewEdgeResult = result[1];
              this.thirdLoadApiNewEdgeResult = result[2];
              // console.log("first Load Api Edge Result: ", this.firstLoadApiNewEdgeResult);
              // console.log("second Load Api Edge Result: ", this.secondLoadApiNewEdgeResult);
              // console.log("third Load Api Edge Result: ", this.thirdLoadApiNewEdgeResult);

              ////////// **************** Merging the data into one place *******************////////////////              
              this.masterListsDataDetailsNewEdgeLevelOne = this.firstLoadApiNewEdgeResult.masterListsDataEdges;
              this.masterListsEdgeDataNew = this.masterListsDataDetailsNewEdgeLevelOne;
              console.log("First Level New Edge Data: ", this.masterListsDataDetailsNewEdgeLevelOne);
              let firstLevelNewDataStore = this.masterListsDataDetailsNewEdgeLevelOne; //Store the First level data

              //Second Degree Data
              this.masterListsDataDetailsNewEdgeLevelTwo = [];
              if (this.secondLoadApiNewEdgeResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsNewEdgeLevelTwo = this.secondLoadApiNewEdgeResult.masterListsDataEdges;
                console.log("Second Level New Edge Data: ", this.masterListsDataDetailsNewEdgeLevelTwo);
                this.masterListsEdgeDataNew = [].concat(firstLevelNewDataStore, this.masterListsDataDetailsNewEdgeLevelTwo);
              }
              let secondLevelNewDataStore = this.masterListsDataDetailsNewEdgeLevelTwo; //Store the First level data

              //Third Degree Data
              this.masterListsDataDetailsNewEdgeLevelThree = [];
              if (this.thirdLoadApiNewEdgeResult != undefined) {
                this.masterListsDataDetailsNewEdgeLevelThree = this.thirdLoadApiNewEdgeResult.masterListsDataEdges;
                console.log("Third Level New Edge Data: ", this.masterListsDataDetailsNewEdgeLevelThree);
                this.masterListsEdgeDataNew = [].concat(firstLevelNewDataStore, secondLevelNewDataStore, this.masterListsDataDetailsNewEdgeLevelThree);
              }
              console.log("Combined Data New Edge Load: ", this.masterListsEdgeDataNew);
              //End here

              this.detailsEdgeLists = [];
              for (var i = 0; i < this.masterListsEdgeDataNew.length; i++) {
                this.detailsEdgeLists.push({
                  'news_id': i + 1,
                  'sourcenode': this.masterListsEdgeDataNew[i].sourcenode_name,
                  'destinationnode': this.masterListsEdgeDataNew[i].destinationnode_name,
                  'level': this.masterListsEdgeDataNew[i].level,
                  'edgeTypeName': this.masterListsEdgeDataNew[i].edge_type_name,
                  'neId': this.masterListsEdgeDataNew[i].ne_id,
                  'PMIDCount': this.masterListsEdgeDataNew[i].pmids,
                  'RankScore': this.masterListsEdgeDataNew[i].rank_score
                });
              }
              console.log("detailsEdgeLists: ", this.detailsEdgeLists);
            },
            err => {
              alert("Something's went wrong, Please try again!");
              // this.loadingScenario = false;
              this.returnWithEdgeTypeResultsetData = false;
              console.log(err);
            },
            () => {
              // this.scenarioForm.value.filter_name = "";
              // this.scenarioForm.value.user_comments = "";
              // this.scenarioForm.value.result_set_checked = 0;
              // this.loadingScenario = false;
              this.returnWithEdgeTypeResultsetData = false;
            });
      }//end if nnrt_id is not empty tag closed
    } else {
      this.detailsEdgeLists = [];
    }
  }
  //End to get the data

  ///////// ************* SAVE the scenario *******************/////////////////////
  saveCaptureScenario() {

    this.loadingScenario = true;
    let firstNodeLength = this.globalVariableService.getSelectedNodeSelects();
    let firstSourceNodeLength = this.globalVariableService.getSelectedSourceNodes().length;

    var filterCC = this.globalVariableService.getFilterParams(
      {
        'destination_node_all_for_ct': this.globalVariableService.setSelectedAllForCTDestinationNodes([]),
        'destination_node_all_for_ct2': this.globalVariableService.setSelectedAllForCTDestinationNodes2([]),
        'destination_node_all_for_ct3': this.globalVariableService.setSelectedAllForCTDestinationNodes3([])
      }
    );
    // var filterCC = this.globalVariableService.getFilterParams();
    // var filterCC = this.globalVariableService.getFilterParams({ 'ta_id_dashboard': this.globalVariableService.setSelectedTaForDashboard([]), 'di_ids_dashboard': this.globalVariableService.setSelectedIndicationForDashboard([]), 'ta_id': this.globalVariableService.setSelectedTa([]), 'di_ids': this.globalVariableService.setSelectedIndication([]), 'single_ta_id': this.globalVariableService.setSelectedSingleTa([]) });
    console.log("filterParam in preview: ", filterCC);

    if (firstNodeLength != undefined && firstSourceNodeLength >= 1) {

      this.scenarioService.getPerUserScenarios(this.currentUser).subscribe(
        data => {
          this.result = data;
          this.scenariosPerUserCount = this.result.totalScenariosPerUser[0].count;
          console.log("scenario per user: ", this.scenariosPerUserCount);

          if (this.scenariosPerUserCount > 50) {
            this.userScenario.close();
            this.loadingScenario = false;
            alert("Each user atleast 50 queries are saved.....");
            // return false;
          }
          else {
            // console.log("check or not: ", this.scenarioForm.value.result_set_checked);
            // console.log("with edge checked or not: ", this.scenarioForm.value.result_set_with_edge_type);

            if (!this.scenarioForm.value.result_set_checked && !this.scenarioForm.value.result_set_with_edge_type) {
              this.scenario = {
                user_id: this.currentUser,
                filter_criteria: filterCC, //filterCC,
                filter_name: this.scenarioForm.value.filter_name,
                user_comments: this.scenarioForm.value.user_comments,
                result_set_checked: false,
                result_set_with_edge_type: false
              };
              console.log("your scenario1: ", this.scenario);
              this.scenarioService.addUserScenario(this.scenario).subscribe(
                data => {
                  const datas: any = data;
                  alert("Scenario Saved Successfully...");
                  this.userScenario.close();
                },
                err => {
                  alert("Please choose another scenario name, this one is already exists or Data size is large. Reduce it by apply more accurate filters");
                  this.loadingScenario = false;
                  console.log(err);
                },
                () => {
                  this.scenarioForm.value.filter_name = "";
                  this.scenarioForm.value.user_comments = "";
                  this.scenarioForm.value.result_set_checked = 0;
                  this.loadingScenario = false;
                }
              );
            }
            else {
              this.scenario = {
                user_id: this.currentUser,
                filter_criteria: filterCC, //filterCC,
                filter_name: this.scenarioForm.value.filter_name,
                user_comments: this.scenarioForm.value.user_comments,
                result_set_checked: this.scenarioForm.value.result_set_checked,
                result_set_with_edge_type: this.scenarioForm.value.result_set_with_edge_type,
                result_data_set: this.detailsLists,
                result_data_set_edge: this.detailsEdgeLists
              };
              console.log("your scenario2: ", this.scenario);

              this.scenarioService.addUserScenario(this.scenario).subscribe(
                data => {
                  const datas: any = data;
                  // console.log("dataFromSave: ", datas.scenarioLastId); // GET the last insert Scenario ID
                  alert("Scenario Saved Successfully...");
                  this.userScenario.close();
                  // this.scenarioForm.value.filter_name = "";
                  // this.scenarioForm.value.user_comments = "";
                  // console.log(data);                
                  // this.informatorySecarioExpendedStatus = false;                
                },
                err => {
                  alert("Please choose another scenario name, this one is already exists or Data size is large. Reduce it by apply more accurate filters");
                  this.loadingScenario = false;
                  console.log(err);
                },
                () => {
                  this.scenarioForm.value.filter_name = "";
                  this.scenarioForm.value.user_comments = "";
                  this.scenarioForm.value.result_set_checked = 0;
                  this.scenarioForm.value.result_set_with_edge_type = 0;
                  this.loadingScenario = false;
                }
              );

            }

          }
        },
        err => {
          // this.loading = false;
          console.log(err);
        },
        () => {
          // this.loading = false;
        }
      );
    } else {
      this.userScenario.close();
      alert("Please select atleat one Pair Type and Source Node");
      //return false;
    }
  }

  // captureScenarioWithResult(userScenarioWithResult: any) {
  //   this.userScenarioWithResult = this.modalService.open(userScenarioWithResult, { size: 'lg' });
  // }

  closePopup() {
    this.userScenario.close();
  }

  // closePopup2() {
  //   this.userScenarioWithResult.close();
  // }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  By: Piyush
  *** Article with Evidence Data Download Section ***
  Objective: In backend we'll generate excel with Articles and Evidence data together & Upload the file on S3 bucket.
  Later on user can download that excel from application.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  captureSentences(userSentences: any) {

    this.sentenceForm.controls['scenario_exist_name'].value == ''
    this.sentenceForm.controls['scenario_exist_name'].enable();
    this.sentenceForm.controls['filter1_name'].value == ''
    this.sentenceForm.controls['filter1_name'].enable();

    //GET the scenario exist name
    this.loadingArticleScenarioLists = true;
    this.nodeSelectsService.getArticleSentencesScenario(this.currentUser).subscribe(
      data => {
        this.scenarioExistName = data;
        this.scenarioExistName = this.scenarioExistName.scenario_exist_lists;
        console.log("scenario lists: ", this.scenarioExistName);
        this.loadingArticleScenarioLists = false;
      }
    );

    if (jQuery("#articles_details").bootstrapTable('getSelections').length > 0) {
      this.userSentences = this.modalService.open(userSentences, { size: 'lg' });
      this.downloadData = jQuery("#articles_details").bootstrapTable('getSelections');
      console.log("selected articles: ", this.downloadData);
    } else {
      alert("Atleast one article need to select!");
    }

  }

  // $('#button').click(function () {
  //   alert('getSelections: ' + JSON.stringify($("#table").bootstrapTable('getSelections')));
  // })

  articlesWithEvidenceData() {
    this.loadingArticleSaved = true;

    // let downloadData = jQuery("#articles_details").bootstrapTable('getSelections');
    // let downloadData = JSON.stringify(jQuery("#articles_details").bootstrapTable('getSelections'));
    // console.log(downloadData);

    this.scenarioService.getPerUserSentenceScenarios(this.currentUser).subscribe(
      data => {
        this.result = data;
        this.sentenceScenariosPerUserCount = this.result.totalSentenceScenariosPerUser[0].count;
        console.log("sentences scenario per user: ", this.sentenceScenariosPerUserCount);

        if (this.sentenceScenariosPerUserCount > 20) {
          this.userSentences.close();
          this.loadingArticleSaved = false;
          alert("Each user atleast 20 queries are saved.....");
          // return false;
        }
        else {
          let articleLists: Array<object> = [];
          for (var i = 0; i < this.downloadData.length; i++) {
            articleLists.push({
              'source': this.downloadData[i].source,
              'destination': this.downloadData[i].destination,
              'pubmed_id': this.downloadData[i].pubmed_id,
              'publication_date': this.downloadData[i].publication_date,
              'title': this.downloadData[i].title,
              'ne_id': this.downloadData[i].ne_id,
              'edge_type': this.downloadData[i].edge_type
            });
          }
          // console.log(articleLists);
          this.articleSentencesScenario = {
            user_id: this.currentUser,
            filter1_name: this.sentenceForm.value.filter1_name,
            scenario_exist_id: this.sentenceForm.value.scenario_exist_name,
            user1_comments: this.sentenceForm.value.user1_comments,
            result_data_set: articleLists
          };
          console.log("your article and sentences: ", this.articleSentencesScenario);

          this.nodeSelectsService.downloadAtricleAndEvidencesData(this.articleSentencesScenario).subscribe(
            (p: any) => {
              let sentences = p;
              console.log(JSON.stringify(sentences));
              alert("Articles and sentences Saved Successfully...");
              this.userSentences.close();
            },
            err => {
              alert("Articles and sentences not saved...");
              this.loadingArticleSaved = false;
              console.log(err);
            },
            () => {
              this.loadingArticleSaved = false;
            }
          )
        }
      },
      err => {
        // this.loading = false;
        console.log(err);
      },
      () => {
        // this.loading = false;
      });
  }

  closePopup2() {
    this.userSentences.close();
  }

  onScenarioChoose(val: any) {
    if (val == 'input') {
      if (this.sentenceForm.controls['filter1_name'].value == '') {
        this.sentenceForm.controls['scenario_exist_name'].enable();
      }
      else {
        this.sentenceForm.controls['scenario_exist_name'].disable();
        this.sentenceForm.controls['scenario_exist_name'].setValue('')
      }
    } else {
      if (this.sentenceForm.controls['scenario_exist_name'].value == '') {
        this.sentenceForm.controls['filter1_name'].enable();
      }
      else {
        this.sentenceForm.controls['filter1_name'].setValue('');
        this.sentenceForm.controls['filter1_name'].disable();
      }
    }
  }

  selectPMIDCount(elem: any, event: any) {
    console.log(elem);
    console.log(event.target.checked);
    if (elem != null) {
      if (event.target.checked) {
        this.selectedPMIDCount.push(elem);
      } else {
        this.selectedPMIDCount.splice(this.selectedPMIDCount.indexOf(elem), 1);
      }
      console.log("selectedPMIDCount: ", this.selectedPMIDCount);
      console.log("before filter: ", this.masterListsDataDetailsCombined_ORG);

      if (this.selectedPMIDCount.length > 0) {
        this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined_ORG.filter((obj: any) => this.selectedPMIDCount.some((d: any) =>
          d == obj.pmidCount
        ));
        console.log("after filter: ", this.masterListsDataDetailsCombined);
      } else {
        this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined_ORG;
        console.log("reset again: ", this.masterListsDataDetailsCombined);
      }
    } else {
      $('#pmid_count[type=checkbox]').prop('checked',false);
      this.selectedPMIDCount=[];
      console.log("pmid Count: ", this.selectedPMIDCount);
      
      this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined_ORG;
      console.log("reset again: ", this.masterListsDataDetailsCombined);
    }
    this.bootstrapTableChart();
    // if (this.filterParams.nnrt_id != undefined)
    //   this.masterListsDataDetailsCombined = newArray;

    // debugger
    // console.log("Total Combined New Data: ", newArray);
    // this.notscrolly = true;
    // this.getEventDescription(this.filterParams, this.selectedPMIDCount);
  }

}
