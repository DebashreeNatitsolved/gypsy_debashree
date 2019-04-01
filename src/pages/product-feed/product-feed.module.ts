import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductFeedPage } from './product-feed';

@NgModule({
  declarations: [
    ProductFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductFeedPage),
  ],
})
export class ProductFeedPageModule {}
