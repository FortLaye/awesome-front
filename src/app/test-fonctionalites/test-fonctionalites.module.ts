import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestFonctionalitesRoutingModule } from './test-fonctionalites-routing.module';
import { TestComponent } from './components/test/test.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TestFonctionalitesRoutingModule
  ]
})
export class TestFonctionalitesModule { }
