import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-submit',
  templateUrl: './filter-submit.component.html',
  styleUrls: ['./filter-submit.component.scss']
})
export class FilterSubmitComponent implements OnInit {

  @Output() onSelectSubmit: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  private filterParams: any;
  private params: object = {};
  public selectedSourceNodes: any = [];
  public loading: boolean = false;
  togglecollapseStatus: boolean = false;
  public disableProceed = true;

  constructor(
    private globalVariableService: GlobalVariableService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("eventSubmit1: ", event);
      if (event == undefined) {
        this.getSubmit(event, 2);
      } else if (event !== undefined && event.clickOn == 'sourceNodeFilter') {
        this.getSubmit(event, 2);
      }
    });
    this.getSubmit(event, 1);
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getSubmit(event: any, type: any) {
    this.loading = false;
    this.params = this.globalVariableService.getFilterParams();
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    console.log("1: ", this.selectedSourceNodes);
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetAllFilters() {
    this.globalVariableService.resetfilters();// On click TA other filter's data will update, so've to reset filter selected data   
    window.location.reload();
    // this.proceed();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.onSelectSubmit.emit();
  }

  private enableDisableProceedButton() {
    // if (this.selectedSourceNodes.length > 0 && (this.selectedDestinationNodes.length > 0 || this.selectedEdgeTypes.length > 0)) {
    if (this.selectedSourceNodes.length > 0) {
      this.disableProceed = false;
    } else {
      this.disableProceed = true;
    }
  }

}
