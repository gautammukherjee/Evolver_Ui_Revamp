import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-node-select-level2',
  templateUrl: './filter-node-select-level2.component.html',
  styleUrls: ['./filter-node-select-level2.component.scss']
})
export class FilterNodeSelectLevel2Component implements OnInit {

  @Output() onSelectNode2: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];
  // public alphabeticallyGroupedNodeSelects: any = '';
  public selectedNodeSelects2: any = [];
  public selectedNodeSelectsID: any;
  public node_selects2: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public firstTimeCheck: boolean = false;
  public nodeSelectsCheck: boolean = false;
  public enableFilter: boolean = false;;
  public filterText: string = '';
  public seeMoreFilterText: string = '';
  public filterPlaceholder: string = '';
  public seeMoreFilterPlaceholder: string = '';
  public filterInput = new FormControl();
  public seeMoreFilterInput = new FormControl();
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  private seeMoreNodeSelectsModal: any;
  mouseOverON: any = undefined;
  otherMouseOverONElem: any = undefined;
  public disableProceed = true;
  nodeSelectsFilter: string = '';
  nodeSelectsFilterText1: string = '';
  nodeSelectsFilterText2: string = '';
  //diseaseCheck: any;
  //diseaseCheckCT: any;
  hideCardBody: boolean = true;
  private filterParams: any;

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    //To filter the gene lists
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Nodes Filter..";

    //check the destination nodes are select or not
    this.filterParams = this.globalVariableService.getFilterParams();

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Nodes";
    //End here

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Node Level: ", event.clickOn);
      if (event.clickOn == undefined) {
        console.log("Click Node Level 2:1 ", event.clickOn);
        this.node_selects2 = [];
        // this.getNodeSelects(event);
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'deleteLevel2' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter')) {
        console.log("Click Node Level 2:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.globalVariableService.setSelectedNodeSelects2(undefined);
        this.getNodeSelects(event);
      }
    });
    this.getNodeSelects(event);
    // this.hideCardBody = true;

    // this.globalVariableService.setSelectedNodeSelects2(2);
    // this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    // console.log("sel_nodes2: ", this.selectedNodeSelects2);

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters node select2: ", this.filterParams);

  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getNodeSelects(event: any) {

    this.filterParams = this.globalVariableService.getFilterParams();
    // this.diseaseCheck = this.params['di_ids']; // if disease_id is checked
    // this.diseaseCheckCT = this.params['ct_di_ids']; // if disease_id is checked
    // console.log("checked here Gene: ", this.diseaseCheck);
    this.selectedNodeSelects2 = [];
    this.nodeSelectsFilterText2="";

    console.log("node_selects11111: ", this.filterParams);

    if (this.filterParams.source_node != undefined) {
      this.loading = true;
      // this.firstTimeCheck = true;
      this.nodeSelectsService.getNodeSelects2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.node_selects2 = this.result.nodeSelectsRecords;
            console.log("node_selects2: ", this.node_selects2);
            // this.nodeSelectsFilterText2 = this.node_selects2[2].pair_name;
            // console.log("nodeSelectsFilterText2: ", this.nodeSelectsFilterText2);

            // this.alphabeticallyGroupedNodeSelects = this.groupBy(this.node_selects2, 'pair_name');
            // console.log("alphabeticallyGroupedGenes: ", this.alphabeticallyGroupedGenes);

            //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
            // for (let i = 0; i < this.result.nodeSelectsRecords.length && i < 1; i++) {
            //   // this.selectedNodeSelects.push(this.result.nodeSelectsRecords[i].nnrt_id);
            //   this.selectedNodeSelects2 = this.result.nodeSelectsRecords[i].nnrt_id;
            //   //this.selectedNodeSelects2 = [];
            // }
            // console.log("selected Nodes: ", this.selectedNodeSelects2);
            // this.globalVariableService.setSelectedNodeSelects2(this.selectedNodeSelects2);
            //} else {
            //this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
            //}
          },
          err => {
            this.nodeSelectsCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            this.nodeSelectsCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );
    }
    else {
      this.node_selects2 = [];
      this.globalVariableService.resetfiltersForLevel2();
    }

  }

  selectNode2(nodeValue: any, pair_name:any) {
    this.nodeSelectsFilterText1='';
    // this.selectedNodeSelects2 = nodeValue;

    this.selectedNodeSelectsID = nodeValue;
    this.nodeSelectsFilterText2 = pair_name;
    
    this.globalVariableService.setSelectedNodeSelects2(this.selectedNodeSelectsID);
    this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters NODE SELECTS2:: ", this.filterParams);

    // this.globalVariableService.setSelectedNodeSelects2(this.selectedNodeSelects2);
    // this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    // console.log("node selects2 in : ", this.selectedNodeSelects2);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    // if (from != 'nodeSelectsWarningModal')
    this.proceed();
    // this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  // selectAll(event: any, geneWarningModal: any) {
  //   if (this.isAllSelected) {
  //     this.result.map((element: any) => {
  //       // console.log("element: ", element);
  //       this.selectedNodeSelects2.push(element.nnrt_id);
  //     })
  //   } else {
  //     this.selectedNodeSelects2 = [];
  //   }
  //   this.enableDisableProceedButton();
  // }

  resetNode() {
    this.selectedNodeSelects2 = [];
    this.globalVariableService.setSelectedNodeSelects2(undefined);
    this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    // this.proceed();
  }

  reloadNode() {
    // this.globalVariableService.resetChartFilter();
    // this.hideCardBody = !this.hideCardBody;
    // this.params = this.globalVariableService.getFilterParams();
    // if (!this.hideCardBody)
    this.getNodeSelects(event);
  }

  SeeMore(evt: any, seeMoreGeneModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreGeneModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedNodeSelects2(this.selectedNodeSelectsID);
    this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    console.log("yes here: ", this.selectedNodeSelects2);
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectNode2.emit(this.selectedNodeSelects2);
  }

  private enableDisableProceedButton() {
    if (this.selectedNodeSelects2.length < 1) {
      this.disableProceed = true;
    } else {
      this.disableProceed = false;
    }
  }

  private groupBy(collection: any, property: any) {   //collection:Array, property:String
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous: any, current: any) => {
      if (!previous[current[property].charAt(0)]) {
        previous[current[property].charAt(0)] = [current];
      } else {
        previous[current[property].charAt(0)].push(current);
      }

      return previous;
    }, {});
    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

}
