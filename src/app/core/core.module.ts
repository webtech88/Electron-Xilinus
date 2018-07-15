import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { APIService } from './api.service';
import { UtilService } from './util.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule
  ],
  declarations: [HeaderComponent],
  providers: [APIService, UtilService],
  exports: [HeaderComponent]
})
export class CoreModule { }
