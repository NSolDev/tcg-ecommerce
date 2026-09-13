// src/components/account/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/lib/actions/account.actions';
import { Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormProps {
  name: string;
  email: string;
  image: string;
}

export function ProfileForm({ name: initialName, email, image: initialImage }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, image });
      toast.success('Perfil actualizado');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="settings-card-content">
      <div className="settings-field">
        <Label htmlFor="name" className="settings-field-label">
          Nombre
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          className="settings-field-input"
        />
      </div>
      <div className="settings-field">
        <Label htmlFor="email" className="settings-field-label">
          Email
        </Label>
        <Input
          id="email"
          defaultValue={email}
          disabled
          className="settings-field-input settings-field-input-disabled"
        />
        <p className="settings-field-hint">El email no se puede cambiar</p>
      </div>
      <div className="settings-field">
        <Label htmlFor="avatar" className="settings-field-label">
          <div className="settings-field-label-with-icon">
            <ImageIcon className="h-4 w-4" />
            Avatar (URL)
          </div>
        </Label>
        <Input
          id="avatar"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://ejemplo.com/avatar.jpg"
          className="settings-field-input"
        />
        <p className="settings-field-hint">Introduce la URL de tu imagen de perfil</p>
      </div>
      <Button type="submit" disabled={saving} className="settings-btn-primary">
        <Save className="btn-icon" />
        {saving ? 'Guardando…' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
