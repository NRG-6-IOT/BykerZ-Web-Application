import {Component, OnInit} from '@angular/core';
import {Assignment} from '@app/assignments/model/assignment.entity';
import {ActivatedRoute} from '@angular/router';
import {
  AssignmentCardDialog
} from '@app/assignments/components/assignment-card-dialog/assignment-card-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
  ],
  templateUrl: './assignment-detail-page.component.html',
  styleUrl: './assignment-detail-page.component.css'
})
export class AssignmentDetailPage implements OnInit{
  assignment?: Assignment;
  assignmentId?: number;

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.assignmentId = idParam ? +idParam : undefined;

    // Intentar extraer el objeto pasado por navigation state
    const navData = (history && history.state) ? (history.state as any).assignment : undefined;
    if (navData) {
      this.assignment = navData as Assignment;
      return;
    }

    // Si no se recibió por state, usar un servicio o fetch para obtener el assignment por id
    // TODO: inyectar AssignmentService y obtener por id:
    // this.assignmentService.getById(this.assignmentId).subscribe(a => this.assignment = a);
  }

  openDialog() {
    this.dialog.open(AssignmentCardDialog, {
      data: { assignment: this.assignment }
    });
  }
}
