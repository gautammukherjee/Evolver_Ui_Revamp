import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-node-select',
  templateUrl: './filter-node-select.component.html',
  styleUrls: ['./filter-node-select.component.scss']
})
export class FilterNodeSelectComponent implements OnInit {

  @Output() onSelectNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;
  // public alphabeticallyGroupedGenes = [];
  public alphabeticallyGroupedNodeSelects: any = '';
  public selectedNodeSelects: any = [];
  public selectedNodeSelectsID: any;
  public node_selects: any = [];
  private params: object = {};
  private result: any = [];
  private results2: any = [];
  public loading: boolean = false;
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

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Nodes";
    //End here

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("event node params here:: ", event.clickOn);
      if (event.clickOn == 'go_to_ct') {
        // this.selectedGenes = []; // Reinitialized, because when data updated on click TA, it should empty locally

        this.filterParams = this.globalVariableService.getFilterParams();
        // console.log("pair type chk in node-select:: ", this.filterParams['nnrtIdChk']);

        // if (this.filterParams['nnrtIdChk'] == false) {
          this.globalVariableService.setSelectedNodeSelects(5);
          this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
          console.log("sel_nodes in GO TO CT: ", this.selectedNodeSelects);
          this.filterParams = this.globalVariableService.getFilterParams();
          console.log("new Filters node select inside: ", this.filterParams);

          this.proceed();
        // }
        this.getNodeSelects(event, 2, 'ct_type');
        
      } else if (event.clickOn == 'revert_from_ct') {
        // this.selectedGenes = []; // Reinitialized, because when data updated on click TA, it should empty locally
        // if (this.filterParams['nnrtIdChk'] == false) {
          this.globalVariableService.setSelectedNodeSelects(44);
          this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
          console.log("sel_nodes revert from CT: ", this.selectedNodeSelects);
          this.filterParams = this.globalVariableService.getFilterParams();
          console.log("new Filters node select From CT: ", this.filterParams);

          this.proceed();
        // }
        this.getNodeSelects(event, 2, ''); // re-initialzed as usual
      }
    });

    this.globalVariableService.setSelectedNodeSelects(44);
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    console.log("sel_nodes by default: ", this.selectedNodeSelects);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters node select: ", this.filterParams);

    this.getNodeSelects(event, 1, '');
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getNodeSelects(event: any, type: any, ct_type: any) {
    this.loading = true;

    this.filterParams = this.globalVariableService.getFilterParams({ "ct_type": ct_type });
    console.log("chk all params: ", this.filterParams);
    this.params = this.globalVariableService.getFilterParams();

    // this.diseaseCheck = this.params['di_ids']; // if disease_id is checked
    // this.diseaseCheckCT = this.params['ct_di_ids']; // if disease_id is checked
    // console.log("checked here Gene: ", this.diseaseCheck);

    // this.selectedGenes = [];

    //if (this.diseaseCheck !== undefined || this.diseaseCheckCT !== undefined) {
    this.nodeSelectsService.getNodeSelects(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.node_selects = this.result.nodeSelectsRecords;
          this.nodeSelectsFilterText2 = this.node_selects[1].pair_name;
          console.log("node_selects: ", this.node_selects);
          console.log("nodeSelectsFilterText2: ", this.nodeSelectsFilterText2);

          // this.alphabeticallyGroupedNodeSelects = this.groupBy(this.node_selects, 'pair_name');
          // console.log("alphabeticallyGroupedGenes: ", this.alphabeticallyGroupedGenes);

          //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
          // for (let i = 0; i < this.result.nodeSelectsRecords.length && i < 1; i++) {
          //   // this.selectedNodeSelects.push(this.result.nodeSelectsRecords[i].nnrt_id);
          //   this.selectedNodeSelects = this.result.nodeSelectsRecords[i + 2].nnrt_id;
          //   //this.selectedGenes = [];
          // }
          // console.log("selected Nodes: ", this.selectedNodeSelects);
          // this.globalVariableService.setSelectedNodeSelects(this.selectedNodeSelects);
          //} else {
          //this.selectedGenes = Array.from(this.globalVariableService.getSelectedNodeSelects());
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
    // }
    // else {
    //   this.genes = [];
    //   this.loading = false;
    // }
  }

  selectNode(nodeValue: any, pair_name: any) {
    this.nodeSelectsFilterText1 = '';
    // console.log("nodeValue: ", nodeValue);

    this.globalVariableService.resetfilters();
    this.params = this.globalVariableService.getFilterParams();
    // console.log("params1: ", this.params);

    // if (event.target.checked) {
    //   this.selectedNodeSelects.push(node.nnrt_id);
    // } else {
    //   this.selectedNodeSelects.splice(this.selectedNodeSelects.indexOf(node.nnrt_id), 1);
    // }

    // this.selectedNodeSelectsID = nodeValue.target.value;
    this.selectedNodeSelectsID = nodeValue;
    this.nodeSelectsFilterText2 = pair_name;

    this.globalVariableService.setSelectedNodeSelects(this.selectedNodeSelectsID);
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters NODE SELECTS1:: ", this.filterParams);

    // for (let i = 0; i < this.result.nodeSelectsRecords.length && i < 1; i++) {
    //   // this.selectedNodeSelects.push(this.result.nodeSelectsRecords[i].nnrt_id);
    //   this.selectedNodeSelects = this.result.nodeSelectsRecords[i + 5].nnrt_id;
    //   //this.selectedGenes = [];
    // }
    // console.log("selectedNodeSelects: ", this.selectedNodeSelects);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    // if (from != 'nodeSelectsWarningModal')
    this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetNode() {
    this.selectedNodeSelects = [];
    this.globalVariableService.setSelectedNodeSelects(undefined);
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    // this.proceed();
  }

  SeeMore(evt: any, seeMoreGeneModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreGeneModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    // this.globalVariableService.setSelectedNodeSelects(this.selectedNodeSelects);
    // this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());

    // this.globalVariableService.setSelectedNodeSelects(this.selectedNodeSelects);
    // this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters NODE SELECTS:: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedNodeSelects.length < 1) {
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
