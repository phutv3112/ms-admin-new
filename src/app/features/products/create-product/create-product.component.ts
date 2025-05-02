import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { Editor } from 'primeng/editor';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { Category } from '../../../shared/models/catalog/category';
import { CategoryService } from '../../../core/service/category.service';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../core/service/product.service';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { TextEditorComponent } from '../../../shared/components/text-editor/text-editor.component';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    FileUploadModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    TextareaModule,
    FluidModule,
    MultiSelectModule,
    InputNumber,
    Editor,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    RouterLink,
    TextEditorComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  providers: [MessageService],
})
export class CreateProductComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  productImages: File[] = [];
  productForm: FormGroup;

  productVariants: {
    color: string;
    size: string;
    quantity: number;
    additionalPrice: number;
  }[] = [];

  categories: Category[] = [];
  selectedCategories: Category[] = [];

  brands: string[] = [];
  selectedBrand: string = '';

  types: string[] = [];
  selectedType: string = '';

  uploadedFiles: any[] = [];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      originalPrice: [0, Validators.required],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      stock: [0],
      categories: [[]],
      productImages: [[], Validators.required],
      variants: this.fb.array([]), // Mảng biến thể
    });
  }

  isInvalid(field: string): boolean {
    return (
      this.productForm.controls[field].invalid &&
      this.productForm.controls[field].touched
    );
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.categoryService.getAllBrands().subscribe((data) => {
      this.brands = data.brands;
    });
    this.categoryService.getAllProductTypes().subscribe((data) => {
      this.types = data.types;
    });
  }

  get variants(): FormArray<FormGroup> {
    return this.productForm.get('variants') as FormArray<FormGroup>;
  }

  addVariant() {
    const variantForm = this.fb.group({
      color: [''],
      size: [''],
      additionalPrice: [0],
      stock: [0],
    });
    this.variants.push(variantForm);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onFileSelect(event: any) {
    const files: File[] = Array.from(event.files);

    // Cập nhật giá trị vào form control
    this.productForm.patchValue({
      productImages: files,
    });

    // Log để kiểm tra
    console.log('Selected Product Images:', files);
  }

  submitForm() {
    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields',
      });
      return;
    }
    this.isLoading = true;

    const formData = new FormData();
    const formValue = this.productForm.value;

    // Thêm các thông tin khác vào FormData
    formData.append('Name', formValue.name);
    formData.append('ShortDescription', formValue.shortDescription);
    formData.append('Description', formValue.description);
    formData.append('Price', formValue.price);
    formData.append('OriginalPrice', formValue.originalPrice);
    formData.append('Brand', formValue.brand);
    formData.append('Type', formValue.type);
    formData.append('Stock', formValue.stock);

    formValue.categories.forEach((category: Category) => {
      formData.append('Categories', category.name);
    });

    // Thêm các tệp hình ảnh vào FormData
    const productImages = this.productForm.value.productImages;
    if (productImages && productImages.length > 0) {
      productImages.forEach((image: File) => {
        formData.append('ProductImages', image, image.name);
      });
    } else {
      console.log('No images selected or productImages is not an array');
    }

    // Thêm các biến thể vào FormData (nếu có)
    if (this.variants.length > 0) {
      formData.append('Variants', JSON.stringify(this.variants.value));
    }
    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Create new product successfully',
        });
        console.log('Product created successfully', response);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create new product',
        });
        console.error('Error creating product', error);
      },
      complete: () => {
        this.isLoading = false;
        this.resetForm();
        setTimeout(() => {
          this.router.navigateByUrl('/products');
        }, 1500);
      },
    });
  }
  resetForm() {
    this.productForm.reset();
    this.variants.clear();
    this.uploadedFiles = [];
  }
}
