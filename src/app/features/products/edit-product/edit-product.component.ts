import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { EditorModule } from 'primeng/editor';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductImage } from '../../../shared/models/catalog/product';
import { LoadingService } from '../../../core/service/loading.service';
import { Subscription } from 'rxjs';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    FileUploadModule,
    InputTextModule,
    ButtonModule,
    Dialog,
    SelectModule,
    FormsModule,
    TextareaModule,
    FluidModule,
    MultiSelectModule,
    InputNumber,
    EditorModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ProgressSpinner,
    RouterLink,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [MessageService],
})
export class EditProductComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private categoryService = inject(CategoryService);
  private loadingService = inject(LoadingService);

  productForm: FormGroup;
  productId: string | null = null;
  isLoading = false;

  categories: any[] = [];
  selectedCategories: Category[] = [];

  brands: string[] = [];
  selectedBrand: string = '';

  types: string[] = [];
  selectedType: string = '';

  uploadedFiles: any[] = [];
  productImages: ProductImage[] = [];

  //loading
  loading$ = this.loadingService.loading$;
  private sub: Subscription;

  constructor(private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      stock: [0],
      categories: [[]],
      productImages: [[]],
      variants: this.fb.array([]),
    });

    this.sub = this.loading$.subscribe((value) => {
      this.isLoading = value;
    });
  }
  isInvalid(field: string): boolean {
    return (
      this.productForm.controls[field].invalid &&
      this.productForm.controls[field].touched
    );
  }
  ngOnInit() {
    this.categoryService.getAllBrands().subscribe((data) => {
      this.brands = data.brands;
    });
    this.categoryService.getAllProductTypes().subscribe((data) => {
      this.types = data.types;
    });

    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProduct();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get variants(): FormArray<FormGroup> {
    return this.productForm.get('variants') as FormArray<FormGroup>;
  }

  addVariant(id = '', color = '', size = '', additionalPrice = 0) {
    const variantForm = this.fb.group({
      id: [id],
      color: [color, Validators.required],
      size: [size, Validators.required],
      additionalPrice: [
        additionalPrice,
        [Validators.required, Validators.min(0)],
      ],
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
    if (files.length > 0) {
      this.productForm.patchValue({
        productImages: files,
      });
    }
    // Log để kiểm tra
    console.log('Selected Product Images:', files);
  }

  loadProduct() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.productService.getProductById(this.productId!).subscribe({
        next: (response) => {
          const product: Product = response.product;
          this.productForm.patchValue({
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            brand: product.brand,
            type: product.type,
            stock: product.stock,
            //categories: product.categories,
            categories: this.categories.filter((c) =>
              product.categories.some((pc: any) => pc.name === c.name)
            ),
            //categories: product.categories.map((c: any) => c.name),
          });

          // Load variants
          this.variants.clear();
          for (const variant of product.variants) {
            this.addVariant(
              variant.id,
              variant.color,
              variant.size,
              variant.additionalPrice
            );
          }
          this.productImages = product.imageUrls;
          this.isLoading = false;

          console.log('Product categories:', this.productForm.value.categories);
          console.log('All categories:', this.categories);
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        },
      });
    });
  }

  submitForm() {
    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill out all required fields',
      });
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('Name', formValue.name);
    formData.append('ShortDescription', formValue.shortDescription);
    formData.append('Description', formValue.description);
    formData.append('Price', formValue.price);
    formData.append('OriginalPrice', formValue.originalPrice);
    formData.append('Brand', formValue.brand);
    formData.append('Type', formValue.type);

    formValue.categories.forEach((category: Category) => {
      formData.append('Categories', category.name);
    });

    // Thêm các tệp hình ảnh vào FormData
    const productImages = this.productForm.value.productImages;
    if (productImages && productImages.length > 0) {
      productImages.forEach((image: File) => {
        formData.append('ProductImages', image, image.name);
      });
    }

    // Thêm các biến thể vào FormData (nếu có)
    if (this.variants.length > 0) {
      formData.append('Variants', JSON.stringify(this.variants.value));
    }

    this.productService.updateProduct(this.productId!, formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully',
        });
        console.log('Product updated successfully', response);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update product',
        });
        console.error('Error updating product', error);
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
