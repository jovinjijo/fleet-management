import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FleetDataProviderService } from '../fleet-data-provider.service';

interface FleetTableView {
  uuid: string;
  speed: number;
  latitude: number;
  longitude: number;
  date: Date;
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class TableViewComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  fleetData: FleetTableView[] = [];

  constructor(private fleetDataProviderService: FleetDataProviderService) {}

  getAll() {
    this.fleetDataProviderService
      .getAll()
      .subscribe((fleetData) => {
        this.fleetData = fleetData
      });
  }
  displayedColumns: string[] = [
    'uuid',
    'date',
    'latitude',
    'longitude',
    'speed',
  ];

  ngOnInit(): void {
    this.getAll();
    this.subscription = this.fleetDataProviderService
      .getVehicleUpdates()
      .subscribe((socketUpdate) => {
        const index = this.fleetData.findIndex(
          (row) => row.uuid === socketUpdate.uuid
        );
        if (index !== -1) {
          this.fleetData[index].date = new Date(
            socketUpdate.position.timestamp
          );
          this.fleetData[index].latitude = socketUpdate.position.coord.latitude;
          this.fleetData[index].longitude =
            socketUpdate.position.coord.longitude;
          this.fleetData[index].speed = socketUpdate.speed;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
