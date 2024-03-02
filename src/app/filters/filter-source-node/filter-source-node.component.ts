import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ChangeDetectorRef, Input, Pipe, PipeTransform, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var jQuery: any;

@Component({
  selector: 'app-filter-source-node',
  templateUrl: './filter-source-node.component.html',
  styleUrls: ['./filter-source-node.component.scss']
})
export class FilterSourceNodeComponent implements OnInit {

  @Output() onSelectSourceNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;
  private filterParams: any;
  public selectedSourceNodes: any = [];
  public sourceNodes: any = [];
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
  public groupedBySourceNode: any = {};
  public finalGroupedBySourceNode: any = {};
  public finalGroupedBySourceBeforeNode: any = {};
  subSynNodeName: any = [];
  toggled: any = {};
  visible: boolean = false;

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
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // console.log("selectedSourceNodes: ", this.selectedSourceNodes);

    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters source node: ", this.filterParams);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("event Source:: ", event.clickOn);
      if (event.clickOn == undefined) {
        this.selectedSourceNodes = [];
        this.getResetSourceNode();
      }else{
        // this.disableProceed=true;
      }
    });
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetSourceNode() {
    this.sourceNodes = [];
    this.searchInput = '';
  }

  // debounce function makes sure that your code is only triggered once per user input
  debounce(func: any, timeout = 500) {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  getSourceNode() {
    console.log("val: ", this.searchInput);
    if (this.searchInput && this.searchInput.length > 2) {
      // this.selectedSourceNodes = [];
      this.loading = true;
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
      console.log("filterparamsSearchSource: ", this.filterParams);
      // this.params = this.globalVariableService.getFilterParams();
      this.nodeSelectsService.getSourceNode(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.sourceNodes = this.result.sourceNodeRecords;
            
            // 1. get the json objects
            console.log("sourceNodes: ", this.sourceNodes);

            ///////////////////////////////////////////////////////
            // 2. Group by source_node name
            const groupedSourceNodes = this.sourceNodes.reduce((accumulator: any, element: any, index: any) => {
              const source_node_id = element.source_node;
              const source_node_name = element.source_node_name;
              const subcategory_syn_node_name = element.syn_node_name;
              if (accumulator[source_node_id])
                return {
                  ...accumulator,
                  [source_node_id]: {
                    ...accumulator[source_node_id],
                    subCategories: [...accumulator[source_node_id].subCategories, subcategory_syn_node_name],
                  }
                };
              else
                return {
                  ...accumulator,
                  [source_node_id]: {
                    source_node_name: source_node_name,
                    subCategories: [subcategory_syn_node_name],
                  }
                };
            }, {});
            console.log("groupedSourceNodes: ", groupedSourceNodes);

            //////////////////////////////////////////////////////////////////////////
            // 3. Group according to source name name and get the new json objects
            this.groupedBySourceNode =
              Object.keys(groupedSourceNodes).map(source_node_id => ({
                source_node: source_node_id,
                source_node_name: groupedSourceNodes[source_node_id].source_node_name,
                subcategory_syn_node_name: groupedSourceNodes[source_node_id].subCategories,
              }))
            console.log("groupedBySourceNode: ", this.groupedBySourceNode);

            ///////////////////////////////////////////////////////////////////////////////////////
            //4. Start sorting according to keyword search filter in autosugest json objects
            let searchField = "source_node_name";
            let results1 = []; let results2 = []; let results3 = [];
            this.finalGroupedBySourceBeforeNode = [];
            for (var i = 0; i < this.groupedBySourceNode.length; i++) {
              if ((this.groupedBySourceNode[i][searchField]).toLowerCase() == (this.searchInput).toLowerCase()) {// To check the node_name equality
                results1.push(this.groupedBySourceNode[i]);
              }
              else {
                // console.log("subcatcount: ", this.groupedBySourceNode[i].subcategory_syn_node_name.length);
                for (var j = 0; j < this.groupedBySourceNode[i].subcategory_syn_node_name.length; j++) {
                  if ((this.groupedBySourceNode[i].subcategory_syn_node_name[j]).toLowerCase() == (this.searchInput).toLowerCase()) { // To check the syn_node_name equality
                    results2.push(this.groupedBySourceNode[i]);
                  }
                }
                results3.push(this.groupedBySourceNode[i]);
              }
            }
            this.finalGroupedBySourceBeforeNode = results1.concat(results2, results3);
            console.log("Final data: ", this.finalGroupedBySourceBeforeNode);

            const key = 'source_node';
            this.finalGroupedBySourceNode = [...new Map(this.finalGroupedBySourceBeforeNode.map((item: any) =>
              [item[key], item])).values()];
              console.log("Final unique data: ", this.finalGroupedBySourceNode);
            //End sorting according to filter in autosugest json objects
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
    }
  }

  processChange: any = this.debounce(() => this.getSourceNode());
  //End here for debounce and get the data search from database QUERY

  // expand() {
  //   var header = jQuery(this);
  //   //getting the next element
  //   var content = header.next();
  //   //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
  //   content.slideToggle(500, function () {
  //     //execute this after slideToggle is done
  //     //change text of header based on visibility of content div
  //     header.text(function () {
  //       //change text based on condition
  //       return content.is(":visible") ? "Collapse" : "Expand";
  //     });
  //   });
  // }

  public toggle(i: number): void {
    this.toggled[i] = !this.toggled[i];
  }

  public getClass(toggle: boolean): string {
    return toggle ? 'fa fa-plus red' : 'fa fa-minus someOtherClass';
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  selectSourceNode(sourceNode: any, event: any, warning: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes.splice(this.selectedSourceNodes.indexOf(sourceNode.source_node), 1);
    }
    // console.log("selectedSourceNodes: ", this.selectedSourceNodes.length);


    // if (this.selectedSourceNodes.length > 2) {
    //   console.log("when more then one Source is selected");
    //   this.warningModalRef = this.modalService.open(warning, { size: 'lg', keyboard: false, backdrop: 'static' });
    // } else if (warning != null && this.selectedSourceNodes.length == 1) {
    // }
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters SOURCE:: ", this.filterParams);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    // if (from != 'nodeSelectsWarningModal')
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
    this.selectedSourceNodes = [];
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.proceed();
  }

  seeMoreClosePopup() {
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
    this.warningModalRef.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();

    // setTimeout(() => {
    //   this.onSelectSourceNode.emit(this.selectedSourceNodes);
    // }, 3000);

    this.onSelectSourceNode.emit(this.selectedSourceNodes);
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes.length < 1) {
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
