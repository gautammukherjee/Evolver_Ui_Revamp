import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-edge-type',
  templateUrl: './filter-edge-type.component.html',
  styleUrls: ['./filter-edge-type.component.scss']
})
export class FilterEdgeTypeComponent implements OnInit {

  @Output() onSelectEdgeType: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedEdgeTypes: any = [];
  public selectedEdgeTypesByGroup: any = [];
  public selectedEdgeTypesNames: any = [];

  public selectedSourceNodes: any = [];
  public selectedDestinationNodes: any = [];

  public edgeTypesFirst: any = [];
  public edgeTypes: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
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
  hideCardBody: boolean = true;
  showEdgeBody: boolean = false;
  edgeTypesNames: any = [];
  edgeTypeNameStores: any = [];
  datas: any = '';

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
    this.filterPlaceholder = "Edge Type Filter..";

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Edge Type";
    //End here

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);

    this.nodeSelectsService.getEdgeTypeFirst().subscribe(
      (data: any) => {
        this.result = data;
        this.edgeTypesFirst = this.result.edgeTypeFirstRecords;
        console.log("edge Types First: ", this.edgeTypesFirst);
      });

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("eventEdgeType1:: ", event);
      if (event.clickOn == undefined) {
        // this.hideCardBody = true;
        this.selectedEdgeTypes = []; // Reinitialized, because when data updated on click TA, it should empty locally
        this.selectedEdgeTypesByGroup = [];
        this.selectedEdgeTypesNames = [];
        this.isAllSelected = false;
        this.getEdgeType(event, 2);
      } else if (event.clickOn !== undefined && event.clickOn == 'sourceNodeFilter') {
        console.log("eventEdgeType2:: ", event.clickOn);
        // this.hideCardBody = true;
        this.selectedEdgeTypes = [];
        this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
        this.selectedEdgeTypesByGroup = [];
        this.selectedEdgeTypesNames = [];
        this.isAllSelected = false;
        this.disableProceed=true;
        this.getEdgeType(event, 2);
      }
    });
    this.getEdgeType(event, 1);
    // this.hideCardBody = true;

    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  getCriteria(key: any, data: any) {
    if (!data?.length) return [null]
    return data.map((item: any) => ({ criteria: item[key] || null }));
  }

  findValue(arr: any, key: any) {
    return arr.find(
      function (o: any) {
        console.log("o: ", o.edge_group_id);
        console.log("k: ", key[0]);

        return o.edge_group_id === key[0]
      }
    ).edge_type_id;
  }

  public getEdgeType(event: any, type: any) {
    this.loading = true;
    this.params = this.globalVariableService.getFilterParams();

    // this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());

    // this.enableDisableProceedButton();
    this.nodeSelectsService.getEdgeType()
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.edgeTypes = this.result.edgeTypeRecords;
          console.log("edge Types Group: ", this.edgeTypes);

          // var dataCollect = this.groupBy(this.edgeTypes, 'edge_group_id');
          // console.log("edge Types Group2: ", dataCollect);

          // if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
          //   for (let i = 0; i < this.result.edgeTypeRecords.length && i < 1; i++) {
          //     // this.selectedEdgeTypes.push(this.result.edgeTypeRecords[i].edge_type_id);
          //     this.selectedEdgeTypes = [];
          //   }
          //   console.log("selected Edge Types: ", this.selectedEdgeTypes);
          //   // this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
          // } else {
          //   this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
          // }
        },
        err => {
          // this.edgeTypesCheck = true;
          this.loading = false;
          console.log(err.message)
        },
        () => {
          // this.edgeTypesCheck = true;
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

  selectEdgeType(edgeType: any, event: any, from: any = null) {
    
    this.isAllSelected=false; //selectall checkbox is unchecked when click the checkbox lists
    if (event.target.checked) {
      this.selectedEdgeTypesByGroup.push(edgeType.edge_group_id);
      this.selectedEdgeTypesNames.push(edgeType.edge_group_name);
    } else {
      this.selectedEdgeTypesByGroup.splice(this.selectedEdgeTypesByGroup.indexOf(edgeType.edge_group_id), 1);
      this.selectedEdgeTypesNames.splice(this.selectedEdgeTypesNames.indexOf(edgeType.edge_group_name), 1);
    }
    console.log("selectedEdgeTypesByGroup: ", this.selectedEdgeTypesByGroup);

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes = this.edgeTypesFirst.filter((item: any) => (
      this.selectedEdgeTypesByGroup.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types1", this.selectedEdgeTypes);
    // console.log("selectedEdgeTypesName: ", this.selectedEdgeTypesNames);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters Edge Types: ", this.filterParams);

    // if (from != 'edgeSelectsWarningModal')
    // if (this.selectedEdgeTypesByGroup.length != 0)
      // this.proceed();
      this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll() {
    // console.log("is_all: ", this.isAllSelected);
    if (this.isAllSelected) {
      console.log("in1: ", this.result.edgeTypeRecords);
      console.log("in2: ", this.edgeTypes);

      this.selectedEdgeTypesByGroup = [];
      // this.result.edgeTypeRecords.map((element: any) => {
      this.edgeTypes.map((element: any) => {
        this.selectedEdgeTypesByGroup.push(element.edge_group_id);
        this.selectedEdgeTypesNames.push(element.edge_group_name);
      })
    } else {
      this.selectedEdgeTypesNames = [];
      this.selectedEdgeTypesByGroup = [];
    }
    console.log("By Group: ", this.selectedEdgeTypesByGroup);

    // Pass edge group id and return edge_type_id to mapping with edge and edge group
    this.selectedEdgeTypes = this.edgeTypesFirst.filter((item: any) => (
      this.selectedEdgeTypesByGroup.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types2", this.selectedEdgeTypes);
    this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("select all edge types All: ", this.filterParams);

    // this.proceed();
    this.enableDisableProceedButton();
  }

  resetEdgeType() {
    this.selectedEdgeTypes = [];
    this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    this.selectedEdgeTypesNames = [];
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    console.log("selected Edge Type: ", this.selectedEdgeTypes);
    // this.proceed();
  }

  resetAllFilters() {
    this.globalVariableService.resetfilters();// On click TA other filter's data will update, so've to reset filter selected data   
    window.location.reload();
    // this.proceed();
  }

  // reloadEdgeType() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getEdgeType(this.params);
  // }

  closePopup() {
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    this.isAllSelected = false;
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    // this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    // this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    this.onSelectEdgeType.emit();
  }

  private enableDisableProceedButton() {
    // if (this.selectedSourceNodes.length > 0 && (this.selectedDestinationNodes.length > 0 || this.selectedEdgeTypes.length > 0)) {
    if (this.selectedEdgeTypes.length > 0) {
      this.disableProceed = false;
    } else {
      this.disableProceed = true;
    }
  }

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

  onEdgeHeaderClick() {
    this.showEdgeBody = !this.showEdgeBody;
  }

}
