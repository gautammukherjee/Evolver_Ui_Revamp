import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-destination-node-level2',
  templateUrl: './filter-destination-node-level2.component.html',
  styleUrls: ['./filter-destination-node-level2.component.scss']
})
export class FilterDestinationNodeLevel2Component implements OnInit {

  @Output() onSelectDestinationNode2: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedDestinationNodes2: any = [];
  public destinationNodes2: any = [];
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
  searchInput2: any = null;
  public dbLoading2: boolean = false;
  public destinationNodesDB2: any = [];
  public destinationNodesLength2: any = [];
  // public showDestinationBody: boolean = true;

  public groupedByDestinationNode2: any = {};
  public finalGroupedByDestinationBeforeNode2: any = {};
  distinctDestinationNodesData2: any = [];
  public selectedAllForCTDestinationNodes2: any = [];
  public selectedAllDestinationNodes2: any = [];

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
      console.log("Destination level2:1 ", event.clickOn);
      if (event.clickOn == undefined) {
        this.getResetDestinationNode();
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'sourceNode2Filter' || event.clickOn == 'edgeType2Filter' || event.clickOn == 'deleteLevel2')) {
        // console.log("here1");
        console.log("destination Level2:2 ", event.clickOn);
        // this.getResetDestinationNode();
        this.getDestinationNode2();

        this.searchInput2 = '';
        // this.selectedDestinationNodes2 = [];
        // this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes2);
        // this.destinationNodesDB2 = [];
        this.getDestinationNode2OnChange();
      }
    });
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetDestinationNode() {
    this.destinationNodes2 = [];
    this.destinationNodesDB2 = [];
    this.selectedDestinationNodes2 = [];
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes2);
    this.globalVariableService.resetDestinationNode2();
    this.searchInput2 = '';
    this.destinationNodesLength2 = [];
    this.distinctDestinationNodesData2 = [];
  }

  getDestinationNode2() {
    // this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    this.filterParams = this.globalVariableService.getFilterParams();    
    // this.selectedDestinationNodes = []
    this.destinationNodesLength2 = [];
    this.distinctDestinationNodesData2 = [];
    // this.currentPage = 1;
    if (this.filterParams.source_node2 != undefined) {
      this.loading = true;

      this.nodeSelectsService.getDestinationNode2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.destinationNodesLength2 = this.result.destinationNodeRecords2.length;
            console.log("destinationNodes Length2: ", this.destinationNodesLength2);

            //Start here for clinical trials destination nodes unique data
            let destinationID: any = [];
            this.result.destinationNodeRecords2.forEach((event: any) => {
              destinationID.push(event.destination_node);
            });
            console.log("destinationID: ", destinationID);
            this.distinctDestinationNodesData2 = [...new Set(destinationID.map((x: any) => x))];
            console.log("destinationNodes res: ", this.distinctDestinationNodesData2);

            this.globalVariableService.setSelectedAllForCTDestinationNodes2(this.distinctDestinationNodesData2);
            this.selectedAllForCTDestinationNodes2 = Array.from(this.globalVariableService.getSelectedAllForCTDestinationNodes2());
            this.filterParams = this.globalVariableService.getFilterParams();
            console.log("new new Filters all select DESTINATION2: ", this.filterParams);
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
      this.destinationNodes2 = [];
      this.destinationNodesLength2 = [];
      this.distinctDestinationNodesData2 = [];
      this.globalVariableService.resetDestinationNode2();
      // this.globalVariableService.resetEdgeTypeNode2();
    }
  }

  getDestinationNode2OnChange() {
    // this.selectedDestinationNodes = []
    this.filterParams = this.globalVariableService.getFilterParams();    
    // console.log("filter params: ", this.filterParams);
    // this.destinationNodesDB=[];
    if (this.searchInput2 && this.searchInput2.length > 2 && this.filterParams.source_node2 != undefined) {
      console.log("this all desti2: ", this.selectedDestinationNodes2)
      this.dbLoading2 = true;
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput2 });
      // console.log("filterparamsSearchSource: ", this.filterParams);
      this.nodeSelectsService.getDestinationNode2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.destinationNodesDB2 = this.result.destinationNodeRecords2;
            console.log("destinationNodesKeyup2: ", this.destinationNodesDB2);

            ///////////////////////////////////////////////////////
            // 2. Group by destination_node name
            const groupedDestinationNodes = this.destinationNodesDB2.reduce((accumulator: any, element: any, index: any) => {
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
            console.log("groupedDestinationNodes2: ", groupedDestinationNodes);

            //////////////////////////////////////////////////////////////////////////
            // 3. Group according to destination name name and get the new json objects
            this.groupedByDestinationNode2 =
              Object.keys(groupedDestinationNodes).map(destination_node_id => ({
                destination_node: destination_node_id,
                destination_node_name: groupedDestinationNodes[destination_node_id].destination_node_name,
                subcategory_syn_node_name: groupedDestinationNodes[destination_node_id].subCategories,
              }))
            console.log("groupedByDestinationNode2: ", this.groupedByDestinationNode2);

            ///////////////////////////////////////////////////////////////////////////////////////
            //4. Start sorting according to keyword search filter in autosugest json objects
            let searchField = "destination_node_name";
            let results1 = []; let results2 = []; let results3 = [];
            this.finalGroupedByDestinationBeforeNode2 = [];
            for (var i = 0; i < this.groupedByDestinationNode2.length; i++) {
              if ((this.groupedByDestinationNode2[i][searchField]).toLowerCase() == (this.searchInput2).toLowerCase()) {// To check the node_name equality
                results1.push(this.groupedByDestinationNode2[i]);
              }
              else {
                // console.log("subcatcount: ", this.groupedBySourceNode[i].subcategory_syn_node_name.length);
                for (var j = 0; j < this.groupedByDestinationNode2[i].subcategory_syn_node_name.length; j++) {
                  if ((this.groupedByDestinationNode2[i].subcategory_syn_node_name[j]).toLowerCase() == (this.searchInput2).toLowerCase()) { // To check the syn_node_name equality
                    results2.push(this.groupedByDestinationNode2[i]);
                  }
                }
                results3.push(this.groupedByDestinationNode2[i]);
              }
            }
            this.finalGroupedByDestinationBeforeNode2 = results1.concat(results2, results3);
            console.log("Final data: ", this.finalGroupedByDestinationBeforeNode2);

            const key = 'destination_node';
            this.destinationNodesDB2 = [...new Map(this.finalGroupedByDestinationBeforeNode2.map((item: any) =>
              [item[key], item])).values()];
            console.log("Final unique data: ", this.destinationNodesDB2);
            //End sorting according to filter in autosugest json objects
          },
          err => {
            // this.destinationNodesCheck = true;
            this.dbLoading2 = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.dbLoading2 = false;
            console.log("loading finish")
          }
        );
    } else if (this.filterParams.source_node2 == undefined) {
      this.destinationNodesDB2 = [];
      this.selectedDestinationNodes2 = [];
      this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
      // console.log("destination else if : ", this.selectedDestinationNodes);
      // this.globalVariableService.resetfilters();
    } 
    // else {
    //   this.destinationNodesDB2 = [];
    //   this.selectedDestinationNodes2 = [];
    //   this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    //   // console.log("destination else2 : ", this.destinationNodesDB);
    //   console.log("destination else : ", this.selectedDestinationNodes2);
    // }
    console.log("filter in destination2: ", this.filterParams);
  }

  processChangeDestination2: any = this.debounce(() => this.getDestinationNode2OnChange());

  selectAll(event: any) {
    // console.log("is_all: ", this.isAllSelected);
    this.globalVariableService.setSelectedAllDestinationNodes2(this.isAllSelected == true ? 1 : 0);
    this.selectedAllDestinationNodes2 = this.globalVariableService.getSelectedAllDestinationNodes2();

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
      this.selectedDestinationNodes2.push(destinationNode.destination_node);
    } else {
      this.selectedDestinationNodes2.splice(this.selectedDestinationNodes2.indexOf(destinationNode.destination_node), 1);
    }
    console.log("selectedDestinationNodes2: ", this.selectedDestinationNodes2);

    this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters DESTINATION 2: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data
    // if (from != 'nodeSelectsWarningModal')
    this.proceed();
    // this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetDestinationNode() {
    this.searchInput2 = '';
    this.disableProceed = true;
    this.selectedDestinationNodes2 = [];
    this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.proceed();
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
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectDestinationNode2.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedDestinationNodes2.length < 1) {
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
