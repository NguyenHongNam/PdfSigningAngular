import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Signature } from '../Models/Signature';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureServiceService {

  private baseUrl: string = 'https://localhost:7277/Contract';
  constructor(private http: HttpClient) { }

addSignatures(contractId: number, signatures: Signature[]): Observable<void> {
    const url = `${this.baseUrl}/sign/${contractId}`;
    
    // Set the responseType to 'arraybuffer' to handle binary data
    return this.http.post(url, signatures, { responseType: 'arraybuffer' })
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

  getSignatures(contractId: number): Observable<Signature[]> {
    const url = `${this.baseUrl}/getSignature/${contractId}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        return response as Signature[];
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  saveSignatures(contractId: number, signatures: Signature[]): Observable<void> {
    const url = `${this.baseUrl}/save/${contractId}`;
  
    return this.http.post(url, signatures, { responseType: 'text' }).pipe(
      map(() => void 0), // Cast the response to void
      catchError((error) => {
        throw error;
      })
    );
  }
}
