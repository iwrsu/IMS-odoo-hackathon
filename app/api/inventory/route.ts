import { NextResponse } from 'next/server';
import {
  confirmDelivery,
  confirmReceipt,
  confirmTransfer,
  createAdjustment,
  createDelivery,
  createProduct,
  createReceipt,
  createTransfer,
  deleteAdjustment,
  deleteDelivery,
  deleteProduct,
  deleteReceipt,
  deleteTransfer,
  getInventorySnapshot,
  updateAdjustment,
  updateDelivery,
  updateProduct,
  updateReceipt,
  updateTransfer,
} from '@/lib/server/inventory-service';

type Action =
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'receipt.create'
  | 'receipt.update'
  | 'receipt.delete'
  | 'receipt.confirm'
  | 'delivery.create'
  | 'delivery.update'
  | 'delivery.delete'
  | 'delivery.confirm'
  | 'transfer.create'
  | 'transfer.update'
  | 'transfer.delete'
  | 'transfer.confirm'
  | 'adjustment.create'
  | 'adjustment.update'
  | 'adjustment.delete';

interface ActionPayload {
  action: Action;
  id?: string;
  payload?: unknown;
}

export async function GET() {
  try {
    const data = await getInventorySnapshot();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ActionPayload;
    const { action, id, payload } = body;

    switch (action) {
      case 'product.create': {
        const product = await createProduct(payload as any);
        return NextResponse.json({ ok: true, data: product, id: product.id });
      }
      case 'product.update': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const product = await updateProduct(id, payload as any);
        return NextResponse.json({ ok: true, data: product, id: product.id });
      }
      case 'product.delete': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        await deleteProduct(id);
        return NextResponse.json({ ok: true });
      }
      case 'receipt.create': {
        const receipt = await createReceipt(payload as any);
        return NextResponse.json({ ok: true, data: receipt, id: receipt.id });
      }
      case 'receipt.update': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const receipt = await updateReceipt(id, payload as any);
        return NextResponse.json({ ok: true, data: receipt, id: receipt.id });
      }
      case 'receipt.delete': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        await deleteReceipt(id);
        return NextResponse.json({ ok: true });
      }
      case 'receipt.confirm': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const receipt = await confirmReceipt(id);
        return NextResponse.json({ ok: true, data: receipt, id: receipt.id });
      }
      case 'delivery.create': {
        const delivery = await createDelivery(payload as any);
        return NextResponse.json({ ok: true, data: delivery, id: delivery.id });
      }
      case 'delivery.update': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const delivery = await updateDelivery(id, payload as any);
        return NextResponse.json({ ok: true, data: delivery, id: delivery.id });
      }
      case 'delivery.delete': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        await deleteDelivery(id);
        return NextResponse.json({ ok: true });
      }
      case 'delivery.confirm': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const delivery = await confirmDelivery(id);
        return NextResponse.json({ ok: true, data: delivery, id: delivery.id });
      }
      case 'transfer.create': {
        const transfer = await createTransfer(payload as any);
        return NextResponse.json({ ok: true, data: transfer, id: transfer.id });
      }
      case 'transfer.update': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const transfer = await updateTransfer(id, payload as any);
        return NextResponse.json({ ok: true, data: transfer, id: transfer.id });
      }
      case 'transfer.delete': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        await deleteTransfer(id);
        return NextResponse.json({ ok: true });
      }
      case 'transfer.confirm': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const transfer = await confirmTransfer(id);
        return NextResponse.json({ ok: true, data: transfer, id: transfer.id });
      }
      case 'adjustment.create': {
        const adjustment = await createAdjustment(payload as any);
        return NextResponse.json({ ok: true, data: adjustment, id: adjustment.id });
      }
      case 'adjustment.update': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        const adjustment = await updateAdjustment(id, payload as any);
        return NextResponse.json({ ok: true, data: adjustment, id: adjustment.id });
      }
      case 'adjustment.delete': {
        if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
        await deleteAdjustment(id);
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ ok: false, error: 'Unsupported action' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
