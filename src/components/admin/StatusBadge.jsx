import React from 'react';
import Badge from '../ui/Badge';

const STATUS_CONFIG = {
  pending: { label: 'En attente', tone: 'lavender' },
  confirmed: { label: 'Confirmée', tone: 'teal' },
  shipped: { label: 'Expédiée', tone: 'sage' },
  delivered: { label: 'Livrée', tone: 'lavender' },
  cancelled: { label: 'Annulée', tone: 'terracotta' },
  paid: { label: 'Payée', tone: 'teal' },
  failed: { label: 'Échec', tone: 'terracotta' },
  cod: { label: 'À la livraison', tone: 'blush' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, tone: 'lavender' };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
