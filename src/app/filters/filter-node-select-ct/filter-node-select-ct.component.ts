import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-node-select-ct',
  templateUrl: './filter-node-select-ct.component.html',
  styleUrls: ['./filter-node-select-ct.component.scss']
})
export class FilterNodeSelectCTComponent implements OnInit {

  @Output() onSelectNode: EventEmitter<any> = new EventEmitter();
  // @Input() UpdateFilterDataApply?: Subject<any>;
  // public alphabeticallyGroupedGenes = [];
  public alphabeticallyGroupedNodeSelects: any = '';
  public selectedNodeSelects: any = [];
  public selectedNodeSelectsID: any;
  public node_selects_ct: any = [];
  private params: object = {};
  private result: any = [];
  private results2: any = [];
  public loadingCT: boolean = false;
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
  public selectedPairTypeArray: any = [];

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


    // this.hideCardBody = true;

    this.selectedPairTypeArray = [26, 29, 36, 37, 38, 39, 40];

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("selected pair type ac: ", this.filterParams['nnrt_id']);
    let chkNNRTID = this.selectedPairTypeArray.includes(this.filterParams['nnrt_id']);
    console.log("chkNNRTID: ", chkNNRTID);

    if (chkNNRTID == false){
      this.globalVariableService.setSelectedNNRTID(false);
      this.globalVariableService.getSelectedNNRTID();
      this.filterParams = this.globalVariableService.getFilterParams();
      console.log("pair type chk:: ", this.filterParams);

      this.globalVariableService.resetfilters();
    }

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters node select: ", this.filterParams);

    this.globalVariableService.setSelectedNodeSelects(26);
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    console.log("sel_nodes_CT: ", this.selectedNodeSelects);
    
    this.getNodeSelects(event, 1);

  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getNodeSelects(event: any, type: any) {
    this.loadingCT = true;
    this.params = this.globalVariableService.getFilterParams();
    this.filterParams = this.globalVariableService.getFilterParams();
    // this.diseaseCheck = this.params['di_ids']; // if disease_id is checked
    // this.diseaseCheckCT = this.params['ct_di_ids']; // if disease_id is checked
    // console.log("checked here Gene: ", this.diseaseCheck);

    // this.selectedGenes = [];

    //if (this.diseaseCheck !== undefined || this.diseaseCheckCT !== undefined) {
    this.nodeSelectsService.getNodeSelectsCT(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.node_selects_ct = this.result.nodeSelectsRecordsCT;
          this.nodeSelectsFilterText2 = this.node_selects_ct[1].pair_name;
          console.log("node_selects_ct: ", this.node_selects_ct);
          console.log("nodeSelectsFilterText2: ", this.nodeSelectsFilterText2);
        },
        err => {
          this.nodeSelectsCheck = true;
          this.loadingCT = false;
          console.log(err.message)
        },
        () => {
          this.nodeSelectsCheck = true;
          this.loadingCT = false;
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

    // this.selectedNodeSelectsID = nodeValue.target.value;
    this.selectedNodeSelectsID = nodeValue;
    this.nodeSelectsFilterText2 = pair_name;

    this.globalVariableService.setSelectedNodeSelects(this.selectedNodeSelectsID);
    this.selectedNodeSelects = Array.from(this.globalVariableService.getSelectedNodeSelects());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters NODE SELECTS1:: ", this.filterParams);

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
