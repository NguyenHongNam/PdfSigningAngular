import { Component, ElementRef, OnInit, Pipe, ViewChild } from '@angular/core';
import { ApiService } from './Services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Signature } from './Models/Signature';
import { StorageService } from './Services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignatureServiceService } from './Services/signature-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Contract } from './Models/Contract';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private signatureService:SignatureServiceService,
    private api:ApiService, 
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private router:Router
    ){
    
  }
  isCollapsed = false;
  listContract:any=[];
  lContract:any;
  contracts: any[] = [];
  selectedContract: any;
  pdfSrc: string = '';
  size: NzButtonSize = 'default'; 
  isVisible = false;
  isOkLoading = false;
  isModalVisible = false;
  fileToUpload: File | null = null;

  currentPage = 1;
  totalPages = 0;
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

  ngOnInit(): void  {
    this.loadContracts();
  }
  loadContracts(): void {
    this.api.getContracts().subscribe(
      (contracts: Contract[]) => {
        this.contracts = contracts;
      },
      (error) => {
        this.notification.error('Lỗi', 'Không tải được danh sách hợp đồng!');
      }
    );
  }


  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // Xu ly khi upload xong
    } else if (info.file.status === 'error') {
      this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: 'Lỗi khi tải lên tệp.'
      });
    }
  }
  
  // async loadSignatures(): Promise<void> {
  //   // Make a call to your backend service to get signatures
  //   try {
  //     const signatures = await this.signatureService.getSignatures(this.contractId).toPromise();
  //     this.signatures = signatures ?? [];
  //   } catch (error: any) {
  //     console.error(error);
  //   }
  // }

  getContracts(): void {
    this.api.getContracts()
      .subscribe(contracts => this.contracts = contracts);
  }

  uploadFile() {
    const fileInput = this.fileInput?.nativeElement;
    const file: File | undefined = fileInput?.files?.[0];

    if (file) {
      this.api.uploadFile(file).subscribe(
        () => {
          this.notification.success('Thành công', 'Đã tải lên file!');
          this.getContracts();
        },
        error => {
          console.error('Lỗi khi tải file', error);
          this.notification.error('Lỗi', 'Không tải lên được file!');
        }
      );
    } else {
      this.notification.error('Lỗi', 'Chưa chọn file!');
    }
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

}
