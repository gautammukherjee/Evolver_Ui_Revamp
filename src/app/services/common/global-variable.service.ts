import { Component, Injectable, OnInit } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  constructor() { }
  errors = {
    dbTableColumnError: 'DataBase Table Structure Got Changed...Will Update Soon. ',
    dbConnectionTerminated: 'DataBaseConnection Terminated Unexpectedly'
  };

  // selectedTa = this.configureTAID();
  selectedTa = [];
  selectedNewsType = [];
  // defaultTAID: any;
  selectedDefaultTasWithName: any = [];

  filterParams = {};
  selectedIndication = [];
  selectedCompany = [];
  selectedDevelopment = [];
  selectedDrug = [];
  selectedNodeSelects = '';
  selectedNodeSelectsCT = '';
  selectedNodeSelects2 = '';
  selectedNodeSelects3 = '';
  selectedSourceNodes = [];
  selectedSourceNodes2 = [];
  selectedSourceNodes3 = [];
  selectedDestinationNodes = [];
  selectedDestinationNodes2 = [];
  selectedDestinationNodes3 = [];
  selectedAllDestinationNodes: number = 0;
  selectedAllDestinationNodes2: number = 0;
  selectedAllDestinationNodes3: number = 0;
  selectedThemes: boolean = true;
  selectedNNRTID: boolean = true;
  selectedEdgeTypes = [];
  selectedEdgeTypes2 = [];
  selectedEdgeTypes3 = [];
  selectedAllForCTDestinationNodes = [];
  selectedAllForCTDestinationNodes2 = [];
  selectedAllForCTDestinationNodes3 = [];

  selectedNodes = [];
  selectedEdges: any;
  selectedRanks = [];
  selectedMapsType: any;
  selectedTabsType: any;


  selectedChooseDate = [];

  public initFromDate = { month: ((new Date()).getMonth() + 1), day: ((new Date()).getDate()), year: ((new Date()).getFullYear() - 1) };
  public initToDate = { month: ((new Date()).getMonth() + 1), day: ((new Date()).getDate()), year: ((new Date()).getFullYear()) };
  // public initFromDate = (((new Date()).getFullYear() - 5) + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate());
  // public initToDate = ((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate());

  fromDate = this.initFromDate;
  toDate = this.initToDate;

  // configureTAID() {
  //   this.defaultTAID = parseInt(localStorage.getItem('selectedDefaultTA') || '{}');
  //   return [this.defaultTAID];
  // }

  setFromDate(from_date: any) {
    this.fromDate = from_date;
  }
  getFromDate() {
    // return this.fromDate;
    return this.fromDate.month + '-' + this.fromDate.day + '-' + this.fromDate.year;
  }
  setToDate(to_date: any) {
    this.toDate = to_date;
  }
  getToDate() {
    // return this.toDate;
    return this.toDate.month + '-' + this.toDate.day + '-' + this.toDate.year;
  }
  setSelectedNodeSelects(nodes: any) {
    this.selectedNodeSelects = nodes;
  }
  getSelectedNodeSelects() {
    return this.selectedNodeSelects;
  }

  setSelectedNodeSelectsCT(nodes: any) {
    this.selectedNodeSelectsCT = nodes;
  }
  getSelectedNodeSelectsCT() {
    return this.selectedNodeSelectsCT;
  }

  setSelectedNodeSelects2(nodes2: any) {
    this.selectedNodeSelects2 = nodes2;
  }
  getSelectedNodeSelects2() {
    return this.selectedNodeSelects2;
  }

  setSelectedNodeSelects3(nodes3: any) {
    this.selectedNodeSelects3 = nodes3;
  }
  getSelectedNodeSelects3() {
    return this.selectedNodeSelects3;
  }

  setSelectedSourceNodes(source_nodes: any) {
    this.selectedSourceNodes = source_nodes;
  }
  getSelectedSourceNodes() {
    return this.selectedSourceNodes;
  }

  setSelectedSourceNodes2(source_nodes2: any) {
    this.selectedSourceNodes2 = source_nodes2;
  }
  getSelectedSourceNodes2() {
    return this.selectedSourceNodes2;
  }

  setSelectedSourceNodes3(source_nodes3: any) {
    this.selectedSourceNodes3 = source_nodes3;
  }
  getSelectedSourceNodes3() {
    return this.selectedSourceNodes3;
  }

  setSelectedDestinationNodes(destination_nodes: any) {
    this.selectedDestinationNodes = destination_nodes;
  }
  getSelectedDestinationNodes() {
    return this.selectedDestinationNodes;
  }

  setSelectedDestinationNodes2(destination_nodes2: any) {
    this.selectedDestinationNodes2 = destination_nodes2;
  }
  getSelectedDestinationNodes2() {
    return this.selectedDestinationNodes2;
  }

  setSelectedDestinationNodes3(destination_nodes3: any) {
    this.selectedDestinationNodes3 = destination_nodes3;
  }
  getSelectedDestinationNodes3() {
    return this.selectedDestinationNodes3;
  }

  setSelectedAllDestinationNodes(val: number) {
    this.selectedAllDestinationNodes = val;
  }
  getSelectedAllDestinationNodes() {
    return this.selectedAllDestinationNodes;
  }

  setSelectedThemes(val: boolean) {
    this.selectedThemes = val;
  }
  getSelectedThemes() {
    return this.selectedThemes;
  }
  setSelectedNNRTID(val: boolean) {
    this.selectedNNRTID = val;
  }
  getSelectedNNRTID() {
    return this.selectedNNRTID;
  }

  setSelectedAllDestinationNodes2(val: number) {
    this.selectedAllDestinationNodes2 = val;
  }
  getSelectedAllDestinationNodes2() {
    return this.selectedAllDestinationNodes2;
  }
  setSelectedAllDestinationNodes3(val: number) {
    this.selectedAllDestinationNodes3 = val;
  }
  getSelectedAllDestinationNodes3() {
    return this.selectedAllDestinationNodes3;
  }

  setSelectedAllForCTDestinationNodes(filteredData: any) {
    this.selectedAllForCTDestinationNodes = filteredData;
  }
  getSelectedAllForCTDestinationNodes() {
    return this.selectedAllForCTDestinationNodes;
  }

  setSelectedAllForCTDestinationNodes2(filteredData: any) {
    this.selectedAllForCTDestinationNodes2 = filteredData;
  }
  getSelectedAllForCTDestinationNodes2() {
    return this.selectedAllForCTDestinationNodes2;
  }
  setSelectedAllForCTDestinationNodes3(filteredData: any) {
    this.selectedAllForCTDestinationNodes3 = filteredData;
  }
  getSelectedAllForCTDestinationNodes3() {
    return this.selectedAllForCTDestinationNodes3;
  }


  setSelectedEdgeTypes(edge_types: any) {
    this.selectedEdgeTypes = edge_types;
  }
  getSelectedEdgeTypes() {
    return this.selectedEdgeTypes;
  }
  setSelectedEdgeTypes2(edge_types2: any) {
    this.selectedEdgeTypes2 = edge_types2;
  }
  getSelectedEdgeTypes2() {
    return this.selectedEdgeTypes2;
  }
  setSelectedEdgeTypes3(edge_types3: any) {
    this.selectedEdgeTypes3 = edge_types3;
  }
  getSelectedEdgeTypes3() {
    return this.selectedEdgeTypes3;
  }

  setSelectedNodes(nodes: any) {
    this.selectedNodes = nodes;
  }
  getSelectedNodes() {
    return this.selectedNodes;
  }
  setSelectedEdges(edge_select: any) {
    this.selectedEdges = edge_select;
  }
  getSelectedEdges() {
    return this.selectedEdges;
  }

  setSelectedRanks(rank_select: any) {
    this.selectedRanks = rank_select;
  }
  getSelectedRanks() {
    return this.selectedRanks;
  }

  setMapsSelected(mapType: any) {
    this.selectedMapsType = mapType;
  }
  getMapsSelected() {
    return this.selectedMapsType;
  }

  setTabsSelected(tabType: any) {
    this.selectedTabsType = tabType;
  }
  getTabsSelected() {
    return this.selectedTabsType;
  }

  getFilterParams(mergeParam = {}) {  // Use of parameter is for if someone wants to pass filter params custom,
    this.filterParams = {
      from_date: this.getFromDate(),
      to_date: this.getToDate(),
      nnrt_id: this.getSelectedNodeSelects() != undefined ? this.getSelectedNodeSelects() : '',
      nnrt_id_ct: this.getSelectedNodeSelectsCT() != undefined ? this.getSelectedNodeSelectsCT() : '',
      nnrt_id2: this.getSelectedNodeSelects2() != undefined ? this.getSelectedNodeSelects2() : undefined,
      nnrt_id3: this.getSelectedNodeSelects3() != undefined ? this.getSelectedNodeSelects3() : undefined,
      source_node: this.getSelectedSourceNodes().length > 0 ? this.getSelectedSourceNodes() : undefined,
      source_node2: this.getSelectedSourceNodes2().length > 0 ? this.getSelectedSourceNodes2() : undefined,
      source_node3: this.getSelectedSourceNodes3().length > 0 ? this.getSelectedSourceNodes3() : undefined,
      destination_node: this.getSelectedDestinationNodes().length > 0 ? this.getSelectedDestinationNodes() : undefined,
      destination_node2: this.getSelectedDestinationNodes2().length > 0 ? this.getSelectedDestinationNodes2() : undefined,
      destination_node3: this.getSelectedDestinationNodes3().length > 0 ? this.getSelectedDestinationNodes3() : undefined,
      destination_node_all: this.getSelectedAllDestinationNodes() == 1 ? this.getSelectedAllDestinationNodes() : 0,
      destination_node_all2: this.getSelectedAllDestinationNodes2() == 1 ? this.getSelectedAllDestinationNodes2() : 0,
      destination_node_all3: this.getSelectedAllDestinationNodes3() == 1 ? this.getSelectedAllDestinationNodes3() : 0,
      edge_type_id: this.getSelectedEdgeTypes().length > 0 ? this.getSelectedEdgeTypes() : undefined,
      edge_type_id2: this.getSelectedEdgeTypes2().length > 0 ? this.getSelectedEdgeTypes2() : undefined,
      edge_type_id3: this.getSelectedEdgeTypes3().length > 0 ? this.getSelectedEdgeTypes3() : undefined,

      node_id: this.getSelectedNodes().length > 0 ? this.getSelectedNodes() : undefined,
      edge_select: this.getSelectedEdges() != undefined ? this.getSelectedEdges() : 1,
      rank_select: this.getSelectedRanks().length > 0 ? this.getSelectedRanks() : undefined,
      mapType: this.getMapsSelected() != undefined ? this.getMapsSelected() : 'default',
      tabType: this.getTabsSelected() != undefined ? this.getTabsSelected() : 'default',
      destination_node_all_for_ct: this.getSelectedAllForCTDestinationNodes().length > 0 ? this.getSelectedAllForCTDestinationNodes() : undefined,
      destination_node_all_for_ct2: this.getSelectedAllForCTDestinationNodes2().length > 0 ? this.getSelectedAllForCTDestinationNodes2() : undefined,
      destination_node_all_for_ct3: this.getSelectedAllForCTDestinationNodes3().length > 0 ? this.getSelectedAllForCTDestinationNodes3() : undefined,
      selected_themes: this.getSelectedThemes() == true ? this.getSelectedThemes() : false,
      nnrtIdChk: this.getSelectedNNRTID() == true ? this.getSelectedNNRTID() : false
    };
    return Object.assign(mergeParam, this.filterParams);
  }

  resetfilters() {
    // this.setSelectedNodeSelects(2);
    this.setSelectedSourceNodes([]);
    this.setSelectedSourceNodes2([]);
    this.setSelectedSourceNodes3([]);
    this.setSelectedDestinationNodes([]);
    this.setSelectedDestinationNodes2([]);
    this.setSelectedDestinationNodes3([]);
    this.setSelectedNodeSelects2(undefined);
    this.setSelectedNodeSelects3(undefined);
    this.setSelectedEdgeTypes([]);
    this.setSelectedEdgeTypes2([]);
    this.setSelectedEdgeTypes3([]);
    this.setSelectedAllForCTDestinationNodes([]);
    this.setSelectedAllForCTDestinationNodes2([]);
    this.setSelectedAllForCTDestinationNodes3([]);
  }

  resetfiltersForLevel2() {
    this.setSelectedNodeSelects2(undefined);
    this.setSelectedSourceNodes2([]);
    this.setSelectedEdgeTypes2([]);
    this.setSelectedDestinationNodes2([]);
    this.setSelectedAllForCTDestinationNodes2([]);
  }

  resetfiltersForLevel3() {
    this.setSelectedNodeSelects3(undefined);
    this.setSelectedSourceNodes3([]);
    this.setSelectedEdgeTypes3([]);
    this.setSelectedDestinationNodes3([]);
    this.setSelectedAllForCTDestinationNodes3([]);
  }

  resetNode() {
    this.setSelectedNodes([]);
  }

  resetSourceNode2() {
    this.setSelectedSourceNodes2([]);
  }

  resetSourceNode3() {
    this.setSelectedSourceNodes3([]);
  }
  resetDestinationNode2() {
    this.setSelectedDestinationNodes2([]);
    this.setSelectedAllForCTDestinationNodes2([]);
  }
  resetDestinationNode3() {
    this.setSelectedDestinationNodes3([]);
    this.setSelectedAllForCTDestinationNodes3([]);
  }
  resetEdgeTypeNode2() {
    this.setSelectedEdgeTypes2([]);
  }

  resetfiltersInner() {
  }

  resetfiltersTA() {
    // this.setSelectedTextSearch(undefined);
  }
}
