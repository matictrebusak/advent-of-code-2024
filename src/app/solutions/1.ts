import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>{{ 'Part 1 - Total distance: ' + totalDistance() }}</div>
    <div>{{ 'Part 2 - Similarity score: ' + similarityScore() }}</div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/1-1-test.txt';
  DATA_FILE_PATH = '/assets/1-1.txt';

  parsedInput = toSignal(
    this.httpClient.get(this.DATA_FILE_PATH, { responseType: 'text' }).pipe(
      map((response) => response.split('\n')),
      map((lines) => {
        let first: Array<Number> = [];
        let second: Array<Number> = [];

        lines.forEach((line) => {
          const [a, b] = line.split('   ');
          first.push(Number(a));
          second.push(Number(b));
        });
        return { firstColumn: first, secondColumn: second };
      })
    )
  );

  totalDistance = computed(() => {
    let diff: Array<any> = [];
    let first: Array<Number> = this.parsedInput()?.firstColumn?.sort() ?? [];
    let second: Array<Number> = this.parsedInput()?.secondColumn?.sort() ?? [];
    first.forEach((value, index) => {
      diff.push(Math.abs(Number(value) - Number(second[index])));
    });
    return diff.reduce((acc, curr) => acc + curr, 0);
  });

  similarityScore = computed(() => {
    let totalScore = 0;
    this.parsedInput()?.firstColumn?.forEach((element) => {
      totalScore +=
        (this.parsedInput()?.secondColumn?.filter((value) => value === element)
          ?.length ?? 0) * Number(element);
    });
    return totalScore;
  });
}
