import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  CKEditorModule,
  loadCKEditorCloud,
  CKEditorCloudResult,
  ChangeEvent,
} from '@ckeditor/ckeditor5-angular';
import type {
  ClassicEditor,
  EditorConfig,
} from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CKEditorModule, CommonModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements OnInit {
  title = 'richtextEditor';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  private licenseKey = environment.CKEDITOR_GLOBAL_LICENSE_KEY;

  public Editor: typeof ClassicEditor | null = null;
  public config: EditorConfig | null = null;

  public initialValue: string = '';
  private editorInstance: any;

  public ngOnInit(): void {
    this.initialValue = this.value;
    loadCKEditorCloud({
      version: '44.3.0',
      premium: true,
    }).then(this._setupEditor.bind(this));
  }

  onReady(editor: any) {
    this.editorInstance = editor;

    editor.model.document.on('change:data', () => {
      const data = editor.getData();
      this.valueChange.emit(data);
    });
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
}
