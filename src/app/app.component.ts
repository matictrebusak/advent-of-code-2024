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
    let doesWork = this.prepareDoesItWork(textInput);
    let total = this.extractAndMultiply(textInput, doesWork);
    return total;
  });

  prepareDoesItWork(input: string): Array<boolean> {
    if (!input) return [];
    let regexDo = new RegExp('do\\(\\)', 'g');
    let regexDont = new RegExp("don't\\(\\)", 'g');
    let doInputs = [...input.matchAll(regexDo)].map((item) => item.index);
    let dontInputs = [...input.matchAll(regexDont)].map((item) => item.index);
    let isWorking = true;

    return [...input].map((_, index) => {
      if (doInputs.includes(index)) {
        isWorking = true;
      } else if (dontInputs.includes(index)) {
        isWorking = false;
      }
      return isWorking;
    });
  }

  extractAndMultiply(input: string, doesItWork: Array<boolean>): number {
    let regex = new RegExp('mul\\((\\d{1,3}),(\\d{1,3})\\)', 'g');
    let total = 0;
    let result;

    while ((result = regex.exec(input))) {
      if (doesItWork[result.index]) {
        let [first, second] = result[0]
          .replace('mul(', '')
          .replace(')', '')
          .split(',');
        total += Number(first) * Number(second);
      }
    }
    return total;
  }
}
