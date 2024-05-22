import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Contract } from '../Models/Contract';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'https://localhost:7277/Contract';
  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    const contractsUrl = `${this.baseUrl}/get`;

    return this.http.get(contractsUrl).pipe(
      map((response: any) => {
        return response as Contract[];
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  generatePdf(contractId: any){
    return this.http.get('https://localhost:7277/Contract/'+contractId, {observe:'response', responseType:'blob'})
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/upload`, formData, { headers });
  }

  signContract(contractId: number, signatures: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign/${contractId}`, signatures);
  }

  download(contractId: number, isSigned: boolean): Observable<void> {
    const url = `${this.baseUrl}/${contractId}?isSigned=${isSigned}`;
    
    // Set the responseType to 'arraybuffer' to handle binary data
    return this.http.get(url, { responseType: 'arraybuffer' })
      .pipe(
        // Process the response and trigger file download
        map(data => {
          const blob = new Blob([data], { type: 'application/pdf' });

          // Trigger file download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'signed_contract.pdf';
          link.click();
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  getContractDetails(contractId: number): Observable<Contract> {
    const contractDetailsUrl = `${this.baseUrl}/getDetails/${contractId}`;

    return this.http.get(contractDetailsUrl).pipe(
      map((response: any) => {
        return response as Contract;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

}
