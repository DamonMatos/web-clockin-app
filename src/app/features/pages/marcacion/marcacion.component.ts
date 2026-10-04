import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Marcacion } from '../../models/marcacion';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MarcacionService } from '../../service/marcacion.service';

@Component({
  selector: 'app-marcacion',
  imports: [ReactiveFormsModule],
  standalone: true,
  providers: [DatePipe],
  templateUrl: './marcacion.component.html',
  styleUrl: './marcacion.component.css',
})
export class MarcacionComponent implements OnInit, OnDestroy {
  private datePipe = inject(DatePipe);
  private readonly Formbuilder = inject(FormBuilder);
  private timerId: any;
  public marcacion!: Marcacion;

  horaActual: string = '00:00:00';
  fechaActual: string = '';
  estaTrabajando: boolean = false;
  ultimoRegistro: string | null = null;
  documentoidentidad: string = '';
  datemdY : string = '';


  readonly fb = this.Formbuilder.group({
    documentoidentidad: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Validación: 8 dígitos numéricos
  });

  constructor(private marcacionservice: MarcacionService) {

  }

  ngOnInit(): void {
    this.actualizarReloj();
    // Iniciar el temporizador para actualizar el reloj segundo a segundo
    this.timerId = setInterval(() => this.actualizarReloj(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private actualizarReloj(): void {
    const ahora = new Date();

    // Formatear hora (HH:MM:SS)
    this.horaActual = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Formatear fecha (Ej: jueves, 1 de octubre de 2026)
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    this.fechaActual = ahora.toLocaleDateString('es-ES', opcionesFecha);
  }

  registrar(): void {
    const ahora = new Date();
    this.datemdY = this.datePipe.transform(ahora, 'MM/dd/yyyy HH:mm:ss') || '';

    if (this.fb.invalid) {
      this.fb.markAllAsTouched();
      return;
    }

    this.documentoidentidad = this.fb.getRawValue().documentoidentidad?.toString() || '';
    this.marcacion = {
      numerodocumento: this.documentoidentidad,
      fecha: this.datemdY,
    };
    
    this.marcacionservice.add(this.marcacion).subscribe({
      next: (response) => {   
        console.log(response);
        this.estaTrabajando = true;
        Swal.fire({
          icon:  'success',  
          text:  "Asistencia registrada correctamente",
          title: "Marcacion exitosa"
        })
      },
      error: (error) => {    
        Swal.fire({
          title: "Error",
          text: error.error.message || "Ocurrió un error al marcar asistencia",
          icon: "error",
          draggable: true
        });
      }
    });
  }
}
