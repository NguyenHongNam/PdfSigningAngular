import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { ContractDetailComponent } from './Components/contract-detail/contract-detail.component';
import { ContractListComponent } from './Components/contract-list/contract-list.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NzFormModule } from 'ng-zorro-antd/form';
registerLocaleData(vi);

@NgModule({
  declarations: [
    AppComponent,
    ContractDetailComponent,
    ContractListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzTableModule,
    NzLayoutModule,
    NzDividerModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    PdfViewerModule,
    NzUploadModule,
    NzMessageModule,
    NgxExtendedPdfViewerModule,
    NzNotificationModule,
    DragDropModule,
    NzFormModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
