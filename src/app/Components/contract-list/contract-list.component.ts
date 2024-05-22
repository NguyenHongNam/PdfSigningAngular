import { Component, ElementRef, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Contract } from 'src/app/Models/Contract';
import { ApiService } from 'src/app/Services/api.service';
import { SignatureServiceService } from 'src/app/Services/signature-service.service';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('content') popupview !: ElementRef
  contracts: Contract[] = [];
  isOkLoading = false;
  pdfSrc: string = '';
  isModalVisible = false;
  fileToUpload: File | null = null;
  isVisible = false;
  size: NzButtonSize = 'default'; 
  contractId:any;
  isCollapsed = false;
  constructor(
    private signatureService:SignatureServiceService,
    private api:ApiService, 
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private router:Router,
    private cdr: ChangeDetectorRef
    ){
    
  }

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
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  getContracts(): void {
    this.api.getContracts()
      .subscribe(contracts => this.contracts = contracts);
  }

  uploadFile() {
    const fileInput = this.fileInput?.nativeElement;
    const file: File | undefined = fileInput?.files?.[0];
    debugger
    if (file) {
      this.api.uploadFile(file).subscribe(
        () => {
          this.notification.success('Thành công', 'Đã tải lên file!');
          this.loadContracts();
          this.cdr.detectChanges();
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

  downloadContract(contractId: number): void {
    this.api.download(contractId, true).subscribe(
      () => {
        this.notification.success('Thành công', 'Đã tải xuống tài liệu!');
      },
      error => {
        this.notification.error('Lỗi', 'Tài liệu chưa được ký!');
      }
    );
  }

  previewContract(contractId: number): void {
    this.router.navigate(['/contract-detail', contractId]);
    this.api.generatePdf(contractId).subscribe(res =>{
      let blob:Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob)
      this.pdfSrc = url;
    })
  }
}
