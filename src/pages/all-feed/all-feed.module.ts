import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllFeedPage } from './all-feed';

@NgModule({
  declarations: [
    AllFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(AllFeedPage),
  ],
})
export class AllFeedPageModule {}
