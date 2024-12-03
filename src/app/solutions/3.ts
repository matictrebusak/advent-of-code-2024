import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Sum of multiplications: ' + sumOfMultiplications() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/3-1-test.txt';
  DATA_FILE_PATH = '/assets/3-1.txt';

  parsedInput = toSignal(
    this.httpClient.get(this.DATA_FILE_PATH, { responseType: 'text' })
  );

  sumOfMultiplications = computed(() => {
    let textInput = this.parsedInput()!;
    let regex = new RegExp('mul\\((\\d{1,3}),(\\d{1,3})\\)', 'g');
    let total = 0;
    let result;
    while ((result = regex.exec(textInput))) {
      let [first, second] = result[0]
        .replace('mul(', '')
        .replace(')', '')
        .split(',');
      total += Number(first) * Number(second);
    }
    return total;
  });
}
