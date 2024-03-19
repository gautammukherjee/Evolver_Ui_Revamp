import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeSelectsService } from '../services/common/node-selects.service';

var cytoscape = require('cytoscape');
let fcose = require('cytoscape-fcose');
cytoscape.use(fcose);

import * as $ from "jquery";

declare var jQuery: any;

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  // styles: [
  //   `ng2-cytoscape {
  //       height: 100vh;
  //       float: left;
  //       width: 100%;
  //       position: relative;
  //   }`,
  //   '.modal-header {border-bottom-color: #EEEEEE;background-color: #32404E;color: #fff;}'
  // ],
  styleUrls: ['./network-map.component.scss']
})
export class NetworkMapComponent implements OnInit {

  // @Output() onGraphSelection: EventEmitter<any> = new EventEmitter();
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  private filterParams: any;
  phase: any = {};
  resultNodes: any = [];
  resultEdges: any = [];
  loadingMap = false;
  nodesCheckLength = true;
  public legendsNodeTypes: any = [];

  public results: any = {};
  public nodeData: any = {};
  public sourcenodeData: any = {};
  public sourceId: any = {};

  public destinationnodeData: any = {};
  private groupedNodeType = [];
  public edgeData: any = {};
  masterListsData = [];
  diseaseGenesEdgesData = [];
  private modalRef: any;
  @ViewChild('showNode', { static: false }) show_nodes?: ElementRef;
  @ViewChild('showEdge', { static: false }) show_edges?: ElementRef;

  node_name: string = '';
  edge_name: string = '';
  mapTypes: string = '';
  layout: any = {};
  graphData: any = [];
  doFilterApply: Subject<any> = new Subject();  // ## P= Parent
  isNetworkMapFullScreen: boolean = false;
  noDataFoundMap: boolean = false;
  chkSelectEntities: boolean = true;

  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLengthLevelOne: number = 0;
  remainedCountForFirstLevel: number = 0;
  masterListsDataDetailsLevelTwo: any = [];
  masterListsDataDetailsLevelThree: any = [];
  masterListsDataDetailsLengthLevelTwo: number = 0;
  masterListsDataDetailsLengthLevelThree: number = 0;
  remainedCountForSecondLevel: number = 0;
  remainedCountForThirdLevel: number = 0;

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  thirdLoadApiResult: any;
  firstCompleteApiResult: any;
  secondCompleteApiResult: any;
  thirdCompleteApiResult: any;
  public selectedRankNodes: any = [1];
  public isLightTheme = true;
  noSourceNodeSelected: number=0;
  sourceHeadings:boolean=true;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.globalVariableService.setSelectedRanks([1]);
    this.selectedRankNodes = Array.from(this.globalVariableService.getSelectedRanks());
    this.filterParams = this.globalVariableService.getFilterParams();
  }


  graphSelected(event: any) {
    //    this.doFilterApply.next({ clickOn: param });
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("you here you1:: ", this.filterParams);
    this.getMasterListsMap(this.filterParams, event);
    // this.globalVariableService.resetNode();
    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("you here you2:: ", this.filterParams);
  }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("you here2:: ", this.filterParams);
    this.mapTypes = this.filterParams.mapType;

    // this.drawChart();
    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("network map data: ", data);

      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getMasterListsMap(this.filterParams, null);
        console.log("new Filters2: ", this.filterParams);
      }
      // else if (data.clickOn == 'clickOnEventDetails') { // because graph should not change when click on this component itself
      //   this.filterParams = this.globalVariableService.getFilterParams(this.globalVariableService.getFilterParams());
      //   console.log("new Filters3: ", this.filterParams);
      //   this.getMasterListsMap(this.filterParams, null);
      // }
    });
    // this.getMasterListsMap(this.filterParams, null);
  }

  ngOnDestroy() {
    // needed if child gets re-created (eg on some model changes)
    // note that subsequent subscriptions on the same subject will fail
    // so the parent has to re-create parentSubject on changes
    this.ProceedDoFilterApply?.unsubscribe();
  }

  getMasterListsMap(_filterParams: any, event: any) {
    // console.log("inside: ", event);
    if (event == null) { // if not node right click node_id is reset
      this.globalVariableService.resetNode();
    }

    // if (_filterParams.source_node != undefined) {
    if ((_filterParams.source_node != undefined
      && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined
      && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined && _filterParams.destination_node3 == undefined)
      || (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id3 == undefined && _filterParams.source_node3 == undefined)
      || (_filterParams.source_node3 != undefined && _filterParams.nnrt_id3 != undefined)) {
      this.loadingMap = true;
      this.noDataFoundMap = false;
      this.noSourceNodeSelected=0;

      this.filterParams = this.globalVariableService.getFilterParams();
      console.log("master map for filter: ", this.filterParams);

      ////////////***********/ Start To get the complete data for level 1 and level 2 ************ /////////////////////////
      if (_filterParams.nnrt_id != undefined) {
        const firstAPIsFull = this.nodeSelectsService.getMasterListsMapRevampLevelOneCount(this.filterParams);
        let combinedDataAPIFull;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPIFull = this.nodeSelectsService.getMasterListsMapRevampLevelTwoCount(this.filterParams);
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
              //this will return list of array of the result
              this.firstCompleteApiResult = result[0];
              this.secondCompleteApiResult = result[1];
              this.thirdCompleteApiResult = result[2];
              console.log("first Complete Api Result: ", this.firstCompleteApiResult);
              console.log("second Complete Api Result: ", this.secondCompleteApiResult);
              console.log("third Complete Api Result: ", this.thirdCompleteApiResult);
              this.masterListsDataDetailsLengthLevelOne = this.firstCompleteApiResult.masterListsData[0].count;
              console.log("levelOne: ", this.masterListsDataDetailsLengthLevelOne);

              //To check wheter the first level data is less than 1000 then deduct the first level value from 1000
              this.remainedCountForFirstLevel = (((1000 - this.masterListsDataDetailsLengthLevelOne) <= 0) ? 0 : (1000 - this.masterListsDataDetailsLengthLevelOne));
              console.log("remainedCountForFirstLevel: ", this.remainedCountForFirstLevel);

              if (this.secondCompleteApiResult != undefined) {
                this.masterListsDataDetailsLengthLevelTwo = this.secondCompleteApiResult.masterListsData[0].count;

                //To check wheter the second level data is less than 1000 then deduct the second level value from 1000
                this.remainedCountForSecondLevel = (((1000 - this.masterListsDataDetailsLengthLevelTwo) <= 0) ? 0 : (1000 - this.masterListsDataDetailsLengthLevelTwo));
                console.log("remainedCountForSecondLevel: ", this.remainedCountForSecondLevel);
              }

              if (this.thirdCompleteApiResult != undefined) {
                this.masterListsDataDetailsLengthLevelThree = this.thirdCompleteApiResult.masterListsData[0].count;

                //To check wheter the third level data is less than 1000 then deduct the second level value from 1000
                this.remainedCountForThirdLevel = (((1000 - this.masterListsDataDetailsLengthLevelThree) <= 0) ? 0 : (1000 - this.masterListsDataDetailsLengthLevelThree));
                console.log("remainedCountForThirdLevel: ", this.remainedCountForThirdLevel);
              }

              //First Degree Data
              this.filterParams = this.globalVariableService.getFilterParams({ "limitValue": (this.remainedCountForSecondLevel + this.remainedCountForThirdLevel) }); // second level varriable set the limit into first level
              console.log("new Filter Params level1: ", this.filterParams);
              const firstAPIs = this.nodeSelectsService.getMasterListsMapRevampLevelOne(this.filterParams);
              let combinedDataAPI;
              if (_filterParams.nnrt_id2 != undefined) {
                this.filterParams = this.globalVariableService.getFilterParams({ "limitValue": (this.remainedCountForFirstLevel + this.remainedCountForThirdLevel) }); // first level varriable set the limit into second level
                console.log("new Filter Params Level2: ", this.filterParams);

                const secondAPI = this.nodeSelectsService.getMasterListsMapRevampLevelTwo(this.filterParams);
                if (_filterParams.nnrt_id3 != undefined) {
                  this.filterParams = this.globalVariableService.getFilterParams({ "limitValue": (this.remainedCountForFirstLevel + this.remainedCountForSecondLevel) }); // first level varriable set the limit into second level
                  console.log("new Filter Params Level3: ", this.filterParams);
                  const thirdAPI = this.nodeSelectsService.getMasterListsMapRevampLevelThree(this.filterParams);
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
                    console.log("First Level Data: ", this.masterListsData);
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

                    this.masterListsDataDetailsLevelThree = [];
                    if (this.thirdLoadApiResult != undefined) {
                      //Third level data and Combined data first, second and third level
                      this.masterListsDataDetailsLevelThree = this.thirdLoadApiResult.masterListsData;
                      console.log("Third Level Data: ", this.masterListsDataDetailsLevelThree);
                      this.masterListsData = [].concat(firstLevelDataStore, secondLevelDataStore, this.masterListsDataDetailsLevelThree);
                    }
                    console.log("Combined Data Load: ", this.masterListsData);

                    //Start here to after combined to data get unique like before
                    this.nodeData = [];
                    this.sourcenodeData = [];
                    this.sourceId = [];
                    this.destinationnodeData = [];
                    this.edgeData = [];
                    this.groupedNodeType = [];
                    this.legendsNodeTypes = [];

                    // this.masterListsData = this.resultNodes.masterListsData;
                    // console.log("masterListsData: ", this.masterListsData);
                    console.log("masterListsDataLengtH: ", this.masterListsData.length);
                    this.chkSelectEntities = false;

                    if (this.masterListsData.length > 0) {
                      this.nodesCheckLength = false;                      
                    } else {
                      this.nodesCheckLength = true;
                    }

                    this.masterListsData.forEach((event: any) => {
                      //Source Node data
                      let levelSourceColor;
                      let levelTargetColor;
                      if (event.level == 1) {
                        levelSourceColor = '#BF63A2';
                        levelTargetColor = '#85C9E8';
                      } else if (event.level == 2) {
                        levelSourceColor = '#8ceb34';
                        levelTargetColor = '#e4cf15';
                      } else {
                        levelSourceColor = '#00FFFF';
                        levelTargetColor = '#f7786b';
                      }
                      this.sourcenodeData.push({
                        id: Math.floor(event.sourcenode), name: event.sourcenode_name, neIds: event.ne_ids, edgeTypeIds: event.edge_type_ids, colorNode: levelSourceColor, shapeType: 'round-hexagon', nodeType: 'source'
                      });

                      //Destination node data
                      this.destinationnodeData.push({
                        id: Math.floor(event.destinationnode), name: event.destinationnode_name, neIds: event.ne_ids, edgeTypeIds: event.edge_type_ids, colorNode: levelTargetColor, shapeType: 'sphere', nodeType: 'target'
                      });

                      this.legendsNodeTypes.push({ node_name: event.sourcenode, color_code: '#85C9E8' });

                      //Edge data
                      this.edgeData.push({
                        // data: { source: Math.floor(event.source_id), target: Math.floor(event.target_id), PMID: event.pmidlist, colorCode: "pink", strength: Math.floor(event.edge_weight) },
                        data: { source: Math.floor(event.sourcenode), target: Math.floor(event.destinationnode), neIds: event.ne_ids, edgeTypeIds: event.edge_type_ids, colorCode: "#00e600", strength: Math.floor(2) },
                      });
                    });
                    console.log("sourcenodeData: ", this.sourcenodeData);
                    console.log("destinationnodeData: ", this.destinationnodeData);

                    //Source id
                    const key = 'id';
                    const arrayUniqueBySourceId = [...new Map(this.sourcenodeData.map((item: any) =>
                      [item[key], item])).values()];
                    console.log("arrayUniqueBySourceId: ", arrayUniqueBySourceId);

                    //Destination id
                    const key2 = 'id';
                    const arrayUniqueByDestinationId = [...new Map(this.destinationnodeData.map((item: any) =>
                      [item[key2], item])).values()];
                    console.log("arrayUniqueByDestinationId: ", arrayUniqueByDestinationId);

                    this.results = [...arrayUniqueByDestinationId, ...arrayUniqueBySourceId];
                    console.log("new Results:::: ", this.results);

                    const key3 = 'id';
                    const arrayUniqueResultsData = [...new Map(this.results.map((item: any) =>
                      [item[key3], item])).values()];
                    console.log("arrayUniqueResultsData: ", arrayUniqueResultsData);

                    arrayUniqueResultsData.forEach((event: any) => {
                      //Node data
                      this.nodeData.push({
                        // data: { id: Math.floor(event.node_id), name: event.node, node_type: event.nodetype, weight: 100, colorCode: event.colourcode, shapeType: 'octagon' },
                        // data: { id: Math.floor(event.id), name: event.name.toLowerCase(), neIds: event.neIds, edgeTypeIds: event.edgeTypeIds, node_type: event.nodeType, weight: 100, colorCode: event.colorNode, shapeType: event.shapeType }
                        data: { id: Math.floor(event.id), name: event.name, neIds: event.neIds, edgeTypeIds: event.edgeTypeIds, node_type: event.nodeType, weight: 100, colorCode: event.colorNode, shapeType: event.shapeType, colorLabel: (this.isLightTheme==true?'#000':'#fff') }
                      });
                    });

                    console.log("nodeData: ", this.nodeData);
                    console.log("edgeData: ", this.edgeData);
                    // console.log("legendsNodeTypes:: ", this.legendsNodeTypes);

                    const x = this.legendsNodeTypes.reduce(
                      (accumulator: any, current: any) => accumulator.some((x: any) => x.node_name === current.node_name) ? accumulator : [...accumulator, current], []
                    )

                    this.legendsNodeTypes = x;
                    console.log("legendsNodeTypes: ", this.legendsNodeTypes);
                    this.drawChart();
                    //End here

                  },
                  err => {
                    this.loadingMap = false;
                    console.log(err.message);
                  },
                  () => {
                    this.loadingMap = false;
                  });
            });
        ////////////***********/ End To get the complete data for level 1 and level 2 ************ /////////////////////////
      }

      // this.nodeSelectsService.getMasterLists(_filterParams).subscribe(
      //   data => {
      //   },
      //   err => {
      //     this.loadingMap = false;
      //     console.log(err.message);
      //   },
      //   () => {
      //     this.loadingMap = false;
      //   }
      // );
    } else if (_filterParams.source_node != undefined) {
      console.log("go else: ");
      this.noDataFoundMap = true;
      this.noSourceNodeSelected = 0;
      this.nodeData = [];
      this.edgeData = [];
      this.drawChart();
    }else{
      this.noSourceNodeSelected = 1;
    }
  }

  private drawChart() {

    this.layout = {
      // name: 'grid',
      // animate: true,

      name: 'fcose',
      quality: "default",
      minNodeSpacing: 140,
      // Use random node positions at beginning of layout
      // if this is set to false, then quality option must be "proof"
      randomize: true,
      // Whether or not to animate the layout
      animate: true,
      // Duration of animation in ms, if enabled
      animationDuration: 1000,
      // Easing of animation, if enabled
      animationEasing: undefined,
      // Fit the viewport to the repositioned nodes
      fit: true,
      // Padding around layout
      padding: 50,
      // Whether to include labels in node dimensions. Valid in "proof" quality
      nodeDimensionsIncludeLabels: false,
      // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
      uniformNodeDimensions: false,
      // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
      packComponents: true,
      // Layout step - all, transformed, enforced, cose - for debug purpose only
      step: "all",

      /* spectral layout options */

      // False for random, true for greedy sampling
      samplingType: true,
      // Sample size to construct distance matrix
      sampleSize: 25,
      // Separation amount between nodes
      nodeSeparation: 25,
      // Power iteration tolerance
      piTol: 0.0000001,

      nodeSpacing: 120,
      spacingFactor: 4,
      /* incremental layout options */

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: 200,
      // Ideal edge (non nested) length
      idealEdgeLength: 7,
      // Divisor to compute edge forces
      edgeElasticity: 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 0.1,
      // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
      numIter: 2500,
      // For enabling tiling
      tile: true,
      // The comparison function to be used while sorting nodes during tiling operation.
      // Takes the ids of 2 nodes that will be compared as a parameter and the default tiling operation is performed when this option is not set.
      // It works similar to ``compareFunction`` parameter of ``Array.prototype.sort()``
      // If node1 is less then node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return a negative value
      // If node1 is greater then node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return a positive value
      // If node1 is equal to node2 by some ordering criterion ``tilingCompareBy(nodeId1, nodeId2)`` must return 0
      tilingCompareBy: undefined,
      // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingVertical: 10,
      // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity force (constant)
      gravity: 0.25,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout  
      initialEnergyOnIncremental: 0.3,

      /* constraint options */

      // Fix desired nodes to predefined positions
      // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
      fixedNodeConstraint: undefined,
      // Align desired nodes in vertical/horizontal direction
      // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
      alignmentConstraint: undefined,
      // Place two nodes relatively in vertical/horizontal direction
      // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
      relativePlacementConstraint: undefined,
      boundingBox: { x1: 100, y1: 200, w: 3000, h: 2000 },
    }

    this.graphData = {
      nodes:
        this.nodeData,
      edges:
        this.edgeData
    };

    console.log("graphdatas22: ", this.graphData);
  }

  nodeChange(event: any) {
    this.node_name = event;
    console.log("checked here!!", this.node_name);

    // this.showNodeInfo(event);

    // var node_name = event.target;
    // console.log("node_name: ", this.node_name);
    this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
  }

  edgeChange(event: any) {
    this.edge_name = event;

    this.modalRef = this.modalService.open(this.show_edges, { size: 'lg', keyboard: false, backdrop: 'static' });

    // var pubmedEdgeDetails;
    // pubmedEdgeDetails = "<div style='float:left;'>";
    // pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>SUID</strong></div>';
    // pubmedEdgeDetails += '<div style="padding-bottom:10px;">Name</div>';
    // pubmedEdgeDetails += "</div>";
    // $("#pubmedURLs").html(pubmedEdgeDetails);
    // $('#myModalEdge').modal('show');

  }

  clickedEdges(elem: any) { //when you select the indication from dropdown menu
    let edge_select = parseInt(elem.target.value);
    this.globalVariableService.setSelectedEdges(edge_select);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("Click Edges:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getMasterListsMap(this.filterParams, null);
    // this.onGraphSelection.emit();
  }

  refreshMap(elem: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("refresh Map:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getMasterListsMap(this.filterParams, null);
  }

  selectRank(elem: any, event: any) {
    console.log("elem: ", elem);

    if (event.target.checked) {
      this.selectedRankNodes.push(elem);
    } else {
      this.selectedRankNodes.splice(this.selectedRankNodes.indexOf(elem), 1);
    }
    console.log("selectedRankNodes: ", this.selectedRankNodes);

    this.globalVariableService.setSelectedRanks(this.selectedRankNodes);
    this.selectedRankNodes = Array.from(this.globalVariableService.getSelectedRanks());

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("Rank Map:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getMasterListsMap(this.filterParams, null);
  }

  searchConnections = function () {

    console.log("aaaa");
    alert("bbbbb");
    // Declare variables
    // var input, filter, ul, li, a, i, txtValue;
    // input = document.getElementById('searchInput');
    // filter = input.value.toUpperCase();
    // ul = document.getElementById("myUL");
    // li = ul.getElementsByTagName('li');

    // // Loop through all list items, and hide those who don't match the search query
    // for (i = 0; i < li.length; i++) {
    //   a = li[i].getElementsByTagName("a")[0];
    //   txtValue = a.textContent || a.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     li[i].style.display = "";
    //   } else {
    //     li[i].style.display = "none";
    //   }
    // }
  }

  onNetworkMapFullScrClick() {
    this.isNetworkMapFullScreen = !this.isNetworkMapFullScreen;
  }

  onDownloadCanvas() {
    let canvas = document.getElementsByTagName('canvas');
    // let ctx = canvas[2].getContext('2d');
    // ctx?.scale(3,3);
    let canvasUrl = canvas[2]?.toDataURL("image/jpeg", 6.0);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "network-map";
    createEl.click();
    createEl.remove();
  }

  // onThemeSwitchChange() {
  //   this.isLightTheme = !this.isLightTheme;
  //   this.globalVariableService.setSelectedThemes(this.isLightTheme);

  //   document.body.setAttribute(
  //     'data-theme',
  //     this.isLightTheme ? 'light' : 'dark'
  //   );

  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   console.log("refresh Map22:: ", this.filterParams);
  //   if (this.filterParams.nnrt_id != undefined)
  //     this.getMasterListsMap(this.filterParams, null);

  // }

}
