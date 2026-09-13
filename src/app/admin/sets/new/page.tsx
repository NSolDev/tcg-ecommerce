// src/app/admin/sets/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SetForm } from '@/components/admin/SetForm';
import './new-set.css';

export default function NewSetPage() {
  return (
    <div className="new-set-page">
      <div className="new-set-header">
        <Link href="/admin/sets" className="new-set-back">
          <ArrowLeft className="h-4 w-4" />
          Volver a colecciones
        </Link>
        <h1 className="new-set-title">Nueva Colección</h1>
        <p className="new-set-subtitle">Crea una nueva colección de cartas</p>
      </div>

      <Card className="new-set-card">
        <CardHeader className="new-set-card-header">
          <CardTitle className="new-set-card-title">Información de la Colección</CardTitle>
        </CardHeader>
        <CardContent className="new-set-card-content">
          <SetForm />
        </CardContent>
      </Card>
    </div>
  );
}
