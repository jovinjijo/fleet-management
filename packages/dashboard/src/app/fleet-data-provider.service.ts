import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { handleError, RemoteResponse } from 'src/util/util';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { SocketUpdate } from '@fleet-management/api';

interface FleetTableView {
  uuid: string;
  speed: number;
  latitude: number;
  longitude: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FleetDataProviderService {
  private socket: Socket;
  private observer: Observer<SocketUpdate>;

  constructor(private http: HttpClient) {
    this.socket = io();
  }

  getVehicleUpdates(): Observable<SocketUpdate> {
    this.socket.on('locationUpdate', (data) => {
      this.observer.next(data);
    });

    return this.createObservable();
  }

  createObservable(): Observable<SocketUpdate> {
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  getAll(): Observable<FleetTableView[]> {
    return this.http.get<RemoteResponse>('api/v1/fleet').pipe(
      catchError(
        handleError<RemoteResponse>('getAll', { status: 'ERROR' })
      ),
      tap((data) => {
        if (data.status === 'ERROR') {
          handleError<RemoteResponse>('getAll', { status: 'ERROR' });
        }
      }),
      map((response) => response.data || {}),
      map((fleetData) => {
        return Object.keys(fleetData).map((key) => ({
          uuid: key,
          speed: fleetData[key].speed,
          ...fleetData[key].position.coord,
          date: new Date(fleetData[key].position.timestamp),
        }));
      })
    );
  }
}
