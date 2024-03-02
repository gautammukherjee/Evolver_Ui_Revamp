import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NetworkMapComponent } from './network-map/network-map.component';
import { NgCytoComponent } from './ng-cyto/ng-cyto.component';
import { EventDescriptionComponent } from './event-description/event-description.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FilterDataRangeComponent } from './filters/filter-data-range/filter-data-range.component';
import { NodeDataPipe } from './pipes/nodeDataPipe';
import { SourceNodePipe } from './pipes/sourceNodePipe';
import { DestinationNodePipe } from './pipes/destinationNodePipe';
import { EdgeTypePipe } from './pipes/edgeTypePipe';
import { FilterDataPipe } from './pipes/filterDataPipe';
import { FilterArticlePipe } from './pipes/filterArticlePipe';
import { PairTypePipe } from './pipes/pairTypePipe';
import { FilterNodeSelectComponent } from './filters/filter-node-select/filter-node-select.component';
import { FilterNodeSelectLevel2Component } from './filters/filter-node-select-level2/filter-node-select-level2.component';
import { FilterNodeSelectLevel3Component } from './filters/filter-node-select-level3/filter-node-select-level3.component';
import { NoPageComponent } from './no-page/no-page.component';
import { FilterSourceNodeComponent } from './filters/filter-source-node/filter-source-node.component';
import { FilterSourceNodeLevel2Component } from './filters/filter-source-node-level2/filter-source-node-level2.component';
import { FilterSourceNodeLevel3Component } from './filters/filter-source-node-level3/filter-source-node-level3.component';
import { FilterDestinationNodeComponent } from './filters/filter-destination-node/filter-destination-node.component';
import { FilterDestinationNodeLevel2Component } from './filters/filter-destination-node-level2/filter-destination-node-level2.component';
import { FilterDestinationNodeLevel3Component } from './filters/filter-destination-node-level3/filter-destination-node-level3.component';

import { FilterEdgeTypeComponent } from './filters/filter-edge-type/filter-edge-type.component';
import { FilterSubmitComponent } from './filters/filter-submit/filter-submit.component';
//import { SafePipeModule } from 'safe-pipe';
import { SafePipe } from './pipes/safe.pipe';
import { BioInfomaticsComponent } from './bio-infomatics/bio-infomatics.component';

import { FilterEdgeTypeLevel2Component } from './filters/filter-edge-type-level2/filter-edge-type-level2.component';
import { FilterEdgeTypeLevel3Component } from './filters/filter-edge-type-level3/filter-edge-type-level3.component';
import { EventChartComponent } from './event-chart/event-chart.component';


import { HighchartsChartModule } from 'highcharts-angular';
import { DistributionByRelGrpComponent } from './distribution-by-rel-grp/distribution-by-rel-grp.component';
import { DetailsOfAssocDataComponent } from './details-of-assoc-data/details-of-assoc-data.component';
import { PmidCountWithGeneAndDiseaseComponent } from './pmid-count-with-gene-and-disease/pmid-count-with-gene-and-disease.component';
//import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { DistributionByRelationTypeComponent } from './distribution-by-relation-type/distribution-by-relation-type.component';
// import { DataTablesModule } from 'angular-datatables';
import { OnlineStatusModule } from 'ngx-online-status';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CTDiseaseAssocComponent } from './ct/ct_disease_assoc/ct_disease_assoc.component';
import { CTInvestigatorRelsComponent } from './ct/ct_investigator_rels/ct_investigator_rels.component';
import { InvestigatorByRoleComponent } from './ct/investigator-by-role/investigator-by-role.component';
import { NctInvestigatorNameComponent } from './ct/nct-investigator-name/nct-investigator-name.component';
import { InvestigatorByCountryComponent } from './ct/investigator-by-country/investigator-by-country.component';
import { CtIndexComponent } from './ct/ct-index/ct-index.component';
import { CtInvestigatorRelsByStatsComponent } from './ct/ct-investigator-rels-by-stats/ct-investigator-rels-by-stats.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ArticleSentenceDashboardComponent } from './article-sentence-dashboard/article-sentence-dashboard.component';
import { PreviewComponent } from './preview/preview.component';
import { UmlsActionSecondComponent } from './umls-action-second/umls-action-second.component';
import { ClickDirectiveDirective } from './AppDirective/click-directive.directive';
import { PmidSearchComponent } from './pmid-search/pmid-search.component';
import { FilterNodeSelectCTComponent } from './filters/filter-node-select-ct/filter-node-select-ct.component';
import { CarouselComponent } from './login/Components/carousel/carousel.component';
import { HomeComponent } from './home/home.component';
import { LeftFilterLayoutComponent } from './left-filter-layout/left-filter-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    ManagePasswordComponent,
    IndexComponent,
    HomeComponent,
    DashboardComponent,
    NetworkMapComponent,
    NgCytoComponent,
    EventDescriptionComponent,
    FilterNodeSelectComponent,
    FilterNodeSelectLevel2Component,
    FilterSourceNodeComponent,
    FilterSourceNodeLevel2Component,
    FilterDestinationNodeComponent,
    FilterDestinationNodeLevel2Component,
    FilterEdgeTypeComponent,
    FilterSubmitComponent,
    FilterEdgeTypeLevel2Component,
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    NoPageComponent,
    NodeDataPipe,
    SourceNodePipe,
    DestinationNodePipe,
    EdgeTypePipe,
    SafePipe,
    FilterDataPipe,
    FilterArticlePipe,
    PairTypePipe,
    BioInfomaticsComponent,
    EventChartComponent,
    DistributionByRelGrpComponent,
    DetailsOfAssocDataComponent,
    PmidCountWithGeneAndDiseaseComponent,
    DistributionByRelationTypeComponent,
    CTDiseaseAssocComponent,
    CTInvestigatorRelsComponent,
    InvestigatorByRoleComponent,
    NctInvestigatorNameComponent,
    InvestigatorByCountryComponent,
    CtIndexComponent,
    CtInvestigatorRelsByStatsComponent,
    FilterNodeSelectLevel3Component,
    FilterSourceNodeLevel3Component,
    FilterEdgeTypeLevel3Component,
    FilterDestinationNodeLevel3Component,
    ScenarioComponent,
    UserDashboardComponent,
    PreviewComponent,
    ArticleSentenceDashboardComponent,
    UmlsActionSecondComponent,
    ClickDirectiveDirective,
    PmidSearchComponent,
    FilterNodeSelectCTComponent,
    CarouselComponent,
    LeftFilterLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //SafePipeModule 
    HighchartsChartModule,
    // DataTablesModule,
    OnlineStatusModule,
    InfiniteScrollModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    FilterNodeSelectComponent,
    FilterNodeSelectLevel2Component,
    FilterSourceNodeComponent,
    FilterSourceNodeLevel2Component,
    FilterDestinationNodeComponent,
    FilterDestinationNodeLevel2Component,
    FilterEdgeTypeComponent,
    FilterEdgeTypeLevel2Component,
    NoPageComponent,
    NodeDataPipe,
    SourceNodePipe,
    DestinationNodePipe,
    EdgeTypePipe,
    FilterDataPipe,
    FilterArticlePipe,
    PairTypePipe
  ],
  schemas: [],
  providers: [
    DatePipe,
    {
      provide: [HTTP_INTERCEPTORS],
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
