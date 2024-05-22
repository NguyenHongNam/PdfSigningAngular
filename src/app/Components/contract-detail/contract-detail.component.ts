import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Signature } from 'src/app/Models/Signature';
import { ApiService } from 'src/app/Services/api.service';
import { SignatureServiceService } from 'src/app/Services/signature-service.service';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  showOcrSection: boolean = false;
  contractId = 0;
  pdfSrc: string = '';
  currentPage = 1;
  totalPages:any;
  signatures: Signature[] = [];
  selectedSignature: Signature = {
    page: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    name: '',
    reason: '',
    imageData: null
  };

  initWidth = 250;
  initHeight = 75;

  constructor(
    private api: ApiService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private signature: SignatureServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {

      this.contractId = +params['contractId'];
      this.pdfSrc = `https://localhost:7277/Contract/${this.contractId}`;
      this.currentPage = this.storageService.getNumberValue(this.pdfSrc)?? 1;
      await this.loadSignatures();
    });
  }
  handleOk(): void {
    this.isVisible = false;
  }

  afterLoadComplete(pdf: any): void {
    this.totalPages = pdf.numPages;

    setTimeout(async () => {
      this.fixSize();
      this.setInitialTransformations();
    }, 500);
  }

  onDragMoved(index: number): void {
    let coor: any = this.getTranslateValues(index + '');

    this.signatures[index].x = coor.x;
    this.signatures[index].y = this.getPageHeight() - coor.y - this.signatures[index].height;
  }


  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.fixSize();
    this.storageService.saveKeyValuePair(this.pdfSrc, this.currentPage);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.fixSize();
    this.storageService.saveKeyValuePair(this.pdfSrc, this.currentPage);
  }


  getTranslateValues(elementId: string) {
    const element = document.getElementById(elementId);

    if (element) {
      const transformValue = window.getComputedStyle(element).getPropertyValue('transform');

      if (transformValue.includes('matrix')) {
        // Extract the matrix values
        const matrixMatch = transformValue.match(/matrix\(([^\)]+)\)/);

        if (matrixMatch && matrixMatch[1]) {
          const matrixValues = matrixMatch[1].split(', ');
          const translateX = parseFloat(matrixValues[4]);
          const translateY = parseFloat(matrixValues[5]);

          return { x: translateX, y: translateY };
        }
      } else if (transformValue.includes('translate3d')) {
        // Extract the translate3d values
        const regex = /translate3d\(([-\d\.]+)px, ([-\d\.]+)px, ([-\d\.]+)px\)/;
        const matches = transformValue.match(regex);

        if (matches) {
          const [_, translateX, translateY] = matches.map(parseFloat);
          return { x: translateX, y: translateY };
        }
      }

      console.error("Sai thông tin:", transformValue);
      return { x: 0, y: 0 }; // or handle the error as needed
    } else {
      console.error('Lỗi');
      return { x: 0, y: 0 }; // or handle the error as needed
    }
  }

  resizeSignature(index: number): void {
    let elementId = `resizeHandle${index}`;
    let coor: any = this.getTranslateValues(elementId);

    this.signatures[index].width = this.initWidth + coor.x;
    this.signatures[index].height = this.initHeight + coor.y;

    this.clearTransform(elementId);
  }

  clearTransform(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.style.transform = '';
    } else {
      console.error(`Không tìm thấy "${elementId}" .`);
    }
  }

  sign() {
    debugger
    this.signature.addSignatures(this.contractId, this.signatures).subscribe(
      () => {
        this.notification.success('Thành công', 'Ký thành công!');
      },
      error => {
        this.notification.error('Lỗi', 'Lỗi khi ký!');
        console.log(error)
      }
    );
  }

  selectSignature(index: number): void {
    this.selectedSignature = this.signatures[index];
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  async loadSignatures(): Promise<void> {
    // Make a call to your backend service to get signatures
    try {
      const signatures = await this.signature.getSignatures(this.contractId).toPromise();
      this.signatures = signatures ?? [];
    } catch (error: any) {
      console.error(error);
    }
  }

  saveSignatures(): void {
    debugger
    // Make a call to your backend service to save signatures
    this.signature.saveSignatures(this.contractId, this.signatures).subscribe(
      () => {
        this.notification.success('Thành công', 'Đã lưu chữ ký!');
      },
      error => {
        this.notification.error('Lỗi', 'Lỗi');
      }
    );
  }

  removeSignature(index: number) {
    this.signatures.splice(index, 1);
  }

  addSignature() {
    const newSignature = {
      page: this.currentPage,
      x: 0,
      y: this.getPageHeight(),
      width: this.initWidth,
      height: this.initHeight,
      name: 'default signature',
      reason: 'default',
      imageData: null
    };

    this.signatures.push(newSignature);
  }

  getPageHeight(): number {
    let signaturePageElement = document.querySelector('.signature-page');
    let pageHeight = signaturePageElement ? parseFloat(getComputedStyle(signaturePageElement).height) : null;

    return pageHeight ?? 0;
  }

  setInitialTransformations(): void {
    this.signatures.forEach((signature, index) => {
      const elementId = index + '';
      const x = signature.x;
      const y = this.getPageHeight() - signature.y - signature.height;

      this.setTransform(elementId, x, y);
    });
  }

  setTransform(elementId: string, x: number, y: number): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      console.error(`Không tìm thấy "${elementId}".`);
    }
  }

  setHeight(selector1: string, selector2: string): void {
    const element1 = document.querySelector(selector1) as HTMLElement;
    const element2 = document.querySelector(selector2) as HTMLElement;

    if (element1 && element2) {
      const height = element2.clientHeight;
      element1.style.height = `${height}px`;
    } else {
      console.error('One or both elements not found');
    }
  }

  setWidth(selector1: string, selector2: string): void {
    const element1 = document.querySelector(selector1) as HTMLElement;
    const element2 = document.querySelector(selector2) as HTMLElement;

    if (element1 && element2) {
      const width = element2.clientWidth;
      element1.style.width = `${width}px`;
    } else {
      console.error('One or both elements not found');
    }
  }

  fixSize(): void {
    this.setHeight('.ng2-pdf-viewer-container', '.pdfViewer');
    this.setHeight('#pdf', '.pdfViewer');

    this.setWidth('.signature-page', '.page')

    const page = document.querySelector('.page') as HTMLElement;
    page && (page.style.marginBottom = '0px');
  }

  async changeImage(event: any) {
    const file = event.target.files[0];

    if (file) {
      await this.convertFileToBase64(file).then(base64String => {
        this.selectedSignature.imageData = base64String;
      });
    }

    event.target.value = '';
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.notification.error('Lỗi', 'Sai định dạng file');
        reject(new Error('Sai định dạng, vui lòng chọn lại file.'));
        return;
      }

      // Validate file size (for example, limit to 3 MB)
      const maxSizeInBytes = 3 * 1024 * 1024; // 3 MB
      if (file.size > maxSizeInBytes) {
        this.notification.error('Lỗi', 'File không được quá (5 MB).');
        reject(new Error('File không được quá (5 MB).'));
        return;
      }

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64Content = reader.result.split(',')[1];
          resolve(base64Content);
        } else {
          this.notification.error('Lỗi', 'Lỗi');
          reject(new Error('Lỗi tải file'));
        }
      };

      reader.onerror = (error) => {
        this.notification.error(error.toString(), 'Lỗi');
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  clearImage() :void{
    this.selectedSignature.imageData = null;
  }

}
