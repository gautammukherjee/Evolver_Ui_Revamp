import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from './../services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { ScenarioService } from '../services/common/scenario.service';
import { Subject, BehaviorSubject, map, mergeMap, forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";

declare var jQuery: any;

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  providers: [DatePipe]
})
export class PreviewComponent implements OnInit {
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

  loadingDesc = false;
  params: any;
  layout: any = {};
  graphData: any = [];
  // diseaseCheck: any;
  // hideCardBody: boolean = true;
  private modalRef: any;

  loaderEdgeType = false;
  private edgeTypeDescModal: any;
  @ViewChild('edgeTypeDescModal', { static: false }) edgeTypeDescModal_Detail: ElementRef | any;


  loaderArticle = false;
  private articleModal: any;
  @ViewChild('articleModal', { static: false }) articleModal_Detail: ElementRef | any;

  edgeTypeList: any = [];
  helpContents: any;
  masterListsData: any = [];

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
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];
  public articleHere: any = [];
  articleList: any = [];
  public articleHerePMID: any = [];
  articlePMID: any = [];
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2000;
  public isloading: boolean = false;
  loaderEvidence = false;
  noDataFoundDetails: boolean = false;

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  thirdLoadApiResult: any;
  firstCompleteApiResult: any;
  secondCompleteApiResult: any;
  thirdCompleteApiResult: any;
  firstScrollApiResult: any;
  secondScrollApiResult: any;
  thirdScrollApiResult: any;

  scenarioVar: any;
  scenario: object = {};
  moduleTypes: number = 0;
  scenariosPerUserCount: number = 0;
  private userScenario: any;
  private currentUser: any = JSON.parse(sessionStorage.getItem('currentUser') || "null");
  loadingScenario: boolean = false;
  fromScenarioChk: any = null;
  scenarioName: any = null;
  uploadedFileUrl: any = null;

  //All filters here
  loadingFirstNode = false;
  loadingFirstSource = false;
  loadingFirstEdgeType = false;
  loadingFirstDestination = false;
  public node_selects1: any = [];
  public sourceNodesFirst: any = [];
  public edgeTypesFirst: any = [];
  public destinationNodesFirst: any = [];

  loadingSecondNode = false;
  loadingSecondSource = false;
  loadingSecondEdgeType = false;
  loadingSecondDestination = false;
  public node_selects2: any = [];
  public sourceNodesSecond: any = [];
  public edgeTypesSecond: any = [];
  public destinationNodesSecond: any = [];

  loadingThirdNode = false;
  loadingThirdSource = false;
  loadingThirdEdgeType = false;
  loadingThirdDestination = false;
  public node_selects3: any = [];
  public sourceNodesThird: any = [];
  public edgeTypesThird: any = [];
  public destinationNodesThird: any = [];
  loadingArticleScenarioLists = false;
  public loadingArticleSaved: boolean = false;
  articleSentencesScenario: object = {};
  scenarioExistName: any;
  private userSentences: any;
  downloadData: any = [];
  // firstAPI: any;
  // secondAPI: any;

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
    private router: Router
  ) { }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters1: ", this.filterParams);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("new Filters2: ", this.filterParams);
    this.getEventDescription();

    if (this.filterParams.nnrt_id != undefined)
      this.getNodeSelects1();
    if (this.filterParams.source_node != undefined)
      this.getSourceNode1();
    if (this.filterParams.edge_type_id != undefined)
      this.getEdgeType1();
    if (this.filterParams.destination_node != undefined)
      this.getDestinationNode1();

    if (this.filterParams.nnrt_id2 != undefined)
      this.getNodeSelects2();
    if (this.filterParams.source_node2 != undefined)
      this.getSourceNode2();
    if (this.filterParams.edge_type_id2 != undefined)
      this.getEdgeType2();
    if (this.filterParams.destination_node2 != undefined)
      this.getDestinationNode2();

    if (this.filterParams.nnrt_id3 != undefined)
      this.getNodeSelects3();
    if (this.filterParams.source_node3 != undefined)
      this.getSourceNode3();
    if (this.filterParams.edge_type_id3 != undefined)
      this.getEdgeType3();
    if (this.filterParams.destination_node3 != undefined)
      this.getDestinationNode3();

    // this.getEventTotalDescription(this.filterParams);

    // this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
    //   //console.log("eventData: ", data);
    //   this.notEmptyPost = true;
    //   this.currentPage = 1;
    //   if (data === undefined) { // data=undefined true when apply filter from side panel
    //     // this.hideCardBody = true;
    //     this.filterParams = this.globalVariableService.getFilterParams();
    //     this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    //     this.getEventDescription(this.filterParams);
    //     // this.getEventTotalDescription(this.filterParams);
    //     //console.log("new Filters for articles: ", this.filterParams);
    //   }
    // });
  }

  getEventDescription() {
    // console.log("abc = "+JSON.stringify(_filterParams));

    let _filterParams: any;
    // _filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);
    _filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("new Filters22: ", _filterParams);


    // if ((_filterParams.source_node != undefined
    //   && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined
    //   && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined && _filterParams.destination_node3 == undefined)
    //   || (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined)
    //   || (_filterParams.source_node3 != undefined && _filterParams.nnrt_id3 != undefined)) {

    this.fromScenarioChk = localStorage.getItem('cameFromScenario');
    this.scenarioName = localStorage.getItem('scenarioName');
    this.uploadedFileUrl = localStorage.getItem('uploadedFileUrl');

    if (this.fromScenarioChk == 1) {
      this.loadingDesc = true;
      this.noDataFoundDetails = false;

      this.filterParams = this.globalVariableService.getFilterParams();
      console.log("new data complete in Preview: ", this.filterParams);

      ///////////////// Start To get the complete data for level 1 and level 2 /////////////////////////////
      if (_filterParams.nnrt_id != undefined) {
        const firstAPIsFull = this.nodeSelectsService.getMasterListsRevampLevelOneCount(this.filterParams);
        let combinedDataAPIFull;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPIFull = this.nodeSelectsService.getMasterListsRevampLevelTwoCount(this.filterParams);
          if (_filterParams.nnrt_id3 != undefined) {
            const thirdAPIFull = this.nodeSelectsService.getMasterListsMapRevampLevelThreeCount(this.filterParams);
            combinedDataAPIFull = [firstAPIsFull, secondAPIFull, thirdAPIFull];
          } else {
            combinedDataAPIFull = [firstAPIsFull, secondAPIFull];
          }
        } else {
          combinedDataAPIFull = [firstAPIsFull];
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
      }
      ///////////////// End To get the complete data for level 1 and level 2 /////////////////////////////

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

              this.loadingDesc = false;
              ////////// **************** End Merging the data into one place *******************////////////////

              this.masterListsDataDetailsLoaded = [];
              let j = 1;
              this.masterListsData.forEach((event: any) => {
                var temps: any = {};
                //Get the Edge Type Name
                const regex = /[{}]/g;
                const edgeTypeIds = event.edge_type_ids;
                const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
                //console.log("event: ", event);//use this variable, gautam
                const edgeTypeNeIds = event.ne_ids;
                const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
                // temps["news_id"] = event.news_id;
                temps["news_id"] = j;
                temps["sourcenode_name"] = event.sourcenode_name;
                temps["destinationnode_name"] = event.destinationnode_name;
                temps["level"] = event.level;
                //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
                //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
                temps["pmidCount"] = event.pmids;
                temps["rank_score"] = (event.rank_score != null ? event.rank_score : 'N/A');
                temps["edgeTypesID"] = edgeTypeIdsPost;
                temps["edgeNeId"] = edgeTypeNeIdsPost;
                temps["edgeNeCount"] = "<button class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i>&nbsp;Articles</button> &nbsp;";
                this.masterListsDataDetailsLoaded.push(temps);
                j++;
              });
              this.masterListsDataDetailsCombined = this.masterListsDataDetailsLoaded;
              console.log("Total Combined Load Data: ", this.masterListsDataDetailsCombined);
              this.bootstrapTableChart();
            });
      }

      localStorage.removeItem('cameFromScenario');
      localStorage.removeItem('scenarioName');
      localStorage.removeItem('uploadedFileUrl');
    } else {
      this.globalVariableService.resetfilters();
      this.router.navigate(['/user-dashboard/']);

    }
    // else if (_filterParams.source_node != undefined) {
    //   this.noDataFoundDetails = true;
    //   // this.masterListsData = [];
    //   // this.loadingDesc = false;
    // }
  }

  bootstrapTableChart() {
    jQuery('#showEventDescriptionP').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 500,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      exportOptions: {
        ignoreColumn: [4],
        // columns: [6],
        // visible: [6,'true'],
      },
      data: this.masterListsDataDetailsCombined,
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
          this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
          this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID, field.level);
        }
      },
    });
    jQuery('#showEventDescriptionP').bootstrapTable("load", this.masterListsDataDetailsCombined);
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

  ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, level: number) {
    this.articleHere = [];
    const edgeNeIdArr = edgeNeId.split(",");
    //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);
    var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";

    this.nodeSelectsService.getEdgeTypeSentencePMIDLists({ 'ne_ids': edgeNeIdArr, 'edge_type_id': (level == 1 ? this.filterParams['edge_type_id'] : this.filterParams['edge_type_id2']) }).subscribe((p: any) => {
      this.result = p;
      console.log(this.result);
      this.articleHere = this.result.pmidListsSentence;
      this.articleList = [];
      var i = 1;
      this.articleHere.forEach((event: any) => {
        var temps: any = {};
        temps["id"] = i;
        temps["source"] = sourceNode;
        temps["destination"] = destinationNode;
        temps["pubmed_id"] = event.pmid;
        temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
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
          if (((tr_class === undefined)  || (tr_class === "selected")) || (tr_class != "sentence_container")) {
            //console.log($element);
            let sentences: any;
            let html: string;
            let html_str: string;
            let html_res: string;

            if (field == "sentence_btn") {
              //console.log(row.ne_id);

              this.loaderEvidence = true;
              this.nodeSelectsService.getEvidenceData({ 'ne_id': row.ne_id, 'pubmed_id': row.pubmed_id }).subscribe((p: any) => {
                sentences = p;
                //console.log(JSON.stringify(sentences));
                if (sentences.evidence_data.length == 0) {
                  this.loaderEvidence = false;
                  $($element).parent().after('<tr class="sentence_container"><td colspan="8"><div class="alert alert-danger">No Evidence found in database!</div></td></tr>');
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
                    html_str += "<td  width='20%'>" + sentences.evidence_data[i].edge_name + "</td>";
                    html_str += "<td  width='30%'><span style='color:" + e1_color + "'>" + sentences.evidence_data[i].gene_symbol_e2 + "</span>(" + sentences.evidence_data[i].e2_type_name + ")</td>";
                    html_str += "<td  width='20%'>PMID: <a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + sentences.evidence_data[i].pubmed_id + "'>" + sentences.evidence_data[i].pubmed_id + "</a></td>"
                    html_str += "</tr>";

                    html_str += "<tr>";
                    html_str += "<td colspan='4'>" + sentence_text1 + "</td>";
                    html_str += "</tr>";
                    html_str += "</table>";

                    html_res += html_str;
                    this.loaderEvidence = false;
                  };//for

                  $($element).parent().after('<tr class="sentence_container"><td colspan="8">' + html_res + '</td></tr>');
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
            if ($($element).parent().next().is(":visible")) {
              $($element).parent().next().hide(950);
              $($element).children().eq(1).text("Show");
            } else {
              $($element).parent().next().show(950);
              $($element).children().eq(1).text("Hide")
            }
          }
        },
      });
      this.loaderArticle = false;
    });
  }

  onDescScroll() {
    console.log('onScroll Here');
    if (!this.isloading && !this.loadingDesc) {
      if (this.notscrolly && this.notEmptyPost && this.filterParams['tabType'] == "preview") {
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
    console.log("currentPage: ", this.currentPage);
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
              console.log("you scroll here: ", result);
              //this will return list of array of the result
              this.firstScrollApiResult = result[0];
              this.secondScrollApiResult = result[1];
              this.thirdScrollApiResult = result[2];
              console.log("first Scroll Api Result: ", this.firstScrollApiResult);
              console.log("second Scroll Api Result: ", this.secondScrollApiResult);
              console.log("third Scroll Api Result: ", this.thirdScrollApiResult);

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
              console.log("here combined: ", this.masterListsDataDetailsCombined);
              console.log("here combined count: ", this.masterListsDataDetailsCombined.length);

              this.loadingDesc = false;
              ////////// **************** End Merging the data into one place *******************////////////////

              this.masterListsDataDetailsExtra = [];
              let j = (this.masterListsDataDetailsCombined.length + 1);
              this.masterListsData.forEach((event: any) => {
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
                temps["destinationnode_name"] = event.destinationnode_name;
                temps["level"] = event.level;
                //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
                //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
                temps["pmidCount"] = event.pmids;
                temps["rank_score"] = (event.rank_score != null ? event.rank_score : 'N/A');
                temps["edgeTypesID"] = edgeTypeIdsPost;
                temps["edgeNeId"] = edgeTypeNeIdsPost;
                temps["edgeNeCount"] = "<button class='btn btn-sm btn-primary'><i class='bi bi-card-heading'></i>&nbsp;Articles</button> &nbsp;";
                this.masterListsDataDetailsExtra.push(temps);
                j++;
              });
              console.log("New data Scroll Added: ", this.masterListsDataDetailsExtra);
              this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined.concat(this.masterListsDataDetailsExtra);
              console.log("Total Combined Scroll Data: ", this.masterListsDataDetailsCombined);
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

  captureScenario(userScenario: any) {
    this.userScenario = this.modalService.open(userScenario, { size: 'lg' });
  }

  closePopup() {
    this.userScenario.close();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  By: Piyush
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  //Articles and Sentences stores and download the data
  
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
      alert("Atleast 1 article are select.....");
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


  ////////// All Filters section /////////////////

  //First Degree All Filters

  //1. Node Filters1
  public getNodeSelects1() {
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });

    if (this.filterParams.nnrt_id != undefined) {
      this.loadingFirstNode = true;
      this.nodeSelectsService.getNodeSelects(this.filterParams) 
        .subscribe(
          data => {
            this.result = data;
            this.node_selects1 = this.result.nodeSelectsRecords;
            console.log("node_selects_preview: ", this.node_selects1);
          },
          err => {
            this.loadingFirstNode = false;
            console.log(err.message)
          },
          () => {
            this.loadingFirstNode = false;
            console.log("loading finish")
          }
        );
    }
    else {
      this.node_selects1 = [];
      // this.globalVariableService.resetfiltersForLevel1();
    }
  }
  //2. Source Filters1
  public getSourceNode1() {
    // this.selectedSourceNodes = [];
    this.loadingFirstSource = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    console.log("filterparamsSearchSource: ", this.filterParams);
    // this.params = this.globalVariableService.getFilterParams();
    this.nodeSelectsService.getSourceNode(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.sourceNodesFirst = this.result.sourceNodeRecords;
          // 1. get the json objects
          console.log("sourceNodesFirst: ", this.sourceNodesFirst);
        },
        err => {
          this.loadingFirstSource = false;
          console.log(err.message)
        },
        () => {
          this.loadingFirstSource = false;
          console.log("loading finish")
        }
      );
  }
  //3. Edge Type Filters1
  public getEdgeType1() {
    this.loadingFirstEdgeType = true;
    this.params = this.globalVariableService.getFilterParams();
    // this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());

    this.nodeSelectsService.getEdgeTypeSce1(this.params)
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesFirst = this.result.edgeTypeRecords1;
          console.log("edge Types Group: ", this.edgeTypesFirst);
        },
        err => {
          this.loadingFirstEdgeType = false;
          console.log(err.message)
        },
        () => {
          this.loadingFirstEdgeType = false;
          console.log("loading finish")
        }
      );
  }
  //4. Destination Filters1
  public getDestinationNode1() {
    this.loadingFirstDestination = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    console.log("filterparamsSearchSource: ", this.filterParams);
    // this.params = this.globalVariableService.getFilterParams();
    this.nodeSelectsService.getDestinationNode(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.destinationNodesFirst = this.result.destinationNodeRecords;
          // 1. get the json objects
          console.log("destinationNodesFirst: ", this.destinationNodesFirst);
        },
        err => {
          this.loadingFirstDestination = false;
          console.log(err.message)
        },
        () => {
          this.loadingFirstDestination = false;
          console.log("loading finish")
        }
      );
  }


  ////////////////////////************Second Degree All Filters*******************///////////////////

  //1. Node Filters 
  public getNodeSelects2() {
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });

    if (this.filterParams.nnrt_id2 != undefined) {
      this.loadingSecondNode = true;
      this.nodeSelectsService.getNodeSelects2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.node_selects2 = this.result.nodeSelectsRecords;
            console.log("node_selects_preview2: ", this.node_selects2);
          },
          err => {
            this.loadingSecondNode = false;
            console.log(err.message)
          },
          () => {
            this.loadingSecondNode = false;
            console.log("loading finish")
          }
        );
    }
    else {
      this.node_selects2 = [];
      // this.globalVariableService.resetfiltersForLevel1();
    }
  }
  //2. Source Filters
  public getSourceNode2() {
    // this.selectedSourceNodes = [];
    this.loadingSecondSource = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    console.log("filterparamsSearchSource: ", this.filterParams);
    // this.params = this.globalVariableService.getFilterParams();
    this.nodeSelectsService.getSourceNode2(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.sourceNodesSecond = this.result.sourceNodeRecords2;
          // 1. get the json objects
          console.log("sourceNodesSecond: ", this.sourceNodesSecond);
        },
        err => {
          this.loadingSecondSource = false;
          console.log(err.message)
        },
        () => {
          this.loadingSecondSource = false;
          console.log("loading finish")
        }
      );

  }
  //3. Edge Type Filters2
  public getEdgeType2() {
    this.loadingSecondEdgeType = true;
    this.params = this.globalVariableService.getFilterParams();
    // this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());

    this.nodeSelectsService.getEdgeTypeSce2(this.params)
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesSecond = this.result.edgeTypeRecords2;
          console.log("edge Types 2: ", this.edgeTypesSecond);
        },
        err => {
          this.loadingSecondEdgeType = false;
          console.log(err.message)
        },
        () => {
          this.loadingSecondEdgeType = false;
          console.log("loading finish")
        }
      );
  }
  //4. Destination Filters2
  public getDestinationNode2() {
    this.loadingSecondDestination = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    this.nodeSelectsService.getDestinationNode2(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.destinationNodesSecond = this.result.destinationNodeRecords2;
          console.log("destinationNodesSecond: ", this.destinationNodesSecond);
        },
        err => {
          this.loadingSecondDestination = false;
          console.log(err.message)
        },
        () => {
          this.loadingSecondDestination = false;
          console.log("loading finish")
        }
      );
  }

  //Third Degree All Filters

  //1. Node Filters 
  public getNodeSelects3() {
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });

    if (this.filterParams.nnrt_id3 != undefined) {
      this.loadingThirdNode = true;
      this.nodeSelectsService.getNodeSelects3(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.node_selects3 = this.result.nodeSelectsRecords;
            console.log("node_selects_preview3: ", this.node_selects3);
          },
          err => {
            this.loadingThirdNode = false;
            console.log(err.message)
          },
          () => {
            this.loadingThirdNode = false;
            console.log("loading finish")
          }
        );
    }
    else {
      this.node_selects3 = [];
      // this.globalVariableService.resetfiltersForLevel1();
    }
  }
  //2. Source Filters
  getSourceNode3() {
    // this.selectedSourceNodes = [];
    this.loadingThirdSource = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    console.log("filterparamsSearchSource: ", this.filterParams);
    // this.params = this.globalVariableService.getFilterParams();
    this.nodeSelectsService.getSourceNode3(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.sourceNodesThird = this.result.sourceNodeRecords3;
          // 1. get the json objects
          console.log("sourceNodesThird: ", this.sourceNodesThird);
        },
        err => {
          this.loadingThirdSource = false;
          console.log(err.message)
        },
        () => {
          this.loadingThirdSource = false;
          console.log("loading finish")
        }
      );

  }
  //3. Edge Type Filters3
  public getEdgeType3() {
    this.loadingThirdEdgeType = true;
    this.params = this.globalVariableService.getFilterParams();
    // this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());

    this.nodeSelectsService.getEdgeTypeSce2(this.params)
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesThird = this.result.edgeTypeRecords3;
          console.log("edge Types 3: ", this.edgeTypesThird);
        },
        err => {
          this.loadingThirdEdgeType = false;
          console.log(err.message)
        },
        () => {
          this.loadingThirdEdgeType = false;
          console.log("loading finish")
        }
      );
  }
  //4. Destination Filters3
  public getDestinationNode3() {
    this.loadingThirdDestination = true;
    this.filterParams = this.globalVariableService.getFilterParams({ 'cameFromScenario': this.fromScenarioChk });
    this.nodeSelectsService.getDestinationNode3(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          this.destinationNodesThird = this.result.destinationNodeRecords3;
          console.log("destinationNodesThird: ", this.destinationNodesThird);
        },
        err => {
          this.loadingThirdDestination = false;
          console.log(err.message)
        },
        () => {
          this.loadingThirdDestination = false;
          console.log("loading finish")
        }
      );
  }
}
