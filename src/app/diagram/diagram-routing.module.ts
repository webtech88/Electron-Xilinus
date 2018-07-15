import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagramComponent } from './diagram.component';

const routes: Routes = [
  {
    path: '',
    component: DiagramComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagramRoutingModule { }
