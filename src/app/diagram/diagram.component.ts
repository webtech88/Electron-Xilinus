import * as _ from 'lodash';
import * as d3 from 'd3';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit
} from '@angular/core';

import { APIService } from '../core/api.service';
import { UtilService } from '../core/util.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef;

  svg: any;
  bubbles: any;
  tooltip = null;
  tx = 0;
  ty = 0;
  width: number;
  height: number;
  data: any;
  canInit = 0;
  allView = true;
  simulation: any;
  grouptext: any;
  allNetworks: any;
  fillColor: any;
  loading = true;

  constructor(private zone: NgZone, private api: APIService, private util: UtilService) {
    this.api.getDiagramData()
      .subscribe(data => {
        this.data = data;
        this.loading = false;
        this.allNetworks = this.getAllNetworkTypes(this.data);
        this.initDiagram();
      });
  }

  ngAfterViewInit() {
    this.initDiagram();
  }

  initDiagram() {
    this.canInit ++;
    if (this.canInit !== 2) {
      return;
    }
    const width = this.container.nativeElement.clientWidth,
          height = this.container.nativeElement.clientHeight,
          forceStrength = 0.035;
    this.width = width;
    this.height = height;

    const charge = d => -Math.pow(d.radius, 2.0) * forceStrength;

    this.simulation = d3.forceSimulation()
      .velocityDecay(0.1)
      .force('x', d3.forceX().strength(forceStrength).x((d: any) => {
        if ( !this.allView ) {
          return this.getXposition(this.allNetworks.indexOf(d.networkType));
         } else {
           return width / 2;
         }
      }))
      .force('y', d3.forceY().strength(forceStrength).y(height / 2))
      .force('charge', d3.forceManyBody().strength(charge))
      .on('tick', () => this.ticked());

    this.simulation.stop();

    this.fillColor = d3.scaleOrdinal()
      .domain(this.allNetworks)
      .range(d3.schemeCategory20);

    const nodes = this.formatData(this.data);

    this.svg = d3.select(this.container.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.bubbles = this.svg.selectAll('.bubble')
      .data(nodes, d => d.key);

    const bubblesE = this.bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', d => this.fillColor(d.networkType))
      .attr('stroke', d => d3.rgb(<d3.ColorCommonInstance>this.fillColor(d.networkType)).darker())
      .attr('stroke-width', 2)
      .on('mouseenter', (data) => this.showDetail(data))
      .on('mouseout', () => this.hideDetail());

    this.bubbles = this.bubbles.merge(bubblesE);
    this.bubbles.transition()
      .duration(2000)
      .attr('r', d => d.radius);

    this.simulation.nodes(nodes);
    this.simulation.alpha(1).restart();
  }

  formatData(data: any) {
    const maxAmount = d3.max(data.aggregations.terms.buckets, (bucket: any) => +bucket.bytes.value);
    const radiusScale = d3.scalePow()
      .exponent(0.3)
      .range([5, 100])
      .domain([0, maxAmount]);

    const width = this.container.nativeElement.clientWidth,
          height = this.container.nativeElement.clientHeight;

    const count = data.aggregations.terms.buckets.length;

    const nodes = data.aggregations.terms.buckets.map((bucket, i) => ({
      key: bucket.key,
      networkType: bucket.top_hit.hits.hits[0]._source.networkType[0] ? bucket.top_hit.hits.hits[0]._source.networkType[0] : 'Unknown',
      size: this.util.formatBytes(bucket.bytes.value, 2),
      radius: Math.round(radiusScale(+bucket.bytes.value)),
      x: Math.random() * width,
      y: height / 2
    }));

    return nodes;
  }

  getXposition(index) {
    const width = this.container.nativeElement.clientWidth;
    let x = 0;
    x = width / (this.allNetworks.length + 1);
    x = x * (index + 1);
    return x;
  }

  hideDetail() {
    this.zone.run(() => {
      this.tooltip = null;
    });
  }

  getAllNetworkTypes(data): string[] {
    return _.uniq(data.aggregations.terms.buckets.map(
      bucket => bucket.top_hit.hits.hits[0]._source.networkType[0] || 'Unknown'
    ));
  }

  showDetail(data) {
    this.zone.run(() => {
      this.tx = data.x + 16;
      this.ty = data.y + 66 - data.radius;
      this.tooltip = data;
    });
  }

  ticked() {
    if (this.bubbles) {
      const midx = {};
      this.bubbles
        .attr('cx', d => {
          if (midx[d.networkType]) {
            midx[d.networkType][0] += d.x;
            midx[d.networkType][1] ++;
          } else {
            midx[d.networkType] = [d.x, 1];
          }
          return d.x;
        })
        .attr('cy', d => d.y );

      if (this.grouptext) {
        this.grouptext
          .attr('x', d => ( midx[d][0] / midx[d][1] ) - ( d.length * 12 / 2 ) );
      }
    }
  }

  changeView(v) {
    if ( this.allView !== v ) {
      this.allView = v;
      const width = this.container.nativeElement.clientWidth,
                    forceStrength = 0.035;
      this.simulation
        .force('x', d3.forceX().strength(forceStrength).x((d: any) => {
          if ( !this.allView ) {
            return this.getXposition(this.allNetworks.indexOf(d.networkType));
           } else {
             return width / 2;
           }
        }));
      this.simulation.alpha(1).restart();

      if (!this.allView) {
        this.grouptext = this.svg.selectAll('group-text')
          .data(this.allNetworks);
        const ge = this.grouptext
          .enter()
          .append('text')
          .text(d => d)
          .attr('fill', d => d3.rgb(<d3.ColorCommonInstance>this.fillColor(d)).darker())
          .attr('font-weight', 700)
          .attr('x', d => this.getXposition(this.allNetworks.indexOf(d)))
          .attr('y', 100);
        this.grouptext = this.grouptext.merge(ge);
      } else {
        this.grouptext
          .data([])
          .exit()
          .remove();
      }
    }
  }

  resizeView() {
    const width = this.container.nativeElement.clientWidth,
          height = this.container.nativeElement.clientHeight,
          forceStrength = 0.035;
    this.simulation
      .force('x', d3.forceX().strength(forceStrength).x((d: any) => {
        if ( !this.allView ) {
         return this.getXposition(this.allNetworks.indexOf(d.networkType));
        } else {
          return width / 2;
        }
      }))
      .force('y', d3.forceY().strength(forceStrength).y(height / 2));

    this.svg
      .attr('width', width)
      .attr('height', height);
    this.simulation.alpha(1).restart();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: UIEvent) {
    setTimeout(() => this.resizeView(), 0);
  }
}


