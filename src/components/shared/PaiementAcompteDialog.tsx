import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createPayment } from '@/services/paymentsApi';
import type { PaymentMethod, PaymentOperator } from '@/types/Payment';

interface PaiementAcompteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  montant: string;
  onSuccess: () => void;
}

export default function PaiementAcompteDialog({
  open,
  onOpenChange,
  reservationId,
  montant,
  onSuccess,
}: PaiementAcompteDialogProps) {
  const [methode, setMethode] = useState<PaymentMethod>('MOBILE_MONEY');
  const [operateur, setOperateur] = useState<PaymentOperator>('MVOLA');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const estMobileMoney = methode === 'MOBILE_MONEY';

  async function handleSubmit() {
    if (estMobileMoney && !telephone.trim()) {
      setErreur('Merci de renseigner le numéro de téléphone.');
      return;
    }
    setErreur('');
    setLoading(true);
    try {
      await createPayment({
        amount: montant,
        paymentMethod: methode,
        operator: estMobileMoney ? operateur : 'NONE',
        phoneNumber: estMobileMoney ? telephone.trim() : undefined,
        reservationId,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setErreur(err?.response?.data?.detail || "Impossible d'enregistrer le paiement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payer l'acompte — {montant} $</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div>
            <Label>Méthode de paiement</Label>
            <Select value={methode} onValueChange={(v) => setMethode(v as PaymentMethod)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                <SelectItem value="CASH">Espèces</SelectItem>
                <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
                <SelectItem value="CREDIT_CARD">Carte bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {estMobileMoney && (
            <>
              <div>
                <Label>Opérateur</Label>
                <Select value={operateur} onValueChange={(v) => setOperateur(v as PaymentOperator)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MVOLA">MVola</SelectItem>
                    <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
                    <SelectItem value="AIRTEL_MONEY">Airtel Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Numéro de téléphone</Label>
                <Input
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="034 00 000 00"
                  className="mt-1"
                />
              </div>
            </>
          )}

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Envoi...' : 'Confirmer le paiement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}