import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractDetailComponent } from './Components/contract-detail/contract-detail.component';
import { ContractListComponent } from './Components/contract-list/contract-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'contract-detail/:contractId',component:ContractDetailComponent },
  { path: 'contract-list',component:ContractListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
