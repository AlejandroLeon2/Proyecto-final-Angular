import { Component } from '@angular/core';
import { LucideAngularModule,  Package, CreditCard, Truck } from 'lucide-angular';
import { Acordion } from '../../components/acordion/acordion';
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'pedidos' | 'pagos' | 'envios';
  icon: any;
}

@Component({
  selector: 'app-frequently-questions',
  imports: [LucideAngularModule,Acordion],
  templateUrl: './frequently-questions.html',
  styleUrl: './frequently-questions.css',
})
export class FrequentlyQuestions {



  faqs: FAQ[] = [
    {
      id: 1,
      question: "¿Cómo puedo hacer un pedido?",
      answer: "Para realizar un pedido, simplemente navega por nuestro catálogo, selecciona los productos que desees añadiéndolos al carrito, y luego haz clic en el carrito para proceder al checkout. Completa tus datos de envío y pago, y confirma tu pedido. Recibirás un email de confirmación con todos los detalles.",
      category: "pedidos",
      icon: Package
    },
    {
      id: 2,
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos múltiples métodos de pago para tu comodidad: tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, Yape, Plin, y Mercado Pago. Todos los pagos son procesados de forma segura con encriptación SSL.",
      category: "pagos",
      icon: CreditCard
    },
    {
      id: 3,
      question: "¿Cuánto tiempo tarda el envío?",
      answer: "Los tiempos de envío varían según la ubicación. En Lima Metropolitana, el envío estándar toma 2-3 días hábiles. Para provincias, el tiempo estimado es de 5-7 días hábiles. Si eliges envío express, tu pedido llegará en 24-48 horas dentro de Lima. Todos los pedidos incluyen número de seguimiento.",
      category: "envios",
      icon: Truck
    }
  ];


}
