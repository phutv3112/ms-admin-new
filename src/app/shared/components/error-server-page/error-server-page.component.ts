import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-server-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-server-page.component.html',
  styleUrl: './error-server-page.component.scss',
})
export class ErrorServerPageComponent {}
