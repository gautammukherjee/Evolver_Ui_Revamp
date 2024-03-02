import { Component, OnInit } from '@angular/core';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { GlobalVariableService } from '../services/common/global-variable.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'app-pmid-search',
  templateUrl: './pmid-search.component.html',
  styleUrls: ['./pmid-search.component.scss']
})
export class PmidSearchComponent implements OnInit {

  public node_selects: any = [];
  private filterParams: any;
  private result: any = [];
  public loading: boolean = true;
  pmidSearchForm: object = {};
  public loadingPMIDSearch: boolean = false;
  masterListsData: any = [];
  masterListsDataDetailsLoaded: any = [];
  notEmptyPost: boolean = false;
  notscrolly: boolean = true;
  public isloading: boolean = false;

  pmidForm:FormGroup = new FormGroup({
    pair_type: new FormControl('', [Validators.required]),
    pmid_value: new FormControl('', [Validators.required]),
  })

  constructor(private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService
  ) {
  }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.nodeSelectsService.getNodeSelects(this.filterParams)
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.node_selects = this.result.nodeSelectsRecords;
          // this.nodeSelectsFilterText2 = this.node_selects[1].pair_name;
          // console.log("node_selects: ", this.node_selects);
          // console.log("nodeSelectsFilterText2: ", this.nodeSelectsFilterText2);
        },
        err => {
          this.loading = false;
          console.log(err.message)
        },
        () => {
          this.loading = false;
          console.log("loading finish")
        }
      )
  }

  PMIDSearchData() {
    this.loadingPMIDSearch = true;
    this.notEmptyPost = true;
    this.pmidSearchForm = {
      pair_type: this.pmidForm.value.pair_type,
      pmid_value: this.pmidForm.value.pmid_value
    };
    console.log("your article and sentences: ", this.pmidSearchForm);

    this.nodeSelectsService.getPMIDSearchData(this.pmidSearchForm).subscribe(
      (data: any) => {
        this.masterListsData = data;
        console.log("masterListsData: ", this.masterListsData.nodeSelectsRecords);

        this.masterListsDataDetailsLoaded = [];
        this.masterListsData.nodeSelectsRecords.forEach((event: any, index: any) => {
          var temps: any = {};
          const regex = /[{}]/g;
          // const edgeTypeIds = event.edge_type_ids;
          // const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');

          // temps["news_id"] = event.news_id;
          temps["news_id"] = (index + 1);
          temps["pair_type"] = event.pair_type;
          temps["source_node_name"] = event.source_node_name;
          temps["destination_node_name"] = event.destination_node_name;
          temps["edge_type_name"] = event.edge_type_name;

          this.masterListsDataDetailsLoaded.push(temps);
        });
        console.log("masterListsDataDetailsLoaded: ", this.masterListsDataDetailsLoaded);
        console.log("masterListsDataDetailsLoadedlength: ", this.masterListsDataDetailsLoaded.length);
        this.bootstrapTableChart();
      },
      err => {
        alert("PMID search is not working...");
        this.loadingPMIDSearch = false;
        console.log(err);
      },
      () => {
        this.loadingPMIDSearch = false;
      }
    );
  }

  bootstrapTableChart() {
    jQuery('#showEventDescription').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 500,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      exportOptions: {
        ignoreColumn: [6],
        // columns: [6],
        // visible: [6,'true'],
      },
      data: this.masterListsDataDetailsLoaded,
    });
    jQuery('#showEventDescription').bootstrapTable("load", this.masterListsDataDetailsLoaded);
  }

  // onDescScroll() {
  //   console.log('onScroll Here');
  //   this.filterParams['tabType'] = 'pmid_search'; 
  //   console.log('onScroll Here1: ', this.filterParams['tabType']);
  //   if (!this.isloading && !this.loadingPMIDSearch) {
  //     if (this.notscrolly && this.notEmptyPost && this.filterParams['tabType'] == "pmid_search") {
  //       console.log('onScroll Here inside');
  //       // this.spinner.show();
  //       this.notscrolly = false;
  //       // this.currentPage++;
  //       // this.loadNextDataSet();
  //     }
  //   } else {
  //     console.log('onScroll Here2', this.isloading);
  //   }
  // }

}
