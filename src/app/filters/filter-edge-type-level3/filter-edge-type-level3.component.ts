import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-edge-type-level3',
  templateUrl: './filter-edge-type-level3.component.html',
  styleUrls: ['./filter-edge-type-level3.component.scss']
})
export class FilterEdgeTypeLevel3Component implements OnInit {

  @Output() onSelectEdgeType3: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public edgeTypesFirst3: any = [];
  public selectedEdgeTypes3: any = [];
  public selectedEdgeTypesByGroup3: any = [];
  public selectedEdgeTypesNames3: any = [];
  public edgeTypes3: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public firstTimeCheck: boolean = false;
  public edgeTypesCheck: boolean = false;
  public enableFilter: boolean = false;;
  public filterText: string = '';
  public seeMoreFilterText: string = '';
  public filterPlaceholder: string = '';
  public seeMoreFilterPlaceholder: string = '';
  public filterInput = new FormControl();
  public seeMoreFilterInput = new FormControl();
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  mouseOverON: any = undefined;
  otherMouseOverONElem: any = undefined;
  public disableProceed = true;
  edgeTypeFilter: string = '';
  edgeTypeFilterText: string = '';
  //diseaseCheck: any;
  //diseaseCheckCT: any;
  public destNodeCheck3: boolean = false;

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {
    this.nodeSelectsService.getEdgeTypeFirst()
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesFirst3 = this.result.edgeTypeFirstRecords;
          console.log("edge Types First3: ", this.edgeTypesFirst3);
        });
  }

  ngOnInit(): void {
    //To filter the gene lists
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Edge Type Filter..";

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Edge Type";
    //End here

    this.filterParams = this.globalVariableService.getFilterParams();

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Edge Level3: ", event.clickOn);
      if (event.clickOn == undefined) {
        // this.hideCardBody = true;
        this.selectedEdgeTypes3 = []; // Reinitialized, because when data updated on click TA, it should empty locally
        this.selectedEdgeTypesByGroup3 = [];
        this.selectedEdgeTypesNames3 = [];
        this.isAllSelected = false;
        this.getEdgeType3(event);
      }
      else if (event.clickOn !== undefined && (event.clickOn == 'deleteLevel3' || event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'edgeType2Filter' || event.clickOn == 'destinationNode2Filter' || event.clickOn == 'nodeLevel3Filter' || event.clickOn == 'sourceNode3Filter')) {
        console.log("Edge Level 3:2 ", event.clickOn);
        // this.hideCardBody = true;
        this.selectedEdgeTypes3 = [];
        this.globalVariableService.setSelectedEdgeTypes3(this.selectedEdgeTypes3);
        this.selectedEdgeTypesByGroup3 = [];
        this.selectedEdgeTypesNames3 = [];
        this.isAllSelected = false;
        this.disableProceed=true;
        this.getEdgeType3(event);
      }
    });
    this.getEdgeType3(event);
    this.selectedEdgeTypes3 = Array.from(this.globalVariableService.getSelectedEdgeTypes3());
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getEdgeType3(event: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedEdgeTypesNames3 = []
    this.selectedEdgeTypesByGroup3 = []

    // if (this.filterParams.source_node3 != undefined) {
    this.loading = true;
    // this.firstTimeCheck = true;
    this.nodeSelectsService.getEdgeType()
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypes3 = this.result.edgeTypeRecords;
          // console.log("edgeTypes3: ", this.edgeTypes3);

          // if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
          //   for (let i = 0; i < this.result.edgeTypeRecords.length && i < 1; i++) {
          //     // this.selectedEdgeTypes2.push(this.result.edgeTypeRecords[i].edge_type_id);
          //     this.selectedEdgeTypes2 = [];
          //   }
          //   console.log("selected Edge Types: ", this.selectedEdgeTypes2);
          //   // this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
          // } else {
          //   this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
          // }
        },
        err => {
          this.edgeTypesCheck = true;
          this.loading = false;
          console.log(err.message)
        },
        () => {
          this.edgeTypesCheck = true;
          this.loading = false;
          console.log("loading finish")
        }
      );
    // }
    // else {
    //   this.edgeTypes3 = [];
    //   this.globalVariableService.resetEdgeTypeNode3();
    // }
  }

  selectEdgeType(edgeType: any, event: any, from: any = null) {

    this.isAllSelected=false; //selectall checkbox is unchecked when click the checkbox lists
    if (event.target.checked) {
      this.selectedEdgeTypesByGroup3.push(edgeType.edge_group_id);
      this.selectedEdgeTypesNames3.push(edgeType.edge_group_name);
    } else {
      this.selectedEdgeTypesByGroup3.splice(this.selectedEdgeTypesByGroup3.indexOf(edgeType.edge_group_id), 1);
      this.selectedEdgeTypesNames3.splice(this.selectedEdgeTypesNames3.indexOf(edgeType.edge_group_name), 1);
    }
    // console.log("selectedEdgeTypesByGroup3: ", this.selectedEdgeTypesByGroup3);

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes3 = this.edgeTypesFirst3.filter((item: any) => (
      this.selectedEdgeTypesByGroup3.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types3", this.selectedEdgeTypes3);
    // console.log("selectedEdgeTypesName3: ", this.selectedEdgeTypesNames3);

    this.globalVariableService.setSelectedEdgeTypes3(this.selectedEdgeTypes3);
    this.selectedEdgeTypes3 = Array.from(this.globalVariableService.getSelectedEdgeTypes3());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters Edge Types3: ", this.filterParams);

    // if (from != 'edgeSelectsWarningModal')
    // this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll(event: any) {
    if (this.isAllSelected) {
      this.selectedEdgeTypesByGroup3 = [];
      this.result.edgeTypeRecords.map((element: any) => {
        this.selectedEdgeTypesByGroup3.push(element.edge_group_id);
        this.selectedEdgeTypesNames3.push(element.edge_group_name);
      })
    } else {
      this.selectedEdgeTypesByGroup3 = [];
      this.selectedEdgeTypesNames3 = [];
    }

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes3 = this.edgeTypesFirst3.filter((item: any) => (
      this.selectedEdgeTypesByGroup3.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types3", this.selectedEdgeTypes3);
    this.globalVariableService.setSelectedEdgeTypes3(this.selectedEdgeTypes3);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("select all edge types All3: ", this.filterParams);
    // this.proceed();
    this.enableDisableProceedButton();
  }

  resetEdgeType() {
    this.selectedEdgeTypes3 = [];
    this.globalVariableService.setSelectedEdgeTypes3(this.selectedEdgeTypes3);
    this.selectedEdgeTypesNames3 = [];
    this.selectedEdgeTypes3 = Array.from(this.globalVariableService.getSelectedEdgeTypes3());
    // console.log("selected Edge Type: ", this.selectedEdgeTypes3);
    // this.proceed();
  }

  // reloadEdgeType() {
  //   // this.globalVariableService.resetChartFilter();
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getEdgeType(this.params);
  // }

  closePopup() {
    this.selectedEdgeTypes3 = Array.from(this.globalVariableService.getSelectedEdgeTypes3());
    this.isAllSelected = false;
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedEdgeTypes3(this.selectedEdgeTypes3);
    this.selectedEdgeTypes3 = Array.from(this.globalVariableService.getSelectedEdgeTypes3());
    this.onSelectEdgeType3.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedEdgeTypes3.length < 1) {
      this.disableProceed = true;
    } else {
      this.disableProceed = false;
    }
  }

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

}
