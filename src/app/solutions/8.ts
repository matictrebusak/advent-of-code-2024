import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface Coordinate {
  X: number;
  Y: number;
}

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{
        'Part 1 - Number of unique antinode locations: ' + calculateAntinodes()
      }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  mapOfAntennas = new Map<string, Array<Coordinate>>();
  mapOfAntinodes = new Map<string, number>();

  // DATA_FILE_PATH = '/assets/8-1-test.txt';
  DATA_FILE_PATH = '/assets/8-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  prepareGrid(lines: Array<string> | undefined): Array<Array<string>> {
    if (!lines) return [[]];
    let grid = Array<Array<string>>();
    lines.map((line, row) => {
      grid[row] = line!.split('');
      grid[row].forEach((value, column) => {
        this.addToMapOfAntenas(value, { X: column, Y: row });
      });
    });
    console.log('grid', grid);
    console.log('mapOfAntennas', this.mapOfAntennas);
    return grid;
  }

  addToMapOfAntenas(value: string, position: Coordinate) {
    if (value !== '.') {
      if (this.mapOfAntennas.has(value)) {
        const newArray: Array<Coordinate> = this.mapOfAntennas.get(value)!;
        newArray.push(position);
        this.mapOfAntennas.set(value, newArray);
      } else {
        this.mapOfAntennas.set(value, [position]);
      }
    }
  }

  calculateAntinodes = computed(() => {
    const dataGrid = this.prepareGrid(this.lines());
    this.mapOfAntennas.forEach((antennas) => {
      this.checkNumberOfAntinodes(dataGrid, antennas);
    });
    return this.mapOfAntinodes.size;
  });

  checkNumberOfAntinodes(
    dataGrid: Array<Array<string>>,
    antennas: Array<Coordinate>
  ): void {
    for (let i = 0; i < antennas.length - 1; i++) {
      for (let j = i + 1; j < antennas.length; j++) {
        console.log('antennas[i], antennas[i + 1]', antennas[i], antennas[j]);
        this.setAntinodesForPair(dataGrid, antennas[i], antennas[j]);
      }
    }
  }

  setAntinodesForPair(
    dataGrid: Array<Array<string>>,
    antenna1: Coordinate,
    antenna2: Coordinate
  ): void {
    const absDiffX = Math.abs(antenna2.X - antenna1.X);
    const absDiffY = Math.abs(antenna2.Y - antenna1.Y);
    let antinodeCoordinate: Coordinate = { X: 0, Y: 0 };
    const minX = Math.min(antenna1.X, antenna2.X);
    const maxX = Math.max(antenna1.X, antenna2.X);
    const minY = Math.min(antenna1.Y, antenna2.Y);
    const maxY = Math.max(antenna1.Y, antenna2.Y);
    this.writeAntinodeToMap(antenna1, dataGrid);
    this.writeAntinodeToMap(antenna2, dataGrid);

    if (
      (antenna1.X >= antenna2.X && antenna1.Y >= antenna2.Y) ||
      (antenna2.X >= antenna1.X && antenna2.Y >= antenna1.Y)
    ) {
      let newX = minX - absDiffX;
      let newY = minY - absDiffY;
      let keepLooping = true;
      let safety = 100;
      while (keepLooping && safety > 0) {
        antinodeCoordinate = {
          X: newX,
          Y: newY,
        };
        this.writeAntinodeToMap(antinodeCoordinate, dataGrid);
        newX -= absDiffX;
        newY -= absDiffY;
        if (newX < 0 || newY < 0) {
          keepLooping = false;
        }
        safety--;
      }

      safety = 100;
      keepLooping = true;

      newX = maxX + absDiffX;
      newY = maxY + absDiffY;
      while (keepLooping && safety > 0) {
        antinodeCoordinate = {
          X: newX,
          Y: newY,
        };
        this.writeAntinodeToMap(antinodeCoordinate, dataGrid);
        newX += absDiffX;
        newY += absDiffY;
        if (newX > dataGrid.length || newY > dataGrid.length) {
          keepLooping = false;
        }
        safety--;
      }
    } else {
      let newX = minX - absDiffX;
      let newY = maxY + absDiffY;
      let keepLooping = true;
      let safety = 100;
      while (keepLooping && safety > 0) {
        antinodeCoordinate = {
          X: newX,
          Y: newY,
        };
        this.writeAntinodeToMap(antinodeCoordinate, dataGrid);
        newX -= absDiffX;
        newY += absDiffY;
        if (newX < 0 || newY > dataGrid.length) {
          keepLooping = false;
        }
        safety--;
      }

      keepLooping = true;
      safety = 100;
      newX = maxX + absDiffX;
      newY = minY - absDiffY;
      while (keepLooping && safety > 0) {
        antinodeCoordinate = {
          X: newX,
          Y: newY,
        };
        this.writeAntinodeToMap(antinodeCoordinate, dataGrid);
        newX += absDiffX;
        newY -= absDiffY;
        if (newX > dataGrid.length || newY < 0) {
          keepLooping = false;
        }
        safety--;
      }
    }
  }

  writeAntinodeToMap(antinode: Coordinate, data: Array<Array<string>>): void {
    const x = antinode.X;
    const y = antinode.Y;
    if (x >= 0 && y >= 0 && y < data.length && x < data?.[0].length) {
      this.mapOfAntinodes.set(`${x},${y}`, 1);
    }
  }
}
