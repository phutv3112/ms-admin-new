import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AddOrUpdateInventory,
  Product,
  ProductImage,
} from '../../../shared/models/catalog/product';
import { environment } from '../../../../environments/environment';
import { Tooltip } from 'primeng/tooltip';
import {
  CKEditorModule,
  loadCKEditorCloud,
  CKEditorCloudResult,
} from '@ckeditor/ckeditor5-angular';
import type {
  ClassicEditor,
  EditorConfig,
} from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { AuthService } from '../../../core/service/auth.service';
import { Dialog } from 'primeng/dialog';
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
    RouterLink,
    CKEditorModule,
    Tooltip,
    Dialog,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [MessageService],
})
export class EditProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  private licenseKey = environment.CKEDITOR_GLOBAL_LICENSE_KEY;

  public Editor: typeof ClassicEditor | null = null;
  public config: EditorConfig | null = null;

  productForm: FormGroup;
  productId: string | null = null;

  userProfile: any = null;

  categories: any[] = [];
  selectedCategories: Category[] = [];

  brands: string[] = [];
  selectedBrand: string = '';

  types: string[] = [];
  selectedType: string = '';
  primaryImageUrl: string = '';

  uploadedFiles: any[] = [];
  productImages: ProductImage[] = [];
  productSecondImages: ProductImage[] = [];

  updateInventoryVisible: boolean = false;
  inventoryData: {
    productId: string;
    variantId?: string;
    newQuantity: number;
    reason: string;
  } = {
    productId: '',
    variantId: '',
    newQuantity: 0,
    reason: '',
  };

  reasonOptions = ['Restock', 'Inventory Adjustment', 'Add new item', 'Other'];

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
      productPrimaryImage: [],
      variants: this.fb.array([]),
    });

    this.userProfile = this.authService.userInfo;
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

    loadCKEditorCloud({
      version: '44.3.0',
      premium: true,
    }).then(this._setupEditor.bind(this));
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

    if (files.length > 0) {
      this.productForm.patchValue({
        productImages: files,
      });
    }
  }
  onPrimaryImageSelect(event: any) {
    const files: File[] = Array.from(event.files);
    if (files.length > 0) {
      this.productForm.patchValue({
        productPrimaryImage: files[0],
      });
    }
  }

  loadProduct() {
    //this.isLoading = true;
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
          this.primaryImageUrl =
            product.imageUrls.filter((image) => image.isPrimary === true)[0]
              ?.imageUrl || '';
          this.productSecondImages = product.imageUrls.filter(
            (image) => image.isPrimary === false
          );
        },
        error: (error) => {
          console.error(error);
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

    //this.isLoading = true;
    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('Name', formValue.name);
    formData.append('ShortDescription', formValue.shortDescription);
    formData.append('Description', formValue.description);
    formData.append('Price', formValue.price);
    formData.append('OriginalPrice', formValue.originalPrice);
    formData.append('Brand', formValue.brand);
    formData.append('Type', formValue.type);
    formData.append('ChangedBy', this.userProfile.userName);

    formValue.categories.forEach((category: Category) => {
      formData.append('Categories', category.name);
    });

    const primaryImage = this.productForm.value.productPrimaryImage;
    if (primaryImage) {
      formData.append('ProductPrimaryImage', primaryImage, primaryImage.name);
    }
    // Add product images to FormData
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
        //this.isLoading = false;
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

  private _setupEditor(
    cloud: CKEditorCloudResult<{ version: '44.3.0'; premium: true }>
  ) {
    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Alignment,
      Indent,
      IndentBlock,
      BlockQuote,
      Code,
      CodeBlock,
      List,
      ListProperties,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      Image,
      ImageToolbar,
      ImageUpload,
      Base64UploadAdapter,
      ImageResize,
      ImageStyle,
      DragDrop,
    } = cloud.CKEditor;

    this.Editor = ClassicEditor;
    this.config = {
      licenseKey: this.licenseKey,
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Alignment,
        Indent,
        IndentBlock,
        BlockQuote,
        Code,
        CodeBlock,
        List,
        ListProperties,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties,
        Image,
        ImageToolbar,
        ImageUpload,
        Base64UploadAdapter,
        ImageResize,
        ImageStyle, // 🔥 Căn ảnh (trái, giữa, phải, wrap text)
        DragDrop,
      ],
      toolbar: [
        'undo',
        'redo',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'alignment:left',
        'alignment:center',
        'alignment:right',
        'alignment:justify',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'code',
        'codeBlock',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertTable',
        '|',
        'uploadImage',
        '|',
        'dragDrop',
      ],
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableProperties',
          'tableCellProperties',
        ],
      },
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:alignLeft', // 🔥 Căn trái
          'imageStyle:alignCenter', // 🔥 Căn giữa
          'imageStyle:alignRight', // 🔥 Căn phải
          'imageStyle:wrapText', // 🔥 Wrap text (Văn bản bao quanh ảnh)
          '|',
          'imageResize',
        ],
        upload: {
          types: ['jpeg', 'png', 'gif', 'bmp', 'webp'],
        },
        resizeUnit: 'px',
      },
    };
  }

  // Show dialog when button is clicked
  showUpdateInventoryDialog(variant?: any) {
    this.updateInventoryVisible = true;

    // Reset the form data
    this.inventoryData = {
      productId: this.productId!,
      variantId: variant ? variant.id : null,
      newQuantity: 0,
      reason: '',
    };
  }

  updateProductInventory() {
    if (!this.inventoryData.productId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product ID is required',
      });
      return;
    }

    const inventoryUpdate: AddOrUpdateInventory = {
      productId: this.inventoryData.productId,
      variantId: this.inventoryData.variantId,
      newQuantity: this.inventoryData.newQuantity,
      reason: this.inventoryData.reason,
      userName: this.userProfile.userName,
    };

    this.productService.addOrUpdateInventory(inventoryUpdate).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Inventory updated successfully',
        });
        this.updateInventoryVisible = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to update inventory',
        });
      },
      complete: () => {
        setTimeout(() => {
          this.router.navigateByUrl('/inventories');
        }, 1000);
      },
    });
  }
}
