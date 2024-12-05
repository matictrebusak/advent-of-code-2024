import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Sum of words: ' + sumOfWords() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  XMAS = 'XMAS'.split('');
  MAS = 'MAS'.split('');

  // DATA_FILE_PATH = '/assets/4-1-test.txt';
  DATA_FILE_PATH = '/assets/4-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  sumOfWords = computed(() => {
    const dataGrid = this.prepareGrid(this.lines());
    return this.checkNumberOfXmas(dataGrid);
  });

  prepareGrid(lines: Array<string> | undefined): Array<Array<string>> {
    if (!lines) return [[]];
    let grid = Array<Array<string>>();
    lines.map((line, index) => {
      grid[index] = line!.split('');
    });
    return grid;
  }

  checkNumberOfXmas(data: Array<Array<string>>): number {
    let total = 0;

    data.forEach((line, column) => {
      line.forEach((_, row) => {
        // total += this.checkHorizontal(data, column, row);
        // total += this.checkVertical(data, column, row);
        // total += this.checkDiagonaly(data, column, row);
        total += this.checkXShapedMas(data, column, row);
      });
    });
    return total;
  }

  checkVertical(
    data: Array<Array<string>>,
    column: number,
    row: number
  ): number {
    let isMatch = 1;
    let isMatchReverse = 1;
    this.XMAS.forEach((letter, index) => {
      const cappedColMax = Math.min(column + index, data.length - 1);
      const cappedColMin = Math.max(column - index, 0);
      if (data[cappedColMax][row] !== letter) {
        isMatch = 0;
      }
      if (data[cappedColMin][row] !== letter) {
        isMatchReverse = 0;
      }
    });
    return isMatch + isMatchReverse;
  }

  checkHorizontal(
    data: Array<Array<string>>,
    column: number,
    row: number
  ): number {
    let isMatch = 1;
    let isMatchReverse = 1;
    this.XMAS.forEach((letter, index) => {
      const cappedRowMax = Math.min(row + index, data.length - 1);
      const cappedRowMin = Math.max(row - index, 0);

      if (data[column][cappedRowMax] !== letter) {
        isMatch = 0;
      }
      if (data[column][cappedRowMin] !== letter) {
        isMatchReverse = 0;
      }
    });
    return isMatch + isMatchReverse;
  }

  checkDiagonaly(
    data: Array<Array<string>>,
    column: number,
    row: number
  ): number {
    let isMatch = 1;
    let isMatchReverse = 1;
    let isMatchOtherSide = 1;
    let isMatchOtherSideReverse = 1;
    this.XMAS.forEach((letter, index) => {
      const colDecreased = column - index;
      const colIncresead = column + index;
      const rowDecresead = row - index;
      const rowIncresead = row + index;

      if (
        colDecreased < 0 ||
        rowIncresead > data.length - 1 ||
        data[colDecreased][rowIncresead] !== letter
      ) {
        isMatch = 0;
      }
      if (
        colDecreased < 0 ||
        rowDecresead < 0 ||
        data[colDecreased][rowDecresead] !== letter
      ) {
        isMatchReverse = 0;
      }
      if (
        colIncresead > data.length - 1 ||
        rowIncresead > data.length - 1 ||
        data[colIncresead][rowIncresead] !== letter
      ) {
        isMatchOtherSide = 0;
      }
      if (
        colIncresead > data.length - 1 ||
        rowDecresead > data.length - 1 ||
        data[colIncresead][rowDecresead] !== letter
      ) {
        isMatchOtherSideReverse = 0;
      }
    });
    return (
      isMatch + isMatchReverse + isMatchOtherSide + isMatchOtherSideReverse
    );
  }

  checkXShapedMas(
    data: Array<Array<string>>,
    column: number,
    row: number
  ): number {
    let centerLetter = data[column][row];
    if (centerLetter !== 'A') {
      return 0;
    }
    const colDecreased = column - 1;
    const colIncresead = column + 1;
    const rowDecresead = row - 1;
    const rowIncresead = row + 1;

    if (
      colDecreased < 0 ||
      colIncresead > data.length - 1 ||
      rowDecresead < 0 ||
      rowIncresead > data.length - 1
    )
      return 0;

    const isOneDiagonal =
      (data[colDecreased][rowDecresead] === 'M' &&
        data[colIncresead][rowIncresead] === 'S') ||
      (data[colDecreased][rowDecresead] === 'S' &&
        data[colIncresead][rowIncresead] === 'M');
    const isOtherDiagonal =
      (data[colDecreased][rowIncresead] === 'M' &&
        data[colIncresead][rowDecresead] === 'S') ||
      (data[colDecreased][rowIncresead] === 'S' &&
        data[colIncresead][rowDecresead] === 'M');

    return isOneDiagonal && isOtherDiagonal ? 1 : 0;
  }
}
