import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Sum Of trailheads: ' + sumOfTrailHeads() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/10-1-test.txt';
  DATA_FILE_PATH = '/assets/10-1.txt';

  listOfPeaks: Array<Array<number>> = [[]];

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  sumOfTrailHeads = computed(() => {
    const dataGrid = this.prepareGrid(this.lines());
    let sum = 0;
    for (let i = 0; i < dataGrid.length; i++) {
      for (let j = 0; j < dataGrid[i].length; j++) {
        if (dataGrid[i][j] === 0) {
          console.log('Progress: ' + (i / dataGrid.length) * 100 + '%');
          this.listOfPeaks = [[]];
          const sumToAdd = this.calculateTrails(dataGrid, i, j, 1);
          sum += sumToAdd;
        }
      }
    }
    console.log('sum', sum);
    return sum;
  });

  prepareGrid(lines: Array<string> | undefined): Array<Array<number>> {
    if (!lines) return [[]];
    let grid = Array<Array<number>>();
    lines.map((line, index) => {
      grid[index] = line!.split('').map((char) => +char);
    });
    return grid;
  }

  calculateTrails(
    dataGrid: Array<Array<number>>,
    i: number,
    j: number,
    nextNumber: number
  ): number {
    let up = dataGrid[Math.max(i - 1, 0)][j];
    let left = dataGrid[i][Math.max(j - 1, 0)];
    let down = dataGrid[Math.min(i + 1, dataGrid[0].length - 1)][j];
    let right = dataGrid[i][Math.min(j + 1, dataGrid.length - 1)];
    let trailSum = 0;
    if (up === nextNumber) {
      trailSum += this.calculateTrails(dataGrid, i - 1, j, nextNumber + 1);
    }
    if (left === nextNumber) {
      trailSum += this.calculateTrails(dataGrid, i, j - 1, nextNumber + 1);
    }
    if (down === nextNumber) {
      trailSum += this.calculateTrails(dataGrid, i + 1, j, nextNumber + 1);
    }
    if (right === nextNumber) {
      trailSum += this.calculateTrails(dataGrid, i, j + 1, nextNumber + 1);
    }
    if (nextNumber === 10) {
      // && !this.listOfPeaks.find((element) => element[0] === i && element[1] === j)
      // this.listOfPeaks.push([i, j]);
      return trailSum + 1;
    } else {
      return trailSum;
    }
  }
}
