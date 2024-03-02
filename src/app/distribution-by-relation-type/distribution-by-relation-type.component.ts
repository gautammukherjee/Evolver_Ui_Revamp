import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from './../services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from "moment";

declare let jQuery: any;

@Component({
  selector: 'app-distribution-by-relation-type',
  templateUrl: './distribution-by-relation-type.component.html',
  styleUrls: ['./distribution-by-relation-type.component.scss'],
  providers: [DatePipe]
})
export class DistributionByRelationTypeComponent implements OnInit {
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  private filterParams: any;
  result: any = [];
  resultNodes: any = [];

  loadingDesc: boolean = false;
  noDataFound: boolean = false;
  params: any;
  layout: any = {};
  graphData: any = [];
  // diseaseCheck: any;
  // hideCardBody: boolean = true;
  modalRef: any;
  helpContents: any;
  distributionData: any = [];
  distributionDataDetails: any = [];
  distributionDataDetailsLevelOne: any = [];
  distributionDataDetailsLevelTwo: any = [];
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];
  resultNodesPopup: any = [];
  pmidData: any = [];
  loadingPMIDLists: boolean = false;
  noSourceNodeSelected:number=0;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);
    this.getDistributionByRelationType(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("Relation Type: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDistributionByRelationType(this.filterParams);
        // console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  getDistributionByRelationType(_filterParams: any) {
    // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined) || (_filterParams.nnrt_id2 != undefined && _filterParams.source_node2!=undefined)) {
    if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined) || ((_filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id2 != "") && _filterParams.source_node2 != undefined)) {
      console.log("Rel Type IN: ", this.filterParams);
      this.loadingDesc = true;
      this.noDataFound = false;
      this.noSourceNodeSelected=0;
      this.nodeSelectsService.getDistributionRelationType(_filterParams).subscribe(
        data => {
          this.resultNodes = data;

          //First level data
          if (_filterParams.nnrt_id2 == undefined || _filterParams.nnrt_id2 == '') {
            this.distributionDataDetailsLevelOne = this.resultNodes.distributionData;
            this.distributionData = this.distributionDataDetailsLevelOne;
          }
          let firstLevelDataStore = this.distributionDataDetailsLevelOne; //Store the First level data
          console.log("First Level Data Store: ", firstLevelDataStore);

          //Second level data and Combined data first and second level
          if (_filterParams.nnrt_id2 != "" && _filterParams.nnrt_id2 != undefined) {
            this.distributionDataDetailsLevelTwo = this.resultNodes.distributionData;
            this.distributionData = [].concat(firstLevelDataStore, this.distributionDataDetailsLevelTwo);
            console.log("Combined Data: ", this.distributionData);
          }

          this.distributionDataDetails = [];

          this.distributionData.forEach((event: any) => {
            let temps: any = {};

            // temps["news_id"] = event.news_id;
            temps["source_node_id"] = event.source_node_id;
            temps["source_node_name"] = event.source_node_name;
            temps["destination_node_id"] = event.destination_node_id;
            temps["destination_node_name"] = event.destination_node_name;
            temps["edge_type_id"] = event.edge_type_id;
            temps["pmid_count"] = event.count;
            temps["edge_types_name"] = event.edge_types_name;
            temps["pmidLists"] = "<button class='btn btn-sm btn-primary'>PMID</button>";
            this.distributionDataDetails.push(temps);
          });

          jQuery('#showDistributionRelationData').bootstrapTable({
            bProcessing: true,
            bServerSide: true,
            pagination: true,
            // showRefresh: true,
            // showToggle: true,
            // showColumns: true,
            // search: true,
            pageSize: 25,
            // pageList: [10, 25, 50, 100, All],
            striped: true,
            fixedColumns: true,
            showToggle: true,
            stickyHeader: true,
            showFilter: true,
            filter: true,
            showFullscreen: true,
            showExport: true,
            exportOptions: {
              ignoreColumn: [5],
              // columns: [6],
              // visible: [6,'true'],
            },
            columns: [],
            data: this.distributionDataDetails,
            onClickRow: (field: any, row: any, $element: any) => {
              if ($element == "pmidLists") {
                // console.log("field: ", field);
                let pubmedURLsDownloadLoader: any;
                pubmedURLsDownloadLoader = "<div class='overlay'><img style='position:absolute' src='../../assets/images/loader_big.gif' /></div>";
                $("#pmidListsLoader").html(pubmedURLsDownloadLoader);
                $("#pmidListsData").html('');
                ($('#myModalPMID') as any).modal('show');

                this.filterParams = this.globalVariableService.getFilterParams();

                let nnrtID = ((this.filterParams['nnrt_id2'] == undefined) ? this.filterParams['nnrt_id'] : this.filterParams['nnrt_id2']);
                // console.log("nnrtID", nnrtID);
                // this.nodeSelectsService.getPMIDListsInRelation({ 'source_node': field.source_node_id, 'destination_node': field.destination_node_id, 'edge_type_id': field.edge_type_id, 'nnrt_id': nnrtID }).subscribe(
                this.nodeSelectsService.getPMIDListsInRelation({ 'source_node': field.source_node_id, 'destination_node': field.destination_node_id, 'edge_type_id': field.edge_type_id }).subscribe(
                  data => {
                    // const legendsNodeTypes = [];
                    this.resultNodesPopup = data;
                    this.pmidData = this.resultNodesPopup.pmidLists;
                    console.log("pmidData: ", this.pmidData);

                    let pubmedURLsDownload: any;
                    if (this.pmidData != undefined) {
                      // var PMIDList = edge.PMID.split(",");
                      let pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                      pubmedURLsDownload = "";

                      pubmedURLsDownload = "<div>";
                      this.pmidData.forEach((PMID: any) => {

                        // const myFormattedDate = this.pipe.transform(PMID.publication_date, 'short');
                        // console.log("PMID:: ", PMID.edge_type_name);
                        pubmedURLsDownload += "<div style='font-size: 14px;color:#32404E'>" + PMID.title + "</div>";
                        pubmedURLsDownload += "<div style='list-style: none; font-size: 14px; color:#32404E'><strong>PMID :</strong> <a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + PMID.pmid + "</a></div>";
                        pubmedURLsDownload += "<div style='font-size: 14px; color:#32404E'><strong>Publication Date : </strong>" + PMID.publication_date + "</div>";
                        pubmedURLsDownload += "<hr style='color:#32404E'/>";
                      });
                      pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                      pubmedURLsDownload += "</div>";
                    } else {
                      pubmedURLsDownload = "<h4>No PMID Found..</h4>";
                      pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                    }
                    // console.log("edgeTypeNameData5: ", pubmedURLsDownload);

                    $("#pmidListsLoader").html('');
                    $("#pmidListsData").html(pubmedURLsDownload);
                    ($('#myModalPMID') as any).modal('show');
                  },
                  err => {
                    this.loadingPMIDLists = false;
                    console.log(err.message);
                  },
                  () => {
                    this.loadingPMIDLists = false;
                  });
              }
            }
          });

          jQuery('#showDistributionRelationData').bootstrapTable("load", this.distributionDataDetails);
          // jQuery('#showDistributionRelationData').on("search.bs.table", function (e: any) {
          //   jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
          // })
          //   .on("search.bs.table", function (e: any) {
          //     jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
          //   })
          //   .on("page-change.bs.table", function (e: any) {
          //     jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
          //   });
        },
        err => {
          console.log(err.message);
          this.loadingDesc = false;
        },
        () => {
          this.loadingDesc = false;
        }
      );
    } else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
      this.noSourceNodeSelected=0;
    }else{
      this.noSourceNodeSelected=1;
    }
  }

  getEdgeTypes(edgeTypeIdsPost: any) {
    return this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).pipe(map((p: any) => {
      this.result = p;
      return p;
    }));
  }

}
