import { Component, OnChanges, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
// import cytoscape from 'cytoscape';

// import * as $ from 'jquery';
// declare var jQuery: any;

declare var cytoscape: any;
declare var require: any;
declare var jQuery: any;

var cytoscape = require('cytoscape');

var cyqtip = require('cytoscape-qtip');
cyqtip(cytoscape); // register extension

// require(['cytoscape-svg'], function (cytoscape: any, svg: any) {
//     svg(cytoscape); // register extension
// });

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37
}

@Component({
    selector: 'ng2-cytoscape',
    template: '<div id="cy"></div>',
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
    }`]
})


export class NgCytoComponent implements OnChanges {

    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;

    @Output() onGraphSelection: EventEmitter<any> = new EventEmitter();
    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    private modalRef: any;
    private params: object = {};
    private _selectedNodes: any;
    private checkedNodes: any = [];

    node_name: string = '';
    edge_name: string = '';
    loading = false;
    private filterParams: any;
    dataSDGs = [];
    SDGDetails: any = [];
    nodeName: any;
    resultNodes: any = [];
    resultEdgeNames: any = [];
    conceptIds: any = [];
    umlsData: any = [];
    umlsDefintionData: any = [];
    umlsRelationsByCodeUrl: any = [];
    umlsRelationData: any = [];
    umlsDataInner: any = [];
    edgeTypeNameData: any = [];
    loadingEdge: boolean = false;
    loadingUmls: boolean = false;
    loadingUmlsLoader: any;
    loadingUmlsLoader2: any;

    pubmedURLsDownloadLoader: any;
    pubmedURLsDownload: any;
    pubmedEdgeDetails: any;
    umlsDataLists: any;
    umlsDataLists2: any = '';
    umlsDataListsRelation: any = '';
    articles_details: any = [];
    edgeNamesMultiple: any;
    nodeDetails: any;
    error: any;

    // searchConnections;

    @ViewChild('showNode', { static: false }) show_nodes?: ElementRef;
    @ViewChild('showEdge', { static: false }) show_edges?: ElementRef;

    public constructor(private router: Router, private globalVariableService: GlobalVariableService, private nodeSelectsService: NodeSelectsService, private renderer: Renderer2, private el: ElementRef, private modalService: NgbModal) {

        // this._selectedNodes = this.globalVariableService.getSelectedNodes();
        this._selectedNodes = this.globalVariableService.getSelectedSourceNodes();

        // this.layout = this.layout || {
        //     name: 'cose',
        //     directed: true,
        //     padding: 0
        // };

        this.zoom = this.zoom || {
            min: 0.3,
            max: 1.3
        };

        this.style = this.style || cytoscape.stylesheet()

            .selector('node')
            .css({
                'width': 'mapData(weight, 25, 40, 60, 80)',
                'content': 'data(name)',
                'text-valign': 'center',
                'text-outline-width': 0.5,
                'background-fit': 'contain',
                'text-outline-color': 'data(colorCode)',
                'background-color': 'data(colorCode)',
                'color': 'data(colorLabel)',
                'text-halign': 'center',
                // 'height': '60px',
                'border-color': 'black',
                'border-width': '0.5px'

                // 'box-shadow': 'inset -1px -1px 100px   100px black'
            })
            .style({ "font-size": 16, "font-family": "system-ui" })    // big font

            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': '#333'
            })

            // .selector('edge')
            // .css({
            //     'opacity': 0.666,
            //     'width': 'mapData(strength, 70, 100, 2, 6)',
            //     'target-arrow-shape': 'triangle',
            //     'source-arrow-shape': 'circle',
            //     'line-color': 'data(colorCode)',
            //     'source-arrow-color': 'data(colorCode)',
            //     'target-arrow-color': 'data(colorCode)'
            // })

            .selector('edge')
            .css({
                'opacity': 0.666,
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'width': 2,
                'line-color': '#77BBF2',
                'target-arrow-color': '#77BBF2'
            })

            // .selector('highlight')
            // .css({
            //     "background-color": "pink"
            // })
            // .selector('edge.highlighted')
            // .css({
            //     'line-color': 'black',
            //     'target-arrow-color': '#32404E'
            // })
            // .selector('edge.lines')
            // .css({
            //     'line-color': '#32404E',
            //     'target-arrow-color': '#32404E'
            // })

            .selector('edge.questionable')
            .css({
                'line-style': 'solid',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        this.render();
        // console.log(this.el.nativeElement);
    }

    public render(): any {
        let cy_contianer = this.renderer.selectRootElement("#cy");
        let localselect = this.select;

        let cy = cytoscape({
            container: cy_contianer,
            layout: this.layout,
            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
            style: this.style,
            elements: this.elements,
            userZoomingEnabled: false,
        });


        // cy.svg(true)
        // console.log("cy:: ", cy._private.elements);

        // var dim = 12 / cy.zoom();
        // var maxDim = Math.max(dim, 2);
        // cy.nodes().css('font-size', maxDim);
        // cy.fit(cy.$(':selected'), 50);
        cy.fit();
        // cy.animation({ zoom: 1.5 }).play().promise().then(() => cy.animation({ fit: 1 }).play().promise())

        cy.on('click', 'node', (e: any) => {
            var node = e.target;
            // console.log("yes: ", node);

            // let edges = e.target.connectedEdges().map((edge:any) => edge.data().id)
            // console.log("here edges: ", edges);

            // var directlyConnectedNodes = node.neighborhood().nodes();
            // console.log("nodesHere2 All: ", directlyConnectedNodes);

            var neighborhood = node.neighborhood().add(node);
            // console.log("neighbr1: ", node.neighborhood().nodes());

            cy.elements().addClass('faded');
            neighborhood.removeClass('faded');
            localselect.emit(node.data('name'));

            var edge = node[0]._private.data;
            var allEdges = node[0]._private.edges;
            console.log("act: ", edge);
            console.log("allEdges: ", allEdges);

            if (edge.node_type == "target") {

                //Get the Edge_Type_ids Lists
                const regex = /[{}]/g;

                //////////////// get the pmid lists here /////////////////////
                // this.resultNodes = [];
                // this.loadingEdge = true;

                //First reset the edge selection area
                this.pubmedURLsDownloadLoader = '';
                this.pubmedURLsDownloadLoader = "<div class='overlay' style='margin-left:350px;margin-top:40px;'><img style='position:absolute' src='../../assets/images/loader_big.gif' /></div>";
                $("#pubmedURLsDownloadLoader").html(this.pubmedURLsDownloadLoader);
                $("#pubmedURLsDownload").html('');
                $("#pubmedURLs").html('');
                $("#umlsDataLists").html('');
                $("#umlsDataLists2").html('');
                $("#umlsDataListsRelation").html('');
                $("#pubmedEdgeNames").html('');
                // jQuery('#articles_details').bootstrapTable("load", "");

                ($('#myModalEdge') as any).modal('show');

                this.pubmedEdgeDetails = "";
                // this.pubmedEdgeDetails = "<div>";
                this.pubmedURLsDownload = "";

                var i = 0;
                // this.pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #BF63A2;">' + directlyConnectedNodes._private.eles[0]._private.data.name + '</div>';
                allEdges.forEach((element: any) => {
                    // this.pubmedEdgeDetails = "<div>";
                    // this.pubmedEdgeDetails += "</div>";
                    // console.log("pubmedEdgeDetails: ", this.pubmedEdgeDetails);
                    //Get the PMID lists
                    const edgeTypeNeIds = element._private.data.neIds;
                    const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
                    console.log("edgeTypeNeIdsPost: ", edgeTypeNeIdsPost);

                    this.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeTypeNeIdsPost }).subscribe(
                        data => {
                            // const legendsNodeTypes = [];
                            this.resultNodes = data;
                            this.edgeTypeNameData = this.resultNodes.pmidLists;
                            // console.log("edgeTypeNameData1: ", this.edgeTypeNameData);

                            if (this.edgeTypeNameData != undefined) {

                                // var PMIDList = edge.PMID.split(",");
                                var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                                // this.pubmedURLsDownload = "";

                                this.pubmedEdgeDetails += '<div class="source-details">';
                                this.pubmedEdgeDetails += '<div style="color: #BF63A2;"><strong>Source Name</strong></div>';
                                this.pubmedEdgeDetails += '<div style="padding-bottom:1px; color: #BF63A2;">' + element._private.source[0]._private.data.name + '</div>';
                                this.pubmedEdgeDetails += '<div style="color: #4B5DA1;"><strong>Destination Name</strong></div>';
                                this.pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #4B5DA1;">' + edge.name + '</div>';
                                this.pubmedEdgeDetails += "</div>";

                                this.pubmedEdgeDetails += "<div class='pmid-listing' style='overflow:auto;max-height:525px;border:1px solid;padding:2px 4px;'>";
                                this.edgeTypeNameData.forEach((PMID: any) => {
                                    // const myFormattedDate = this.pipe.transform(PMID.publication_date, 'short');
                                    // console.log("PMID:: ", PMID.edge_type_name);
                                    this.pubmedEdgeDetails += "<div class='pmid-single'>";
                                    this.pubmedEdgeDetails += "<p><strong>PMID: </strong><span><a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + PMID.pmid + "</a></span></p>";
                                    this.pubmedEdgeDetails += "<p><strong>Edge Type: </strong><span>" + PMID.edge_type_name + "</span></p>";
                                    this.pubmedEdgeDetails += "<p><strong>Title: </strong><span>" + PMID.title + "</span></p>";
                                    this.pubmedEdgeDetails += "<p><strong>Publication Date: </strong><span>" + PMID.publication_date + "</span></p>";

                                    this.pubmedEdgeDetails += "</div>";
                                });
                                // this.pubmedEdgeDetails += "<div style='clear: both;'><hr/></div>";
                                this.pubmedEdgeDetails += "</div>";

                            } else {
                                this.pubmedEdgeDetails = "<h4>No PMID Found..</h4>";
                                this.pubmedEdgeDetails += "<div style='clear: both;'><hr/></div>";
                            }
                            i++;
                        },
                        err => {
                            // this.loadingEdge = false;
                            console.log(err.message);
                        },
                        () => {
                            // $("#pubmedURLsDownload").html(this.pubmedURLsDownload);
                            // $("#pubmedEdgeNames").html(this.edgeNamesMultiple);
                            if (allEdges.length == i) {
                                $("#pubmedURLsDownloadLoader").html('');
                                //Initializer the loader for umlsLists after completing the pmids lists
                                this.loadingUmlsLoader = '';
                                this.loadingUmlsLoader = "<div class='overlay'><img src='../../assets/images/spinner_small_loader.gif' /></div>";
                                $("#loadingUmlsLoader").html(this.loadingUmlsLoader);

                                $("#pubmedURLs").html(this.pubmedEdgeDetails);

                            }
                            // this.loadingEdge = false;   
                        }
                    );
                });

                ////////////************ Get the Concept Ids Lists on basis of node Ids *************///////////////
                const NodeIds = edge.id;
                console.log("NodeIds: ", NodeIds);

                //Get the Node ids post and concepts ids
                this.nodeSelectsService.getConceptIdByNode({ 'node_ids': NodeIds }).subscribe(
                    data => {
                        this.conceptIds = data;
                        // console.log("New data: ", this.conceptIds.conceptIds);

                        this.umlsDataLists = "";
                        this.umlsDataLists += '<div class="conceptIdsWrapper">';
                        this.umlsDataLists += '<div class="me-2 text-black"></div>';
                        // this.umlsDataLists += '<div class="row rowUmls">';
                        // // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 text-dark inner"><strong>Concept Id</strong></div>';
                        // // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 text-dark inner"><strong>Name</strong></div>';
                        // // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 text-dark inner-end"><strong>Semantic Type Name</strong></div>';
                        // this.umlsDataLists += '</div>';

                        let j = 0;

                        this.conceptIds.conceptIds.forEach((element: any) => {
                            console.log("unique data: ", element);

                            this.loadingUmls = true;
                            this.error = "";
                            this.nodeSelectsService.getUmlsDataByConceptIds({ 'conceptIds': element.concept_id })
                                .subscribe(
                                    result => {
                                        this.umlsData = result;
                                        console.log("you full data here1: ", this.umlsData);

                                        if (!this.error) {
                                            const umlsName = this.umlsData.result.name;
                                            const symenticName = this.umlsData.result.semanticTypes[0].name;
                                            const atomURL = this.umlsData.result.atoms;
                                            this.umlsDataLists += '<div class="conceptIdBox"><button id="' + element.concept_id + '; ' + umlsName + '; ' + edge.name + '" class="conceptIDClick" value="' + element.concept_id + '">' + element.nuc_id + '</button></div>';
                                            // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 inner"><a href="https://uts-ws.nlm.nih.gov/rest/content/2023AB/CUI/' + element.concept_id + '/definitions?apiKey=b238480d-ef87-4755-a67c-92734e4dcfe8" target="_blank">' + element.concept_id + '</a></div>';
                                            // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 text-dark inner">' + umlsName + '</div>';
                                            // this.umlsDataLists += '<div class="col-lg-4 col-sm-6 col-xs-6 col-xxs-12 text-dark inner-end">' + symenticName + '</div>';
                                            j++;
                                        }
                                    },
                                    err => {
                                        this.loadingUmls = false;
                                        this.error = err;
                                        $("#loadingUmlsLoader").html('');
                                        $("#umlsDataLists").html('<h5 class="alert alert-warning">' + this.error + '</h5>');
                                        ($('#myModalEdge') as any).modal('show');
                                    },
                                    () => {
                                        if (!this.error) {
                                            this.loadingUmls = false;
                                            console.log("concept length: ", this.conceptIds.conceptIds.length);
                                            console.log("J length: ", j);
                                            if (this.conceptIds.conceptIds.length == j) {
                                                this.umlsDataLists += '</div>';
                                                // console.log("umlsDataLists: ", this.umlsDataLists);
                                                $("#loadingUmlsLoader").html('');
                                                $("#umlsDataLists").html(this.umlsDataLists);
                                                ($('#myModalEdge') as any).modal('show');
                                            }
                                        }
                                    });
                        });

                    },
                    err => {
                        this.loadingUmls = false;
                        console.log(err.message);
                    },
                    () => {
                        this.loadingUmls = false;
                    });

                // pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Edge Weight</strong></div>';
                // pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + edge.strength + '</div>';
                //this.pubmedEdgeDetails += "<hr style='color: #32404E;'/>";

                ////////////////************* Get the edge names lists **********///////////////
                // const edgeTypeIds = edge.edgeTypeIds;
                // const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
                // console.log("edgeTypeIdsPost: ", edgeTypeIdsPost);
                // this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe(
                //     data => {
                //         this.resultEdgeNames = data;
                //         // console.log("resultEdgeNames: ", this.resultEdgeNames);
                //         if (this.resultEdgeNames != undefined) {
                //             this.edgeNamesMultiple = "";
                //             this.edgeNamesMultiple = "<div>";
                //             this.edgeNamesMultiple += "<div style='font-size: 15px; font-weight:bold; color:#32404E'>Edge Types</div>";
                //             this.resultEdgeNames.forEach((EDGES: any) => {
                //                 this.edgeNamesMultiple += "<div style='font-size: 14px;color:#32404E'>" + EDGES.edge_type_name + "</div>";
                //             });
                //             this.edgeNamesMultiple += "<div style='clear: both;'><hr/></div>";
                //             this.edgeNamesMultiple += "</div>";
                //         } else {
                //             this.edgeNamesMultiple = "<h4>No EDGES Found..</h4>";
                //             this.edgeNamesMultiple += "<div style='clear: both;'><hr/></div>";
                //         }                               
                //     });

            }
        });

        //////////////// ******** edges are Shown here only difference between nodes and edges are show the source and destination name when you click on edges **********////////////////
        cy.on('tap', 'edge', (e: any) => {
            var edge = e.target._private.data;
            console.log("PMID: ", edge);

            var node = e.target;
            var neighborhood = node.neighborhood().add(node);

            cy.edges().addClass('faded');
            neighborhood.removeClass('faded');

            //Get the NE_IDs Lists
            const regex = /[{}]/g;
            const edgeTypeNeIds = edge.neIds;
            const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
            console.log("edgeTypeNeIdsPost: ", edgeTypeNeIdsPost);

            // let strArr = edge.edgeTypeNeIds.split(/[)]/);
            // // var strArr = edge.edgeTypeNeIds.split(')\", ');
            // console.log("edgeTypeNeIdsPost1: ", strArr); // gives ["15","16","17"];


            //Get the Edge_Type_ids Lists
            const edgeTypeIds = edge.edgeTypeIds;
            const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
            console.log("edgeTypeIdsPost: ", edgeTypeIdsPost);

            //////////////// get the pmid lists here /////////////////////
            // this.resultNodes = [];
            this.loadingEdge = true;

            //First reset the edge selection area
            this.pubmedURLsDownloadLoader = '';
            this.pubmedURLsDownloadLoader = "<div class='overlay' style='margin-left:350px;margin-top:40px;'><img style='position:absolute' src='../../assets/images/loader_big.gif' /></div>";
            $("#pubmedURLsDownloadLoader").html(this.pubmedURLsDownloadLoader);
            $("#loadingUmlsLoader").html('');
            $("#umlsDataLists").html('');
            $("#loadingUmlsLoader2").html('');
            $("#umlsDataLists2").html('');
            $("#umlsDataListsRelation").html('');
            $("#pubmedURLsDownload").html('');
            $("#pubmedURLs").html('');
            $("#pubmedEdgeNames").html('');
            ($('#myModalEdge') as any).modal('show');

            //Get the PMID lists
            this.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeTypeNeIdsPost }).subscribe(
                data => {
                    // const legendsNodeTypes = [];
                    this.resultNodes = data;
                    this.edgeTypeNameData = this.resultNodes.pmidLists;
                    // console.log("edgeTypeNameData1: ", this.edgeTypeNameData);

                    if (this.edgeTypeNameData != undefined) {

                        // var PMIDList = edge.PMID.split(",");
                        var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                        this.pubmedURLsDownload = "";

                        this.pubmedURLsDownload = "<div>";
                        this.edgeTypeNameData.forEach((PMID: any) => {

                            // const myFormattedDate = this.pipe.transform(PMID.publication_date, 'short');
                            // console.log("PMID:: ", PMID.edge_type_name);
                            this.pubmedURLsDownload += "<div style='list-style: none; font-size: 14px; color:#32404E'><strong>PMID: </strong> <a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + PMID.pmid + "</a></div>";
                            this.pubmedURLsDownload += "<div style='font-size: 14px;color:#32404E'><strong>Edge Type: </strong>" + PMID.edge_type_name + "</div>";
                            this.pubmedURLsDownload += "<div style='font-size: 14px;color:#32404E'><strong>Title: </strong>" + PMID.title + "</div>";
                            this.pubmedURLsDownload += "<div style='font-size: 14px; color:#32404E'><strong>Publication Date : </strong>" + PMID.publication_date + "</div>";
                            this.pubmedURLsDownload += "<hr style='color:#32404E'/>";
                        });
                        this.pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                        this.pubmedURLsDownload += "</div>";


                        // this.pubmedURLsDownload = "<div>";
                        // this.pubmedURLsDownload += "<div style='font-size: 15px; font-weight:bold; text-decoration:underline; color:#32404E'>Evidence Detail(s)</div>";
                        // this.pubmedURLsDownload += '<table class="table table-bordered border-secondary">';
                        // this.pubmedURLsDownload += "<tr>";
                        // this.pubmedURLsDownload += " <th>PMID</th> <th>Publication Date</th> <th>Evidence</th> ";
                        // this.pubmedURLsDownload += "</tr>";
                        // this.edgeTypeNameData.forEach((PMID: any) => {
                        //     this.pubmedURLsDownload += "<tr>";
                        //     this.pubmedURLsDownload += "<td><a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + PMID.pmid + "</a></td>";
                        //     this.pubmedURLsDownload += "<td>" + PMID.publication_date + "</td>";
                        //     this.pubmedURLsDownload += "<td>" + PMID.title + "</td>";

                        // const myFormattedDate = this.pipe.transform(PMID.publication_date, 'short');
                        // console.log("PMID:: ", PMID.edge_type_name);

                        //this.pubmedURLsDownload += "<div style='font-size: 14px;color:#32404E'>" + PMID.title + "</div>";
                        //this.pubmedURLsDownload += "<div style='list-style: none; font-size: 14px; color:#32404E'>PMID : <a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + PMID.pmid + "</a></div>";
                        //this.pubmedURLsDownload += "<div style='font-size: 14px; color:#32404E'>Publication Date : " + PMID.publication_date + "</div>";
                        //this.pubmedURLsDownload += "<hr style='color:#32404E'/>";
                        // });
                        // this.pubmedURLsDownload += "</table>";
                        // this.pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                        // this.pubmedURLsDownload += "</div>";


                    } else {
                        this.pubmedURLsDownload = "<h4>No PMID Found..</h4>";
                        this.pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                    }
                    // console.log("edgeTypeNameData5: ", pubmedURLsDownload);

                    /////////*************Get the edge names lists *************///////////////
                    // this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe(
                    //     data => {
                    //         this.resultEdgeNames = data;
                    //         // console.log("resultEdgeNames: ", this.resultEdgeNames);

                    //         if (this.resultEdgeNames != undefined) {
                    //             this.edgeNamesMultiple = "";
                    //             this.edgeNamesMultiple = "<div>";
                    //             this.edgeNamesMultiple += "<div style='font-size: 15px; font-weight:bold; color:#32404E'>Edge Types</div>";
                    //             this.resultEdgeNames.forEach((EDGES: any) => {
                    //                 this.edgeNamesMultiple += "<div style='font-size: 14px;color:#32404E'>" + EDGES.edge_type_name + "</div>";
                    //             });
                    //             this.edgeNamesMultiple += "<div style='clear: both;'><hr/></div>";
                    //             this.edgeNamesMultiple += "</div>";
                    //         } else {
                    //             this.edgeNamesMultiple = "<h4>No EDGES Found..</h4>";
                    //             this.edgeNamesMultiple += "<div style='clear: both;'><hr/></div>";
                    //         }
                    //     });
                },
                err => {
                    this.loadingEdge = false;
                    console.log(err.message);
                },
                () => {
                    this.loadingEdge = false;

                    var sourceData = e.target._private.source._private.data;
                    var targetData = e.target._private.target._private.data;

                    this.pubmedEdgeDetails;
                    this.pubmedEdgeDetails = "<div>";
                    this.pubmedEdgeDetails += '<div style="color: #BF63A2;"><strong>Source Name</strong></div>';
                    this.pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #BF63A2;">' + sourceData.name + '</div>';
                    this.pubmedEdgeDetails += '<div style="color: #4B5DA1;"><strong>Destination Name</strong></div>';
                    this.pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #4B5DA1;">' + targetData.name + '</div>';
                    // pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Edge Weight</strong></div>';
                    // pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + edge.strength + '</div>';
                    //this.pubmedEdgeDetails += "<hr style='color: #32404E;'/>";
                    this.pubmedEdgeDetails += "</div>";

                    console.log("pubmedEdgeDetails: ", this.pubmedEdgeDetails);
                    $("#pubmedURLsDownloadLoader").html('');
                    $("#pubmedURLsDownload").html(this.pubmedURLsDownload);
                    $("#pubmedURLs").html(this.pubmedEdgeDetails);
                    // $("#pubmedEdgeNames").html(this.edgeNamesMultiple);
                    ($('#myModalEdge') as any).modal('show');
                });
        });

        ////////// OLD when click the nodes show in popup
        // cy.on('cxttap', 'node', (e: any) => {
        //     var node = e.target;

        //     var neighborhood = node.neighborhood().add(node);
        //     // console.log("neighbr1: ", node.neighborhood().nodes());

        //     cy.elements().addClass('faded');
        //     neighborhood.removeClass('faded');
        //     localselect.emit(node.data('name'));

        //     var TargetNode = node[0]._private.data;
        //     console.log("act: ", node[0]._private.data);
        //     var directlyConnectedNodes = node.neighborhood().nodes();
        //     console.log("nodesHere: ", directlyConnectedNodes);
        //     // $("#nodeDetails").html("");
        //     this.nodeDetails = "<div class='overlay'><img style='position:absolute' src='../../assets/images/loader_big.gif' /></div>";
        //     $("#nodeDetails").html(this.nodeDetails);

        //     if (directlyConnectedNodes != undefined) {
        //         var nodeDetails = "";

        //         nodeDetails += "<div style='float:left;'>";
        //         nodeDetails += '<div style="padding: 5px; color:#BF63A2"><strong>' + TargetNode.name + '</strong></div>';
        //         nodeDetails += '<div style="padding: 5px;"><strong>Node Type: ' + TargetNode.node_type + '</strong></div>';
        //         nodeDetails += '<div style="padding: 5px;"><strong>Connections: </strong></div>';

        //         nodeDetails += '<input type="text" id="searchInput" autocomplete="off" class="SearchConnectionIDClick" placeholder="&#xf002; Search for connections..">';
        //         // nodeDetails += '<input type="text" id="searchInput" autocomplete="off" class="SearchConnectionIDClick" onkeyup="searchConnections()" placeholder="&#xf002; Search for connections..">';

        //         nodeDetails += "<ul style='padding: 2px 18px;' id='myUL'>";
        //         directlyConnectedNodes.forEach((directlyConnectedNode: any) => {
        //             // window.gv = directlyConnectedNode;
        //             console.log("inner: ", directlyConnectedNode);
        //             // console.log("inner: ", gv);
        //             // const el = document.getElementById("nodeClick");
        //             // el?.addEventListener("onclick", this.nodeClickEvent);
        //             nodeDetails += "<li style='list-style: initial; color:" + directlyConnectedNode._private.data.colorCode + "'><a id='" + directlyConnectedNode._private.data.id + "' class='nodeIdClick'>" + directlyConnectedNode._private.data.name + "</a></li>"; //22509 -HSP90 molecular
        //         });
        //         nodeDetails += "</ul>";
        //         nodeDetails += "</div>";

        //         $("#nodeDetails").html(nodeDetails);
        //     } else {
        //         $("#nodeDetails").html("");
        //     }
        //     ($('#myModalNode') as any).modal('show');
        //     // this.showNodeInfo(node[0]._private.data.id); //append the node and reload the graph
        // });

        // cy.on('cxttap', 'node', (e: any) => {
        //     var node = e.target;
        //     // console.log("rightclick: ", node[0]._private.data.id);
        //     this.showNodeInfo(node[0]._private.data.id); //append the node and reload the graph
        // });

        // cy.on('click', function (e: any) {
        //     if (e.target === cy || e.target.group() == "edges") {
        //         console.log("here edges: ", e.target.group());
        //         cy.edges().addClass('highlighted');
        //     }
        //     else {
        //         console.log("here edges2: ");
        //         // cy.edges("[source='" + e.target.id() + "']").addClass('highlighted');
        //         cy.edges("[source='" + e.target.id() + "']").style('lineColor', "#AF0000");
        //     }
        // });

        // cy.on("tap", "node", (evt: any) => {
        //     evt.target.connectedEdges().animate({
        //         style: { lineColor: "red" }
        //     })
        // });

        cy.on('tap', function (e: any) {
            if (e.target === cy) {
                cy.edges().removeClass('highlighted');
                cy.elements().removeClass('faded');
            } else {
                // cy.edges("[source='" + e.target.id() + "']").style('lineColor', "#AF0000");
                // e.target.connectedEdges().animate({
                //     style: { lineColor: "red" }
                // })
            }
        })

        cy.on('mouseover', 'node', function (event: any) {
            var evtTarget = event.target;
            if (evtTarget !== cy) {
                // console.log("Mouse Over");
                evtTarget.style('border-width', '2px').style('border-color', "#AF0000");
            }
            evtTarget.qtip({
                content: event.target._private.data.name,
                show: {
                    event: event.type,
                    ready: true,
                    solo: true
                },
                hide: {
                    // event: 'mouseout'
                }
            }, event);
        }).on('mouseout', function (event: any) {
            var evtTarget = event.target;
            if (evtTarget !== cy) {
                // console.log("Fired");
                evtTarget.style('border-width', '0px');
            }
        });

        // cy.on('mouseover', 'node', (e: any) => {
        //     var node = e.target;
        //     // console.log("actRight: ", node[0]._private.data);
        //     let node_ids = parseInt(node[0]._private.data.id);
        //     // console.log("nodeIds: ", node_ids);

        //     node.qtip({
        //         content: e.target._private.data.name,
        //         show: {
        //             event: e.type,
        //             ready: true,
        //             solo: true
        //         },
        //         hide: {
        //             // event: 'mouseout'
        //         }
        //     }, e);
        // });

        //document.getElementById("#btnsave").addEventListener ("click", nodeClickEvent, false);

        // --- Map Download Begins ---
        var png64 = cy.png();
        $('#download_btn').on("click", function (ev) {
            //debugger;
            $('#png-eg').attr('src', png64);
            console.log(png64);
            var a = $("<a>")
                .attr("href", png64)
                .attr("download", "evolver_map.png")
                .appendTo("body");

            a[0].click();
            a.remove();
            $('#png-eg').removeAttr('src');
            //$('#png-eg').hide();
        });
        // --- Map Download Ends ---

        $("#zoomSwitch").on("change", function () {
            if ($("#zoomSwitch").is(":checked")) {
                cy.userZoomingEnabled(true);
            } else {
                cy.userZoomingEnabled(false);
            }
            //console.log("Zoom in .... out"+cy.userZoomingEnabled);
        });


    }

    public showNodeInfo(nodeId: any) {
        // var nodeId: any = $(nodeId);
        console.log("nodeId: ", nodeId);

        // this.checkedNodes = Array.from(this.globalVariableService.getSelectedSourceNodes()); //get the existing node id
        // this.checkedNodes.push(parseInt(nodeId));  // and append the selecting nodeid
        // this.globalVariableService.setSelectedSourceNodes(this.checkedNodes);
        // console.log("select2: ", this.checkedNodes);
        // this.onGraphSelection.emit();

        // this.checkedNodes = Array.from(this.globalVariableService.getSelectedNodes()); //get the existing node id
        // this.checkedNodes.push(parseInt(nodeId));  // and append the selecting nodeid
        // this.globalVariableService.setSelectedNodes(this.checkedNodes);
        // console.log("node id append: ", this.checkedNodes);

        // this.checkedNodes = Array.from(this.globalVariableService.getSelectedNodes()); //get the existing node id
        // this.checkedNodes.push(parseInt(nodeId));  // and append the selecting nodeid
        this.globalVariableService.setSelectedNodes(nodeId);
        // console.log("node id append: ", this.checkedNodes);

        this.filterParams = this.globalVariableService.getFilterParams();
        console.log("node id append:: ", this.filterParams);

        this.onGraphSelection.emit();

        // this.node_name = "piyush";
        // this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
    }

    nodeClickEvent = function () {
        console.log("test: ");
    }

    // @HostListener('document:dblclick', ['$event.target'])
    // @HostListener('document:click', ['$event.target']) onClick(target: any) {

    @HostListener('document:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        // console.log("event1: ", event);
        // console.log("event2: ", event.target);
        const inputValue = (event.target as any).value;
        const inputValue1 = (event.target as any).classList.value;

        if (inputValue1 == "SearchConnectionIDClick") {
            // Declare variables
            var input: any, filter: any, ul: any, li: any, a: any, i: any, txtValue: any;
            // input = document.getElementById('searchInput');
            input = inputValue;
            // filter = input.value.toUpperCase();
            filter = input.toUpperCase();
            console.log("filter: ", filter);

            ul = document.getElementById("myUL");
            console.log("UL: ", ul);
            li = ul.getElementsByTagName('li');
            console.log("LI: ", li.length);
            // Loop through all list items, and hide those who don't match the search query
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                txtValue = a.textContent || a.innerText;
                console.log("txtValue: ", txtValue);
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        }
    }

    // searchConnections22 = () => {

    // searchConnections = function () {
    //     console.log("sdfsfs");
    //     // Declare variables
    //     var input: any, filter: any, ul: any, li: any, a: any, i: any, txtValue: any;
    //     input = document.getElementById('searchInput');
    //     // input = target.id;
    //     filter = input.value.toUpperCase();
    //     console.log("filter: ", filter);

    //     ul = document.getElementById("myUL");
    //     console.log("UL: ", ul);
    //     li = ul.getElementsByTagName('li');
    //     console.log("LI: ", li.length);
    //     // Loop through all list items, and hide those who don't match the search query
    //     for (i = 0; i < li.length; i++) {
    //         a = li[i].getElementsByTagName("a")[0];
    //         txtValue = a.textContent || a.innerText;
    //         console.log("txtValue: ", txtValue);
    //         if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //             li[i].style.display = "";
    //         } else {
    //             li[i].style.display = "none";
    //         }
    //     }
    // }

    // @HostListener('document:dblclick', ['$event.target'])
    @HostListener('document:click', ['$event.target']) onClick(target: any) {
        // event.preventDefault();
        console.log("concept click: ", target.classList.contains('conceptIDClick'));
        console.log("node click: ", target.classList.contains('nodeIdClick'));

        // console.log("22: ", target.classList.contains('searchConnectionIDClick'));
        // console.log("2 here1: ", target.id);

        if (target.classList.contains('nodeIdClick')) {
            console.log("2 here node click: ", target.id);
            this.showNodeInfo(target.id); //append the node and reload the graph
        }

        if (target.classList.contains('conceptIDClick')) {
            console.log("2 here concept id click: ", target.id);
            const splitByIdName = target.id.split("; ");
            // console.log("22 here by concept id: ", splitByIdName[0]);
            // console.log("22 here by concept name: ", splitByIdName[1]);
            // console.log("destination name: ", splitByIdName[2]);

            $("#umlsDataLists2").html('');
            // jQuery('#articles_details').bootstrapTable({});
            this.error = "";
            this.loadingUmlsLoader2 = '';
            this.loadingUmlsLoader2 = "<div class='overlay'><img src='../../assets/images/spinner_small_loader.gif' /></div>";
            $("#loadingUmlsLoader2").html(this.loadingUmlsLoader2);

            let k = 0;
            this.nodeSelectsService.getUmlsDataDefintionsByConceptIds({ 'conceptIds': splitByIdName[0] }).subscribe(
                result => {
                    let umlsDefintionAllData: any = result;
                    console.log("you full data here2: ", umlsDefintionAllData);

                    let vocabalary = ['ATC', 'CCSR_ICD10CM', 'CCSR_ICD10PCS', 'CPT', 'CVX', 'DRUGBANK', 'GO', 'GS',
                        'HCDT', 'HCPCS', 'HCPT', 'HGNC', 'HL7V3.0', 'HPO', 'ICD10CM', 'ICD10PCS', 'ICNP', 'LNC', 'MDR',
                        'MED-RT', 'MEDCIN', 'MEDLINEPLUS', 'MMSL', 'MMX', 'MSH', 'MTHCMSFRF', 'MTHSPL', 'MVX', 'NCBI',
                        'NCI', 'NDDF', 'NEU', 'NUCCHCPT', 'OMIM', 'ORPHANET', 'RXNORM', 'SNOMEDCT_US', 'SNOMEDCT_VET', 'UMD', 'USP', 'VANDF'];

                    //Check the vocabulary here and filter with them
                    this.umlsDefintionData = umlsDefintionAllData.result.filter((item: any) => vocabalary.includes(item.rootSource));
                    console.log("res: ", this.umlsDefintionData);

                    this.umlsDataLists2 = '';
                    if (!this.error) {
                        /////////////////////// Definitions ///////////////////
                        this.umlsDataLists2 += '<div class="accordion" id="accordionDifinition">';
                        this.umlsDataLists2 += '<div class="accordion-item">';
                        this.umlsDataLists2 += '<h2 class="accordion-header" id="headingOne"><button class="accordion-button p-2 collapsed no-shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDefinition" aria-expanded="true" aria-controls="collapseDefinition">Definitions of ' + splitByIdName[2] + '</button></h2>';
                        this.umlsDataLists2 += '<div id="collapseDefinition" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionDifinition"><div class="accordion-body" style="max-height:400px;overflow:auto">';
                        // this.umlsDataLists2 += '<div class="container" style="overflow: auto;max-height:400px;border: 1px solid;padding: 8px;">';
                        // this.umlsDataLists2 += '<div class="row rowUmls">';
                        // this.umlsDataLists2 += '<div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12 text-dark inner"><strong>Root Source</strong></div>';
                        // this.umlsDataLists2 += '<div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12 text-dark inner"><strong>Value</strong></div>';
                        // // this.umlsDataLists2 += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner"><strong>Class Type</strong></div>';
                        // this.umlsDataLists2 += '</div>';

                        for (let i = 0; i < this.umlsDefintionData.length; i++) {
                            // this.umlsDataLists2 += '<div class="row rowUmlsInner">';
                            // this.umlsDataLists2 += '<div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12 text-dark inner">' + this.umlsDefintionData[i].rootSource + '</div>';
                            // this.umlsDataLists2 += '<div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12 text-dark inner">' + this.umlsDefintionData[i].value + '</div>';
                            // // this.umlsDataLists2 += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner-end">' + this.umlsDefintionData[i].classType + '</div>';
                            // this.umlsDataLists2 += '</div>';

                            this.umlsDataLists2 += "<div>";
                            this.umlsDataLists2 += "<div style='list-style: none; font-size: 14px; color:#32404E'><strong>Root Source: </strong>" + this.umlsDefintionData[i].rootSource + "</a></div>";
                            this.umlsDataLists2 += "<div style='font-size: 14px;color:#32404E'><strong>Value: </strong>" + this.umlsDefintionData[i].value + "</div>";
                            this.umlsDataLists2 += "<hr style='color:#32404E'/>";
                            this.umlsDataLists2 += "</div>";
                            k++;
                        }
                        // this.umlsDataLists2 += "<div style='clear: both;'><hr/></div>";
                        if (this.umlsDefintionData.length == k) {
                            this.umlsDataLists2 += '</div>';
                            this.umlsDataLists2 += '</div>';
                            this.umlsDataLists2 += '</div>';
                            this.umlsDataLists2 += '</div>';
                        }
                    }
                },
                err => {
                    // this.loadingUmls = false;
                    this.error = err;
                    $("#loadingUmlsLoader2").html('');
                    $("#umlsDataLists2").html('<h5 class="alert alert-warning">' + this.error + '</h5>');
                    ($('#myModalEdge') as any).modal('show');
                },
                () => {
                    $("#loadingUmlsLoader2").html('');
                    $("#umlsDataLists2").html(this.umlsDataLists2);
                    ($('#myModalEdge') as any).modal('show');
                });
            //////////////End here for defintions

            ////////////////////// Start Relations //////////////////////
            $("#umlsDataListsRelation").html("");

            this.nodeSelectsService.getUmlsDataAtomsByConceptIds({ 'conceptIds': splitByIdName[0] }).subscribe(
                result => {
                    let umlsRootSourceByCodeUrl: any = result;
                    console.log("umls Root Source By Code Url: ", umlsRootSourceByCodeUrl);

                    let modelAtoms = ['NCI', 'SNOMEDCT_US', 'MSH', 'RXNORM'];
                    //Check the vocabulary here and filter with them
                    this.umlsRelationsByCodeUrl = umlsRootSourceByCodeUrl.result.filter((item: any) => modelAtoms.includes(item.rootSource));
                    console.log("res by code: ", this.umlsRelationsByCodeUrl);

                    //Here to get the relation by atom loop by rootSource Filters
                    this.umlsDataListsRelation = '';
                    if (this.umlsRelationsByCodeUrl.length > 0) {

                        this.umlsDataListsRelation += '<div class="accordion" id="accordionRelation">';
                        this.umlsDataListsRelation += '<div class="accordion-item">';
                        this.umlsDataListsRelation += '<h2 class="accordion-header" id="accRelMainHead"><button class="accordion-button p-2 collapsed no-shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRelation" aria-expanded="true" aria-controls="collapseRelation">Relations</button></h2>';
                        this.umlsDataListsRelation += '<div id="collapseRelation" class="accordion-collapse collapse" aria-labelledby="accRelMainHead" data-bs-parent="#accordionRelation"><div class="accordion-body" style="max-height:400px;overflow:auto">';
                        // this.umlsDataListsRelation = '<div class="row text-dark mt-3"><h5>Relations</h5></div>';
                        // this.umlsDataListsRelation += '<div class="container" style="overflow:auto;max-height:400px; border:1px solid;">';

                        let k = 0;
                        this.umlsRelationsByCodeUrl.forEach((element: any, index: any) => {
                            console.log("new index: ", index);
                            console.log("atoms unique data: ", element);

                            let l = 0;
                            // this.loadingUmls = true;
                            this.error = "";
                            this.nodeSelectsService.getUmlsDataRelationsByConceptIds({ 'codeUrl': element.code })
                                .subscribe(
                                    result => {

                                        let umlsDataByRelation: any = result;
                                        console.log("final relations data: ", umlsDataByRelation);

                                        this.umlsRelationData = umlsDataByRelation.result.filter((item: any) => modelAtoms.includes(item.rootSource));
                                        console.log("res code final relations: ", this.umlsRelationData);

                                        ////////////////////// Relations //////////////////////
                                        // this.umlsDataListsRelation += '<div class="row rowUmls">';
                                        // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner"><strong>Source</strong></div>';
                                        // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner"><strong>Destination</strong></div>';
                                        // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner"><strong>Relation</strong></div>';
                                        // this.umlsDataListsRelation += '</div>';

                                        this.umlsDataListsRelation += "<div class='accordion' id='accordionRelationChild'>";
                                        this.umlsDataListsRelation += "<div class='accordion-item mb-2'>";
                                        this.umlsDataListsRelation += "<h2 class='accordion-header' id='accRelChildHead'><button class='accordion-button p-2 collapsed no-shadow' type='button' data-bs-toggle='collapse' data-bs-target='#collapseRelationChild" + index + "' aria-expanded='true' aria-controls='collapseRelationChild'>" + element.rootSource + " ( " + element.name + ")" + "</button></h2>";
                                        this.umlsDataListsRelation += "<div id='collapseRelationChild" + index + "' class='accordion-collapse collapse' aria-labelledby='accRelChildHead' data-bs-parent='#accordionRelationChild'><div class='accordion-body'>";

                                        for (let i = 0; i < this.umlsRelationData.length; i++) {
                                            this.umlsDataListsRelation += "<div>";
                                            this.umlsDataListsRelation += "<div style='list-style: none; font-size: 14px; color:#32404E;padding-bottom: 5px;padding-top:5px;border-bottom:1px solid #ddd'><strong class='badge' style='background-color:#DAAfff;margin-right:12px;'>" + splitByIdName[1] + "</strong><strong class='badge' style='background-color:#6fb654;margin-right:12px;'>" + this.umlsRelationData[i].additionalRelationLabel + "</strong><strong class='badge' style='background-color:#FF8787;'>" + this.umlsRelationData[i].relatedIdName + "</strong></div>";
                                            this.umlsDataListsRelation += "</div>";

                                            // this.umlsDataListsRelation += '<div class="row rowUmlsInner">';
                                            // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner">' + splitByIdName[1] + '</div>';
                                            // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner">' + this.umlsRelationData[i].relatedIdName + '</div>';
                                            // this.umlsDataListsRelation += '<div class="col-lg-4 col-sm-4 col-xs-4 col-xxs-12 text-dark inner-end">' + this.umlsRelationData[i].additionalRelationLabel + '</div>';
                                            // this.umlsDataListsRelation += '</div>';
                                            l++;
                                        }
                                        // console.log("First: ", this.umlsRelationData.length);
                                        // console.log("l size: ", l);
                                        // this.umlsDataListsRelation += "<div style='clear: both;'><hr/></div>";
                                        if (this.umlsRelationData.length == l) {
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                        }
                                        //////////////// End here for relations
                                        k++;
                                    },
                                    err => {
                                        // this.loadingUmls = false;
                                        this.error = err;
                                        $("#loadingUmlsLoader2").html('');
                                        $("#umlsDataListsRelation").html('<h5 class="alert alert-warning">' + this.error + '</h5>');
                                        ($('#myModalEdge') as any).modal('show');
                                    },
                                    () => {
                                        $("#loadingUmlsLoader2").html('');
                                        // console.log("total Relation Data: ", this.umlsDataLists2);

                                        // console.log("new1: ", this.umlsRelationsByCodeUrl.length);
                                        // console.log("new2: ", k);

                                        if (this.umlsRelationsByCodeUrl.length == k) {
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                            this.umlsDataListsRelation += '</div>';
                                        }

                                        $("#umlsDataListsRelation").html(this.umlsDataListsRelation);
                                        ($('#myModalEdge') as any).modal('show');
                                    });
                        });
                    } else {
                        $("#loadingUmlsLoader2").html('');
                        $("#umlsDataListsRelation").html('<h5 class="alert alert-warning">No any relation found..</h5>');
                        ($('#myModalEdge') as any).modal('show');
                    }
                },
                err => {
                    // this.loadingUmls = false;
                    this.error = err;
                    $("#loadingUmlsLoader2").html('');
                    $("#umlsDataListsRelation").html('<h5 class="alert alert-warning">' + this.error + '</h5>');
                    ($('#myModalEdge') as any).modal('show');
                },
                () => {
                    // $("#loadingUmlsLoader2").html('');
                    // $("#umlsDataLists2").html(this.umlsDataLists2);
                    // ($('#myModalEdge') as any).modal('show');
                }
            );
        }
    }

    // @HostListener('document:click', ['$event', '$event.target'])
    // onClick(event: MouseEvent, targetElement: HTMLElement): void {
    //     if (!targetElement) {
    //         console.log("inside1: ", targetElement);
    //     }else{
    //         console.log("inside2: ", targetElement);
    //     }
    //     const clickedInside = this.el.nativeElement.contains(targetElement);
    //     if (!clickedInside) {
    //         console.log("inside3: ", clickedInside);
    //     }else{
    //         console.log("inside4: ", clickedInside);
    //     }
    // }

}
