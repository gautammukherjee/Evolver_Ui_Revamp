import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-destination-node',
  templateUrl: './filter-destination-node.component.html',
  styleUrls: ['./filter-destination-node.component.scss']
})
export class FilterDestinationNodeComponent implements OnInit {

  @Output() onSelectDestinationNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public alphabeticallyGroupedDestinationNodes: any = '';
  public selectedDestinationNodes: any = [];
  public destinationNodes: any = [];
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
  public disableProceed = true;
  destinationNodeFilter: string = '';
  destinationNodeFilterText: string = '';
  //diseaseCheck: any;
  //diseaseCheckCT: any;
  // hideCardBody: boolean = true;

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    //To filter the gene lists
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Destination Nodes Filter..";

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Destination Nodes";
    //End here

    // this.globalVariableService.setSelectedDestinationNodes([45136]);
    // this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    // console.log("selectedDestinationNodes: ", this.selectedDestinationNodes);

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("eventDestination:: ", event.clickOn);
      if (event.clickOn == undefined) {
        // this.hideCardBody = true;
        // this.selectedDestinationNodes = []; // Reinitialized, because when data updated on click TA, it should empty locally
        this.getDestinationNode(event, 2);
        // } else if (event !== undefined && event.clickOn != 'geneFilter' && event.clickOn != 'geneFilter')
      } else if (event.clickOn !== undefined && event.clickOn != 'sourceNodeFilter') {
        // this.selectedDestinationNodes = []; // Reinitialized, because when data updated on click TA, it should empty locally
        // this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
        this.getDestinationNode(event, 2);
      }
    });
    this.getDestinationNode(event, 1);
    // this.hideCardBody = true;

  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getDestinationNode(event: any, type: any) {
    this.loading = true;
    this.params = this.globalVariableService.getFilterParams();


    //if (this.diseaseCheck !== undefined || this.diseaseCheckCT !== undefined) {
    this.nodeSelectsService.getDestinationNode(this.params)
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.destinationNodes = this.result.destinationNodeRecords;
          console.log("destinationNodes: ", this.destinationNodes);

          this.alphabeticallyGroupedDestinationNodes = this.groupBy(this.destinationNodes, 'destination_node_name');
          // console.log("alphabeticallyGroupedGenes: ", this.alphabeticallyGroupedGenes);

          //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
          // for (let i = 0; i < this.result.destinationNodeRecords.length && i < 1; i++) {
          //   this.selectedDestinationNodes.push(this.result.destinationNodeRecords[i].destination_node);
          //   //this.selectedDestinationNodes = [];
          // }
          this.selectedDestinationNodes = [];
          console.log("selected destination Nodes: ", this.selectedDestinationNodes);
          this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
          //} else {
          //this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
          //}
          this.filterParams = this.globalVariableService.getFilterParams();
          // console.log("new Filters destination: ", this.filterParams);
          // console.log("new Filters destination in destin: ", this.filterParams.destination_node);
        },
        err => {
          this.destinationNodesCheck = true;
          this.loading = false;
          console.log(err.message)
        },
        () => {
          this.destinationNodesCheck = true;
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

  selectDestinationNode(destinationNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedDestinationNodes.push(destinationNode.destination_node);
    } else {
      this.selectedDestinationNodes.splice(this.selectedDestinationNodes.indexOf(destinationNode.destination_node), 1);
    }

    // console.log("selectedDestinationNodes: ", this.selectedDestinationNodes);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    if (from != 'nodeSelectsWarningModal')
      this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll(event: any, nodeSelectsWarningModal: any) {
    if (this.isAllSelected) {
      this.destinationNodes.map((element: any) => {
        // console.log("element: ", element);
        this.selectedDestinationNodes.push(element.destination_node);
      })
    } else {
      this.selectedDestinationNodes = [];
    }
    this.enableDisableProceedButton();
  }

  resetDestinationNode() {
    this.selectedDestinationNodes = [];
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    // this.proceed();
  }

  // reloadNode() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getDestinationNode(this.params);
  // }

  SeeMore(evt: any, seeMoreDestinationNodeModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreDestinationNodeModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectDestinationNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedDestinationNodes.length < 1) {
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
