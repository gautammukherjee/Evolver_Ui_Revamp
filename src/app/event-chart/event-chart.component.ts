import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-event-chart',
  templateUrl: './event-chart.component.html',
  styleUrls: ['./event-chart.component.scss']
})

export class EventChartComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }



}
