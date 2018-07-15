import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramComponent } from './diagram.component';

@NgModule({
  imports: [
    CommonModule,
    DiagramRoutingModule,
    SharedModule
  ],
  declarations: [DiagramComponent]
})
export class DiagramModule { }
