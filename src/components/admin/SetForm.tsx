// src/components/admin/SetForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSet } from '@/lib/actions/set.actions';
import { toast } from 'sonner';

export function SetForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', releaseDate: '', logoUrl: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSet(form);
      toast.success('Colección creada');
      router.push('/admin/sets');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear la colección');
      setSaving(false);
    }
  };

  return (
    <form className="new-set-form" onSubmit={handleSubmit}>
      <div className="new-set-field">
        <Label htmlFor="name" className="new-set-label">
          Nombre
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ej: Evoluciones Prismáticas"
          required
          className="new-set-input"
        />
      </div>
      <div className="new-set-field">
        <Label htmlFor="releaseDate" className="new-set-label">
          Fecha de Lanzamiento
        </Label>
        <Input
          id="releaseDate"
          type="date"
          value={form.releaseDate}
          onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
          required
          className="new-set-input"
        />
      </div>
      <div className="new-set-field">
        <Label htmlFor="logoUrl" className="new-set-label">
          URL del Logo (opcional)
        </Label>
        <Input
          id="logoUrl"
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          placeholder="https://ejemplo.com/logo.png"
          className="new-set-input"
        />
      </div>
      <div className="new-set-actions">
        <Button asChild variant="outline" className="new-set-btn-cancel">
          <Link href="/admin/sets">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={saving} className="new-set-btn-submit">
          {saving ? 'Creando…' : 'Crear Colección'}
        </Button>
      </div>
    </form>
  );
}
