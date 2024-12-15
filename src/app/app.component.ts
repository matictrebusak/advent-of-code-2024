import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface Coordinate {
  x: number;
  y: number;
}

enum DataType {
  A,
  B,
  PRIZE,
}

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Number of Tokens: ' + sumOfTokens() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/13-1-test.txt';
  DATA_FILE_PATH = '/assets/13-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  sumOfTokens = computed(() => {
    const data = this.prepareData(this.lines());
    let sumOfTokens = 0;
    if (data && data!.get(DataType.A)) {
      const dataLength = data!.get(DataType.A)!.length;
      console.log('length ' + dataLength);
      for (let i = 0; i < dataLength; i++) {
        const tokens = this.calculateTokensForPrize(
          data!.get(DataType.A)![i],
          data!.get(DataType.B)![i],
          data!.get(DataType.PRIZE)![i]
        );
        console.log('tokens', tokens);
        sumOfTokens += tokens ?? 0;
      }
      console.log('sumOfTokens ', sumOfTokens);
      return sumOfTokens;
    } else {
      return 0;
    }
  });

  calculateTokensForPrize(
    a: Coordinate,
    b: Coordinate,
    prize: Coordinate
  ): number {
    const solutions = [];
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        let x = a.x * i + b.x * j;
        let y = a.y * i + b.y * j;
        if (x === prize.x && y === prize.y) {
          solutions.push(i * 3 + j);
        }
      }
    }
    return solutions.sort()[0];
  }

  prepareData(
    lines: Array<string> | undefined
  ): Map<DataType, Array<Coordinate>> {
    let data = new Map<DataType, Array<Coordinate>>();
    if (!lines) return data;

    lines.forEach((line, index) => {
      let [x, y] = line
        .split(',')
        .map((element) => +element.replace(/\D/g, ''));
      const coordinate = { x, y };
      const rest = index % 4;
      if (rest !== 3) {
        const type =
          rest === 0 ? DataType.A : rest === 1 ? DataType.B : DataType.PRIZE;
        if (data.has(type)) {
          data.get(type)!.push(coordinate);
        } else {
          data.set(type, [coordinate]);
        }
      }
    });
    console.log('data', data);
    return data;
  }
}
