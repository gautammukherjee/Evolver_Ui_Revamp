import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject, debounceTime } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServService } from '../../services/common/serv.service';

@Component({
  selector: 'app-filter-source-node',
  templateUrl: './filter-source-node.component.html',
  styleUrls: ['./filter-source-node.component.scss']
})
export class FilterSourceNodeComponent implements OnInit {


  options: any = ["Sam", "Varun", "Jasmine"];
  filteredOptions: any = [];
  formGroup!: FormGroup;




  @Output() onSelectSourceNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  private filterParams: any;
  public alphabeticallyGroupedSourceNodes: any = '';
  public selectedSourceNodes: any = [];
  // public sourceNodes: any = [];
  public sourceNodes: Array<object> = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public sourceNodesCheck: boolean = false;
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
  sourceNodeFilter: string = '';
  sourceNodeFilterText: string = '';
  // hideCardBody: boolean = true;

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private service: ServService
  ) { }

  ngOnInit(): void {

    this.initForm();
    this.getNames();

  }


  initForm() {
    this.formGroup = this.fb.group({
      'employee': ['']
    })
    this.formGroup?.get('employee')?.valueChanges.pipe(debounceTime(1000)).subscribe(response => {
      console.log('data is ', response);

      if (response && response.length) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }

    })
  }

  filterData(enteredData: any) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.service.getData().subscribe(response => {
      console.log("response: ", response);
      this.options = response;
      this.filteredOptions = response;
    })


    // this.nodeSelectsService.getSourceNode(this.params).subscribe(
    //   response => {
    //     console.log("response1: ", response);

    //     // this.result = response;
    //     this.options = response;
    //     console.log("response2: ", this.options.sourceNodeRecords);

    //     this.filteredOptions = response;
    //   });

  }


  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  // public getSourceNode(event: any, type: any) {
  //   this.loading = true;
  //   this.params = this.globalVariableService.getFilterParams();


  //   this.nodeSelectsService.getSourceNode(this.params)
  //     .subscribe(
  //       data => {
  //         this.result = data;
  //         // console.log("result: ", this.result);
  //         this.sourceNodes = this.result.sourceNodeRecords;
  //         console.log("sourceNodes: ", this.sourceNodes);

  //         this.alphabeticallyGroupedSourceNodes = this.groupBy(this.sourceNodes, 'source_node_name');
  //         // console.log("alphabeticallyGroupedSourceNodes: ", this.alphabeticallyGroupedSourceNodes);

  //         //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
  //         for (let i = 0; i < this.result.sourceNodeRecords.length && i < 1; i++) {
  //           this.selectedSourceNodes.push(this.result.sourceNodeRecords[i].source_node);
  //           //this.selectedSourceNodes = [];
  //         }
  //         console.log("selected source Nodes: ", this.selectedSourceNodes);
  //         this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
  //         //} else {
  //         //this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
  //         //}
  //       },
  //       err => {
  //         this.sourceNodesCheck = true;
  //         this.loading = false;
  //         console.log(err.message)
  //       },
  //       () => {
  //         this.sourceNodesCheck = true;
  //         this.loading = false;
  //         console.log("loading finish")
  //       }
  //     );
  // }

  selectSourceNode(sourceNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes.splice(this.selectedSourceNodes.indexOf(sourceNode.source_node), 1);
    }

    console.log("selectedSourceNodes: ", this.selectedSourceNodes);
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
      this.sourceNodes.map((element: any) => {
        console.log("element: ", element);
        this.selectedSourceNodes.push(element.source_node);
      })
    } else {
      this.selectedSourceNodes = [];
    }
    this.enableDisableProceedButton();
  }

  resetSourceNode() {
    this.selectedSourceNodes = [];
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // this.proceed();
  }

  // reloadNode() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getSourceNode(this.params);
  // }

  SeeMore(evt: any, seeMoreSourceNodeModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreSourceNodeModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
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
    this.onSelectSourceNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes.length < 1) {
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
