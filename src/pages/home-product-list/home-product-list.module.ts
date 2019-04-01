import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeProductListPage } from './home-product-list';

@NgModule({
  declarations: [
    HomeProductListPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeProductListPage),
  ],
})
export class HomeProductListPageModule {}
