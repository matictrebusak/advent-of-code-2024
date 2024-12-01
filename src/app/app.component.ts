import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    @for (line of fileContentParsedByLine(); track $index) {
    <div>{{ line }}</div>
    }
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);
  fileContent = toSignal(
    this.httpClient.get('/assets/1-1-test.txt', { responseType: 'text' })
  );
  fileContentParsedByLine = computed(() => {
    return this.fileContent()?.split('\n');
  });

  constructor() {
    effect(() => {
      console.log('fileContent', this.fileContent());
    });
  }
}
