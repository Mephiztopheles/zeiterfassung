import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StundenzettelListeComponent} from './stundenzettel-liste/stundenzettel-liste.component';
import {FormsModule} from "@angular/forms";
import {DauerPipe} from './dauer.pipe';
import {HttpModule} from "@angular/http";
import {DateTimePickerModule} from "ng-pick-datetime";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    StundenzettelListeComponent,
    DauerPipe
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule, DateTimePickerModule, BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
