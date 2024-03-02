import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-node-select-level3',
  templateUrl: './filter-node-select-level3.component.html',
  styleUrls: ['./filter-node-select-level3.component.scss']
})
export class FilterNodeSelectLevel3Component implements OnInit {

  @Output() onSelectNode3: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];
  // public alphabeticallyGroupedNodeSelects: any = '';
  public selectedNodeSelects3: any = [];
  public selectedNodeSelectsID: any;
  public node_selects3: any = [];
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
      console.log("Node Level3: ", event.clickOn);
      if (event.clickOn == undefined) {
        console.log("Click Node Level 3:1 ", event.clickOn);
        this.node_selects3 = [];
        // this.getNodeSelects(event);
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'deleteLevel3' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'edgeType2Filter' || event.clickOn == 'destinationNode2Filter')) {
        console.log("Click Node Level 3:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.globalVariableService.setSelectedNodeSelects3(undefined);
        this.getNodeSelects(event);
      }
    });
    this.getNodeSelects(event);
    // this.hideCardBody = true;

    // this.globalVariableService.setSelectedNodeSelects3(2);
    // this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    // console.log("sel_nodes2: ", this.selectedNodeSelects3);

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters node select3: ", this.filterParams);

  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getNodeSelects(event: any) {

    this.filterParams = this.globalVariableService.getFilterParams();
    // this.diseaseCheck = this.params['di_ids']; // if disease_id is checked
    // this.diseaseCheckCT = this.params['ct_di_ids']; // if disease_id is checked
    // console.log("checked here Gene: ", this.diseaseCheck);
    this.selectedNodeSelects3 = [];
    this.nodeSelectsFilterText2="";

    console.log("node_selects33333: ", this.filterParams);

    if (this.filterParams.source_node2 != undefined) {
      this.loading = true;
      // this.firstTimeCheck = true;
      this.nodeSelectsService.getNodeSelects3(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.node_selects3 = this.result.nodeSelectsRecords;
            console.log("node_selects3: ", this.node_selects3);

            // this.alphabeticallyGroupedNodeSelects = this.groupBy(this.node_selects3, 'pair_name');
            // console.log("alphabeticallyGroupedGenes: ", this.alphabeticallyGroupedGenes);

            //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
            // for (let i = 0; i < this.result.nodeSelectsRecords.length && i < 1; i++) {
            //   // this.selectedNodeSelects.push(this.result.nodeSelectsRecords[i].nnrt_id);
            //   this.selectedNodeSelects3 = this.result.nodeSelectsRecords[i].nnrt_id;
            //   //this.selectedNodeSelects3 = [];
            // }
            // console.log("selected Nodes: ", this.selectedNodeSelects3);
            // this.globalVariableService.setSelectedNodeSelects3(this.selectedNodeSelects3);
            //} else {
            //this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
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
      this.node_selects3 = [];
      this.globalVariableService.resetfiltersForLevel3();
    }

  }

  selectNode3(nodeValue: any, pair_name:any) {
    this.nodeSelectsFilterText1='';

    // this.selectedNodeSelects3 = nodeValue.target.value;
    this.selectedNodeSelectsID = nodeValue;
    this.nodeSelectsFilterText2 = pair_name;

    this.globalVariableService.setSelectedNodeSelects3(this.selectedNodeSelectsID);
    this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters NODE SELECTS3:: ", this.filterParams);

    // this.globalVariableService.setSelectedNodeSelects3(this.selectedNodeSelects3);
    // this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    console.log("node selects3 in : ", this.selectedNodeSelects3);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    // if (from != 'nodeSelectsWarningModal')
    this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  // selectAll(event: any, geneWarningModal: any) {
  //   if (this.isAllSelected) {
  //     this.result.map((element: any) => {
  //       // console.log("element: ", element);
  //       this.selectedNodeSelects3.push(element.nnrt_id);
  //     })
  //   } else {
  //     this.selectedNodeSelects3 = [];
  //   }
  //   this.enableDisableProceedButton();
  // }

  resetNode() {
    this.selectedNodeSelects3 = [];
    this.globalVariableService.setSelectedNodeSelects3(undefined);
    this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
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
    this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    // this.globalVariableService.setSelectedNodeSelects3(this.selectedNodeSelects3);
    this.globalVariableService.setSelectedNodeSelects3(this.selectedNodeSelectsID);
    this.selectedNodeSelects3 = Array.from(this.globalVariableService.getSelectedNodeSelects3());
    console.log("yes here: ", this.selectedNodeSelects3);
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectNode3.emit(this.selectedNodeSelects3);
  }

  private enableDisableProceedButton() {
    if (this.selectedNodeSelects3.length < 1) {
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
