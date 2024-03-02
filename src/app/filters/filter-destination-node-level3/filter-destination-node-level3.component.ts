import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-destination-node-level3',
  templateUrl: './filter-destination-node-level3.component.html',
  styleUrls: ['./filter-destination-node-level3.component.scss']
})
export class FilterDestinationNodeLevel3Component implements OnInit {

  @Output() onSelectDestinationNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedDestinationNodes3: any = [];
  public destinationNodes3: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public destinationNodesCheck: boolean = false;
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
  public disableProceed: boolean = true;
  searchInput3: any = null;
  public dbLoading3: boolean = false;
  public destinationNodesDB3: any = [];
  public destinationNodesLength3: any = [];
  // public showDestinationBody: boolean = true;

  public groupedByDestinationNode3: any = {};
  public finalGroupedByDestinationBeforeNode3: any = {};
  distinctDestinationNodesData3: any = [];
  public selectedAllForCTDestinationNodes3: any = [];
  public selectedAllDestinationNodes3: any = [];

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {
  }

  // debounce function makes sure that your code is only triggered once per user input
  debounce(func: any, timeout = 1000) {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  ngOnInit(): void {
    // this.filterParams = this.globalVariableService.getFilterParams();
    // this.getDestinationNode2(event, 1);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Destination level3:1 ", event.clickOn);
      if (event.clickOn == undefined) {
        this.getResetDestinationNode();
      } else if (event.clickOn !== undefined && (event.clickOn == 'deleteLevel3' || event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'edgeType2Filter' || event.clickOn == 'destinationNode2Filter' || event.clickOn == 'nodeLevel3Filter' || event.clickOn == 'sourceNode3Filter' || event.clickOn == 'edgeType3Filter')) {
        console.log("destination Level3:2 ", event.clickOn);
        // this.getResetDestinationNode();
        this.getDestinationNode3();

        this.searchInput3 = '';
        // this.selectedDestinationNodes3 = [];
        // this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes3);
        // this.destinationNodesDB3 = [];
        this.getDestinationNode3OnChange();
      }
    });
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetDestinationNode() {
    this.destinationNodes3 = [];
    this.destinationNodesDB3 = [];
    this.selectedDestinationNodes3 = [];
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes3);
    this.globalVariableService.resetDestinationNode3();
    this.searchInput3 = '';
    this.destinationNodesLength3 = [];
    this.distinctDestinationNodesData3 = [];
  }

  getDestinationNode3() {
    // this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    this.filterParams = this.globalVariableService.getFilterParams();
    // this.selectedDestinationNodes = []
    this.destinationNodesLength3 = [];
    this.distinctDestinationNodesData3 = [];
    // this.currentPage = 1;
    if (this.filterParams.source_node3 != undefined) {
      this.loading = true;

      this.nodeSelectsService.getDestinationNode3(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.destinationNodesLength3 = this.result.destinationNodeRecords3.length;
            console.log("destinationNodes Length3: ", this.destinationNodesLength3);

            //Start here for clinical trials destination nodes unique data
            let destinationID: any = [];
            this.result.destinationNodeRecords3.forEach((event: any) => {
              destinationID.push(event.destination_node);
            });
            console.log("destinationID: ", destinationID);
            this.distinctDestinationNodesData3 = [...new Set(destinationID.map((x: any) => x))];
            console.log("destinationNodes res: ", this.distinctDestinationNodesData3);

            this.globalVariableService.setSelectedAllForCTDestinationNodes3(this.distinctDestinationNodesData3);
            this.selectedAllForCTDestinationNodes3 = Array.from(this.globalVariableService.getSelectedAllForCTDestinationNodes3());
            this.filterParams = this.globalVariableService.getFilterParams();
            console.log("new new Filters all select DESTINATION3: ", this.filterParams);
            //End here for clinical trials destination nodes unique data
          },
          err => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );

    } else {
      console.log("no checked data");
      this.destinationNodes3 = [];
      this.destinationNodesLength3 = [];
      this.distinctDestinationNodesData3 = [];
      this.globalVariableService.resetDestinationNode3();
      // this.globalVariableService.resetEdgeTypeNode3();
    }
  }

  getDestinationNode3OnChange() {
    // this.selectedDestinationNodes = []
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("filter params: ", this.filterParams);
    // this.destinationNodesDB=[];
    if (this.searchInput3 && this.searchInput3.length > 2 && this.filterParams.source_node3 != undefined) {
      console.log("this all desti3: ", this.selectedDestinationNodes3)
      this.dbLoading3 = true;
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput3 });
      // console.log("filterparamsSearchSource: ", this.filterParams);
      this.nodeSelectsService.getDestinationNode3(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.destinationNodesDB3 = this.result.destinationNodeRecords3;
            console.log("destinationNodesKeyup3: ", this.destinationNodesDB3);

            ///////////////////////////////////////////////////////
            // 2. Group by destination_node name
            const groupedDestinationNodes = this.destinationNodesDB3.reduce((accumulator: any, element: any, index: any) => {
              const destination_node_id = element.destination_node;
              const destination_node_name = element.destination_node_name;
              const subcategory_syn_node_name = element.syn_node_name;
              if (accumulator[destination_node_id])
                return {
                  ...accumulator,
                  [destination_node_id]: {
                    ...accumulator[destination_node_id],
                    subCategories: [...accumulator[destination_node_id].subCategories, subcategory_syn_node_name],
                  }
                };
              else
                return {
                  ...accumulator,
                  [destination_node_id]: {
                    destination_node_name: destination_node_name,
                    subCategories: [subcategory_syn_node_name],
                  }
                };
            }, {});
            console.log("groupedDestinationNodes3: ", groupedDestinationNodes);

            //////////////////////////////////////////////////////////////////////////
            // 3. Group according to destination name name and get the new json objects
            this.groupedByDestinationNode3 =
              Object.keys(groupedDestinationNodes).map(destination_node_id => ({
                destination_node: destination_node_id,
                destination_node_name: groupedDestinationNodes[destination_node_id].destination_node_name,
                subcategory_syn_node_name: groupedDestinationNodes[destination_node_id].subCategories,
              }))
            console.log("groupedByDestinationNode3: ", this.groupedByDestinationNode3);

            ///////////////////////////////////////////////////////////////////////////////////////
            //4. Start sorting according to keyword search filter in autosugest json objects
            let searchField = "destination_node_name";
            let results1 = []; let results2 = []; let results3 = [];
            this.finalGroupedByDestinationBeforeNode3 = [];
            for (var i = 0; i < this.groupedByDestinationNode3.length; i++) {
              if ((this.groupedByDestinationNode3[i][searchField]).toLowerCase() == (this.searchInput3).toLowerCase()) {// To check the node_name equality
                results1.push(this.groupedByDestinationNode3[i]);
              }
              else {
                // console.log("subcatcount: ", this.groupedBySourceNode[i].subcategory_syn_node_name.length);
                for (var j = 0; j < this.groupedByDestinationNode3[i].subcategory_syn_node_name.length; j++) {
                  if ((this.groupedByDestinationNode3[i].subcategory_syn_node_name[j]).toLowerCase() == (this.searchInput3).toLowerCase()) { // To check the syn_node_name equality
                    results2.push(this.groupedByDestinationNode3[i]);
                  }
                }
                results3.push(this.groupedByDestinationNode3[i]);
              }
            }
            this.finalGroupedByDestinationBeforeNode3 = results1.concat(results2, results3);
            console.log("Final data: ", this.finalGroupedByDestinationBeforeNode3);

            const key = 'destination_node';
            this.destinationNodesDB3 = [...new Map(this.finalGroupedByDestinationBeforeNode3.map((item: any) =>
              [item[key], item])).values()];
            console.log("Final unique data: ", this.destinationNodesDB3);
            //End sorting according to filter in autosugest json objects
          },
          err => {
            // this.destinationNodesCheck = true;
            this.dbLoading3 = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.dbLoading3 = false;
            console.log("loading finish")
          }
        );
    } else if (this.filterParams.source_node3 == undefined) {
      this.destinationNodesDB3 = [];
      this.selectedDestinationNodes3 = [];
      this.globalVariableService.setSelectedDestinationNodes3(this.selectedDestinationNodes3);
      // console.log("destination else if : ", this.selectedDestinationNodes);
      // this.globalVariableService.resetfilters();
    } 
    // else {
    //   this.destinationNodesDB3 = [];
    //   this.selectedDestinationNodes3 = [];
    //   this.globalVariableService.setSelectedDestinationNodes3(this.selectedDestinationNodes3);
    //   // console.log("destination else3 : ", this.destinationNodesDB);
    //   console.log("destination else : ", this.selectedDestinationNodes3);
    // }
    console.log("filter in destination3: ", this.filterParams);
  }

  processChangeDestination3: any = this.debounce(() => this.getDestinationNode3OnChange());

  selectAll(event: any) {
    // console.log("is_all: ", this.isAllSelected);
    this.globalVariableService.setSelectedAllDestinationNodes3(this.isAllSelected == true ? 1 : 0);
    this.selectedAllDestinationNodes3 = this.globalVariableService.getSelectedAllDestinationNodes3();

    // console.log("is_all_destination_check: ", this.selectedAllDestinationNodes);

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters DESTINATION: ", this.filterParams);

    // if (this.isAllSelected) {
    //   this.destinationNodes.map((element: any) => {
    //     this.selectedDestinationNodes.push(element.destination_node);
    //   })
    // } else {
    //   this.selectedDestinationNodes = [];
    // }
    // console.log("select All: ", this.selectedDestinationNodes);

    this.proceed();
    this.enableDisableProceedButton();
  }
  selectDestinationNode(destinationNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedDestinationNodes3.push(destinationNode.destination_node);
    } else {
      this.selectedDestinationNodes3.splice(this.selectedDestinationNodes3.indexOf(destinationNode.destination_node), 1);
    }
    console.log("selectedDestinationNodes3: ", this.selectedDestinationNodes3);

    this.globalVariableService.setSelectedDestinationNodes3(this.selectedDestinationNodes3);
    this.selectedDestinationNodes3 = Array.from(this.globalVariableService.getSelectedDestinationNodes3());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters DESTINATION 3: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data
    // if (from != 'nodeSelectsWarningModal')
    // this.proceed();
    // this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetDestinationNode3() {
    this.searchInput3 = '';
    this.disableProceed = true;
    this.selectedDestinationNodes3 = [];
    this.globalVariableService.setSelectedDestinationNodes3(this.selectedDestinationNodes3);
    this.selectedDestinationNodes3 = Array.from(this.globalVariableService.getSelectedDestinationNodes3());
    // this.proceed();
  }

  // reloadNode() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getDestinationNode2(this.params);
  // }

  SeeMore(evt: any, seeMoreDestinationNodeModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreDestinationNodeModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedDestinationNodes3 = Array.from(this.globalVariableService.getSelectedDestinationNodes3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedDestinationNodes3 = Array.from(this.globalVariableService.getSelectedDestinationNodes3());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedDestinationNodes3(this.selectedDestinationNodes3);
    this.selectedDestinationNodes3 = Array.from(this.globalVariableService.getSelectedDestinationNodes3());
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectDestinationNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedDestinationNodes3.length < 1) {
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

  // onDestinationHeaderClick() {
  //   this.showDestinationBody = !this.showDestinationBody;
  // }

}
