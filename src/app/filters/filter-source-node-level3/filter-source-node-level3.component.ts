import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ChangeDetectorRef, Input, Pipe, PipeTransform, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter-source-node-level3',
  templateUrl: './filter-source-node-level3.component.html',
  styleUrls: ['./filter-source-node-level3.component.scss']
})
export class FilterSourceNodeLevel3Component implements OnInit {

  @Output() onSelectSourceNode3: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;
  private filterParams: any;
  public selectedSourceNodes3: any = [];
  public sourceNodes3: any = [];
  // public sourceNodes: Array<object> = [];
  // private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public enableFilter: boolean = false;;
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  private seeMoreNodeSelectsModal: any;
  public disableProceed = true;
  // showSourceBody: boolean = false;
  private warningModalRef: any;
  searchInput: any = null;
  sourceNodeFilter: string = '';
  public groupedBySourceNode3: any = {};
  public finalGroupedBySourceNode3: any = {};
  public finalGroupedBySourceBeforeNode3: any = {};


  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
    })
  }

  ngOnInit(): void {
    // this.globalVariableService.setSelectedSourceNodes([10810]);
    // this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // console.log("selectedSourceNodes: ", this.selectedSourceNodes);

    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters source node: ", this.filterParams);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Source Level3: ", event.clickOn);
      if (event.clickOn == undefined) {
        // console.log("Source Level 3:1 ", event.clickOn);
        this.getResetSourceNode();
      }
      else if (event.clickOn !== undefined && (event.clickOn == 'deleteLevel3' || event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'edgeType2Filter' || event.clickOn == 'destinationNode2Filter' || event.clickOn == 'nodeLevel3Filter')) {
        // this.hideCardBody = true;
        this.isAllSelected = false;
        this.disableProceed=true;
        this.filterParams = this.globalVariableService.getFilterParams();
        console.log("Source Level 3:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.getSourceNode3();
      }
    });
    this.getSourceNode3();
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetSourceNode() {
    this.sourceNodes3 = [];
  }

  // getSourceNode33() {
  //   console.log("val: ", this.searchInput);

  //   // this.selectedSourceNodes = [];
  //   this.loading = true;
  //   this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
  //   console.log("filterparamsSearchSource: ", this.filterParams);

  //   this.selectedSourceNodes3 = [];
  //   if (this.filterParams.source_node != undefined) {
  //     this.loading = true;
  //     this.nodeSelectsService.getSourceNode3(this.filterParams)
  //       .subscribe(
  //         data => {
  //           this.result = data;
  //           this.sourceNodes3 = this.result.sourceNodeRecords3;

  //           // 1. get the json objects
  //           console.log("sourceNodes3: ", this.sourceNodes3);

  //           ///////////////////////////////////////////////////////
  //           // 2. Group by source_node name
  //           const groupedSourceNodes3 = this.sourceNodes3.reduce((accumulator: any, element: any, index: any) => {
  //             const source_node_id = element.source_node;
  //             const source_node_name = element.source_node_name;
  //             const subcategory_syn_node_name = element.syn_node_name;
  //             if (accumulator[source_node_id])
  //               return {
  //                 ...accumulator,
  //                 [source_node_id]: {
  //                   ...accumulator[source_node_id],
  //                   subCategories: [...accumulator[source_node_id].subCategories, subcategory_syn_node_name],
  //                 }
  //               };
  //             else
  //               return {
  //                 ...accumulator,
  //                 [source_node_id]: {
  //                   source_node_name: source_node_name,
  //                   subCategories: [subcategory_syn_node_name],
  //                 }
  //               };
  //           }, {});
  //           console.log("groupedSourceNodes3: ", groupedSourceNodes3);

  //           //////////////////////////////////////////////////////////////////////////
  //           // 3. Group according to source name name and get the new json objects
  //           this.groupedBySourceNode3 =
  //             Object.keys(groupedSourceNodes3).map(source_node_id => ({
  //               source_node: source_node_id,
  //               source_node_name: groupedSourceNodes3[source_node_id].source_node_name,
  //               subcategory_syn_node_name: groupedSourceNodes3[source_node_id].subCategories,
  //             }))
  //           console.log("groupedBySourceNode3: ", this.groupedBySourceNode3);

  //           ///////////////////////////////////////////////////////////////////////////////////////
  //           //4. Start sorting according to keyword search filter in autosugest json objects
  //           let searchField = "source_node_name";
  //           let results1 = []; let results2 = []; let results3 = [];
  //           this.finalGroupedBySourceBeforeNode3 = [];
  //           for (var i = 0; i < this.groupedBySourceNode3.length; i++) {
  //             if ((this.groupedBySourceNode3[i][searchField]).toLowerCase() == (this.searchInput).toLowerCase()) {// To check the node_name equality
  //               results1.push(this.groupedBySourceNode3[i]);
  //             }
  //             else {
  //               // console.log("subcatcount: ", this.groupedBySourceNode[i].subcategory_syn_node_name.length);
  //               for (var j = 0; j < this.groupedBySourceNode3[i].subcategory_syn_node_name.length; j++) {
  //                 if ((this.groupedBySourceNode3[i].subcategory_syn_node_name[j]).toLowerCase() == (this.searchInput).toLowerCase()) { // To check the syn_node_name equality
  //                   results2.push(this.groupedBySourceNode3[i]);
  //                 }
  //               }
  //               results3.push(this.groupedBySourceNode3[i]);
  //             }
  //           }
  //           this.finalGroupedBySourceBeforeNode3 = results1.concat(results2, results3);
  //           console.log("Final data: ", this.finalGroupedBySourceBeforeNode3);

  //           const key = 'source_node';
  //           this.finalGroupedBySourceNode3 = [...new Map(this.finalGroupedBySourceBeforeNode3.map((item: any) =>
  //             [item[key], item])).values()];
  //           console.log("Final unique data3: ", this.finalGroupedBySourceNode3);
  //           //End sorting according to filter in autosugest json objects
  //         },
  //         err => {
  //           this.loading = false;
  //           console.log(err.message)
  //         },
  //         () => {
  //           this.loading = false;
  //           console.log("loading finish")
  //         }
  //       );
  //   }

  // }

  getSourceNode3() {
    this.globalVariableService.resetSourceNode3(); // reset the source node when source node component refresh
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedSourceNodes3 = []

    if (this.filterParams.source_node2 != undefined) {
      this.loading = true;
      this.nodeSelectsService.getSourceNode3(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.sourceNodes3 = this.result.sourceNodeRecords3;
            console.log("sourceNodes3: ", this.sourceNodes3);
          },
          err => {
            this.loading = false;
            console.log(err.message)
          },
          () => {
            this.loading = false;
            console.log("loading finish")
          }
        );
    } else {
      this.sourceNodes3 = [];
      // this.globalVariableService.resetfilters();
    }
  }

  selectSourceNode(sourceNode: any, event: any, warning: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes3.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes3.splice(this.selectedSourceNodes3.indexOf(sourceNode.source_node), 1);
    }
    // console.log("selectedSourceNodes3: ", this.selectedSourceNodes3.length);

    // if (this.selectedSourceNodes3.length > 2) {
    //   console.log("when more then one Source is selected");
    //   this.warningModalRef = this.modalService.open(warning, { size: 'lg', keyboard: false, backdrop: 'static' });
    // } else if (warning != null && this.selectedSourceNodes3.length == 1) {
    // }
    this.globalVariableService.setSelectedSourceNodes3(this.selectedSourceNodes3);
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters SOURCE3:: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    // if (from != 'nodeSelectsWarningModal')
    // this.proceed();
    this.enableDisableProceedButton();
  }

  selectAll() {
    console.log("is_all: ", this.isAllSelected);

    this.selectedSourceNodes3 = [];
    if (this.isAllSelected) {
      this.sourceNodes3.map((element: any) => {
        this.selectedSourceNodes3.push(element.source_node);
      });
    } else {
      this.selectedSourceNodes3 = [];
    }
    console.log("By selectedSourceNodes3: ", this.selectedSourceNodes3);

    // this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetSourceNode() {
    this.searchInput = '';
    this.disableProceed = true;
    // console.log("event: ", event);
    // this.globalVariableService.resetfilters();
    this.selectedSourceNodes3 = [];
    this.globalVariableService.setSelectedSourceNodes3(this.selectedSourceNodes3);
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
    this.proceed();
  }

  seeMoreClosePopup() {
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
    this.warningModalRef.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedSourceNodes3(this.selectedSourceNodes3);
    this.selectedSourceNodes3 = Array.from(this.globalVariableService.getSelectedSourceNodes3());
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectSourceNode3.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes3.length < 1) {
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

  // onSourceHeaderClick() {
  //   this.showSourceBody = !this.showSourceBody;
  // }

}
