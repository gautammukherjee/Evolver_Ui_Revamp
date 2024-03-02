import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-edge-type-level2',
  templateUrl: './filter-edge-type-level2.component.html',
  styleUrls: ['./filter-edge-type-level2.component.scss']
})
export class FilterEdgeTypeLevel2Component implements OnInit {

  @Output() onSelectEdgeType2: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public edgeTypesFirst2: any = [];
  public selectedEdgeTypes2: any = [];
  public selectedEdgeTypesByGroup2: any = [];
  public selectedEdgeTypesNames2: any = [];
  public edgeTypes2: any = [];
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
  public destNodeCheck2: boolean = false;

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
          this.edgeTypesFirst2 = this.result.edgeTypeFirstRecords;
          console.log("edge Types First2: ", this.edgeTypesFirst2);
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
      console.log("Edge Level2: ", event.clickOn);
      if (event.clickOn == undefined) {
        // this.hideCardBody = true;
        this.selectedEdgeTypes2 = []; // Reinitialized, because when data updated on click TA, it should empty locally
        this.selectedEdgeTypesByGroup2 = [];
        this.selectedEdgeTypesNames2 = [];
        this.isAllSelected = false;
        this.getEdgeType2(event);
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'deleteLevel2')) {
        console.log("Edge Level 2:2 ", event.clickOn);
        // this.hideCardBody = true;
        this.selectedEdgeTypes2 = [];
        this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
        this.selectedEdgeTypesByGroup2 = [];
        this.selectedEdgeTypesNames2 = [];
        this.isAllSelected = false;
        this.disableProceed=true;
        this.getEdgeType2(event);
      }
    });
    this.getEdgeType2(event);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getEdgeType2(event: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedEdgeTypesNames2 = []
    this.selectedEdgeTypesByGroup2 = []

    // if (this.filterParams.source_node2 != undefined) {
    this.loading = true;
    // this.firstTimeCheck = true;
    this.nodeSelectsService.getEdgeType()
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypes2 = this.result.edgeTypeRecords;
          // console.log("edgeTypes2: ", this.edgeTypes2);

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
    //   this.edgeTypes2 = [];
    //   this.globalVariableService.resetEdgeTypeNode2();
    // }
  }

  selectEdgeType(edgeType: any, event: any, from: any = null) {

    this.isAllSelected=false; //selectall checkbox is unchecked when click the checkbox lists
    if (event.target.checked) {
      this.selectedEdgeTypesByGroup2.push(edgeType.edge_group_id);
      this.selectedEdgeTypesNames2.push(edgeType.edge_group_name);
    } else {
      this.selectedEdgeTypesByGroup2.splice(this.selectedEdgeTypesByGroup2.indexOf(edgeType.edge_group_id), 1);
      this.selectedEdgeTypesNames2.splice(this.selectedEdgeTypesNames2.indexOf(edgeType.edge_group_name), 1);
    }
    // console.log("selectedEdgeTypesByGroup2: ", this.selectedEdgeTypesByGroup2);

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes2 = this.edgeTypesFirst2.filter((item: any) => (
      this.selectedEdgeTypesByGroup2.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types2", this.selectedEdgeTypes2);
    // console.log("selectedEdgeTypesName2: ", this.selectedEdgeTypesNames2);

    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters Edge Types2: ", this.filterParams);

    // if (from != 'edgeSelectsWarningModal')
    // this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll(event: any) {
    if (this.isAllSelected) {
      this.selectedEdgeTypesByGroup2 = [];
      this.result.edgeTypeRecords.map((element: any) => {
        this.selectedEdgeTypesByGroup2.push(element.edge_group_id);
        this.selectedEdgeTypesNames2.push(element.edge_group_name);
      })
    } else {
      this.selectedEdgeTypesByGroup2 = [];
      this.selectedEdgeTypesNames2 = [];
    }

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes2 = this.edgeTypesFirst2.filter((item: any) => (
      this.selectedEdgeTypesByGroup2.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types2", this.selectedEdgeTypes2);
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("select all edge types All2: ", this.filterParams);

    // this.proceed();
    this.enableDisableProceedButton();
  }

  resetEdgeType() {
    this.selectedEdgeTypes2 = [];
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypesNames2 = [];
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    // console.log("selected Edge Type: ", this.selectedEdgeTypes2);
    // this.proceed();
  }

  // reloadEdgeType() {
  //   // this.globalVariableService.resetChartFilter();
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getEdgeType(this.params);
  // }

  closePopup() {
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.isAllSelected = false;
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.onSelectEdgeType2.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedEdgeTypes2.length < 1) {
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
