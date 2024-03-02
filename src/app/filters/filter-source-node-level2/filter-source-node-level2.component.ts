import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ChangeDetectorRef, Input, Pipe, PipeTransform, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter-source-node-level2',
  templateUrl: './filter-source-node-level2.component.html',
  styleUrls: ['./filter-source-node-level2.component.scss']
})
export class FilterSourceNodeLevel2Component implements OnInit {

  @Output() onSelectSourceNode2: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;
  private filterParams: any;
  public selectedSourceNodes2: any = [];
  public sourceNodes2: any = [];
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
  public groupedBySourceNode2: any = {};
  public finalGroupedBySourceNode2: any = {};
  public finalGroupedBySourceBeforeNode2: any = {};


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
      console.log("Source Level2: ", event.clickOn);
      if (event.clickOn == undefined) {
        // console.log("Source Level 2:1 ", event.clickOn);
        this.getResetSourceNode();
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'deleteLevel2')) {
        // this.hideCardBody = true;
        this.isAllSelected = false;
        this.disableProceed=true;
        this.filterParams = this.globalVariableService.getFilterParams();
        console.log("Source Level 2:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.getSourceNode2();
      }
    });
    this.getSourceNode2();
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
  }

  ngOnDestroy() {
    // if(this.UpdateFilterDataApply){
    //   this.UpdateFilterDataApply.unsubscribe();
    // }
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetSourceNode() {
    this.sourceNodes2 = [];
  }

  // getSourceNode22() {
  //   console.log("val: ", this.searchInput);

  //   // this.selectedSourceNodes = [];
  //   this.loading = true;
  //   this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
  //   console.log("filterparamsSearchSource: ", this.filterParams);

  //   this.selectedSourceNodes2 = [];
  //   if (this.filterParams.source_node != undefined) {
  //     this.loading = true;
  //     this.nodeSelectsService.getSourceNode2(this.filterParams)
  //       .subscribe(
  //         data => {
  //           this.result = data;
  //           this.sourceNodes2 = this.result.sourceNodeRecords2;

  //           // 1. get the json objects
  //           console.log("sourceNodes2: ", this.sourceNodes2);

  //           ///////////////////////////////////////////////////////
  //           // 2. Group by source_node name
  //           const groupedSourceNodes2 = this.sourceNodes2.reduce((accumulator: any, element: any, index: any) => {
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
  //           console.log("groupedSourceNodes2: ", groupedSourceNodes2);

  //           //////////////////////////////////////////////////////////////////////////
  //           // 3. Group according to source name name and get the new json objects
  //           this.groupedBySourceNode2 =
  //             Object.keys(groupedSourceNodes2).map(source_node_id => ({
  //               source_node: source_node_id,
  //               source_node_name: groupedSourceNodes2[source_node_id].source_node_name,
  //               subcategory_syn_node_name: groupedSourceNodes2[source_node_id].subCategories,
  //             }))
  //           console.log("groupedBySourceNode2: ", this.groupedBySourceNode2);

  //           ///////////////////////////////////////////////////////////////////////////////////////
  //           //4. Start sorting according to keyword search filter in autosugest json objects
  //           let searchField = "source_node_name";
  //           let results1 = []; let results2 = []; let results3 = [];
  //           this.finalGroupedBySourceBeforeNode2 = [];
  //           for (var i = 0; i < this.groupedBySourceNode2.length; i++) {
  //             if ((this.groupedBySourceNode2[i][searchField]).toLowerCase() == (this.searchInput).toLowerCase()) {// To check the node_name equality
  //               results1.push(this.groupedBySourceNode2[i]);
  //             }
  //             else {
  //               // console.log("subcatcount: ", this.groupedBySourceNode[i].subcategory_syn_node_name.length);
  //               for (var j = 0; j < this.groupedBySourceNode2[i].subcategory_syn_node_name.length; j++) {
  //                 if ((this.groupedBySourceNode2[i].subcategory_syn_node_name[j]).toLowerCase() == (this.searchInput).toLowerCase()) { // To check the syn_node_name equality
  //                   results2.push(this.groupedBySourceNode2[i]);
  //                 }
  //               }
  //               results3.push(this.groupedBySourceNode2[i]);
  //             }
  //           }
  //           this.finalGroupedBySourceBeforeNode2 = results1.concat(results2, results3);
  //           console.log("Final data: ", this.finalGroupedBySourceBeforeNode2);

  //           const key = 'source_node';
  //           this.finalGroupedBySourceNode2 = [...new Map(this.finalGroupedBySourceBeforeNode2.map((item: any) =>
  //             [item[key], item])).values()];
  //           console.log("Final unique data2: ", this.finalGroupedBySourceNode2);
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

  getSourceNode2() {
    this.globalVariableService.resetSourceNode2(); // reset the source node when source node component refresh
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedSourceNodes2 = []

    if (this.filterParams.source_node != undefined) {
      this.loading = true;
      this.nodeSelectsService.getSourceNode2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.sourceNodes2 = this.result.sourceNodeRecords2;
            console.log("sourceNodes2: ", this.sourceNodes2);
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
      this.sourceNodes2 = [];
      // this.globalVariableService.resetfilters();
    }
  }

  selectSourceNode(sourceNode: any, event: any, warning: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes2.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes2.splice(this.selectedSourceNodes2.indexOf(sourceNode.source_node), 1);
    }
    // console.log("selectedSourceNodes2: ", this.selectedSourceNodes2.length);

    // if (this.selectedSourceNodes2.length > 2) {
    //   console.log("when more then one Source is selected");
    //   this.warningModalRef = this.modalService.open(warning, { size: 'lg', keyboard: false, backdrop: 'static' });
    // } else if (warning != null && this.selectedSourceNodes2.length == 1) {
    // }
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters SOURCE2:: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    // if (from != 'nodeSelectsWarningModal')
    // this.proceed();
    this.enableDisableProceedButton();
  }

  selectAll() {
    console.log("is_all: ", this.isAllSelected);

    this.selectedSourceNodes2 = [];
    if (this.isAllSelected) {
      this.sourceNodes2.map((element: any) => {
        this.selectedSourceNodes2.push(element.source_node);
      });
    } else {
      this.selectedSourceNodes2 = [];
    }
    console.log("By selectedSourceNodes2: ", this.selectedSourceNodes2);

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
    this.selectedSourceNodes2 = [];
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.proceed();
  }

  seeMoreClosePopup() {
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
    this.warningModalRef.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectSourceNode2.emit(this.selectedSourceNodes2);
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes2.length < 1) {
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
