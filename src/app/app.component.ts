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
    // console.log('antenna1', antenna1);
    // console.log('antenna2', antenna2);
    const diffX = antenna2.X - antenna1.X;
    const diffY = antenna2.Y - antenna1.Y;
    const absDiffX = Math.abs(antenna2.X - antenna1.X);
    const absDiffY = Math.abs(antenna2.Y - antenna1.Y);
    // console.log('absDiffX', absDiffX);
    // console.log('absDiffY', absDiffY);
    let antinodeCoordinate1: Coordinate = { X: 0, Y: 0 };
    let antinodeCoordinate2: Coordinate = { X: 0, Y: 0 };
    const minX = Math.min(antenna1.X, antenna2.X);
    const maxX = Math.max(antenna1.X, antenna2.X);
    const minY = Math.min(antenna1.Y, antenna2.Y);
    const maxY = Math.max(antenna1.Y, antenna2.Y);
    // console.log('minX', minX);
    // console.log('maxX', maxX);
    // console.log('minY', minY);
    // console.log('maxY', maxY);

    if (
      (antenna1.X >= antenna2.X && antenna1.Y >= antenna2.Y) ||
      (antenna2.X >= antenna1.X && antenna2.Y >= antenna1.Y)
    ) {
      antinodeCoordinate1 = {
        X: minX - absDiffX,
        Y: minY - absDiffY,
      };
      antinodeCoordinate2 = {
        X: maxX + absDiffX,
        Y: maxY + absDiffY,
      };
    } else {
      antinodeCoordinate1 = {
        X: minX - absDiffX,
        Y: maxY + absDiffY,
      };
      // console.log('prva ', antinodeCoordinate1);
      antinodeCoordinate2 = {
        X: maxX + absDiffX,
        Y: minY - absDiffY,
      };
      // console.log('druga ', antinodeCoordinate2);
    }

    this.writeAntinodeToMap(antinodeCoordinate1, dataGrid);
    this.writeAntinodeToMap(antinodeCoordinate2, dataGrid);
  }

  writeAntinodeToMap(antinode: Coordinate, data: Array<Array<string>>): void {
    const x = antinode.X;
    const y = antinode.Y;
    if (x >= 0 && y >= 0 && y < data.length && x < data?.[0].length) {
      // console.log('correct antinode', antinode);
      this.mapOfAntinodes.set(`${x},${y}`, 1);
    } else {
      console.log('wrong antinode', antinode);
    }
  }
}
