import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { items, customerName, customerEmail, customerPhone, shippingAddress } = await req.json()
    const session = await getSession()
    const userId = session ? (session as any).id : null

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş' }, { status: 400 })
    }

    const totalAmount = items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0)

    // Execute within a transaction to mathematically deduct stock
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          status: 'PAID', // Simulated successful payment
          items: {
            create: items.map((i: any) => ({
              productId: i.productId,
              variantId: i.variantId || null,
              productName: i.name,
              size: i.size || null,
              quantity: i.quantity,
              price: i.price
            }))
          }
        }
      })

      // 2. Decrement numerical stock from the specific variants safely
      for (const item of items) {
        if (item.variantId) {
          // Verify stock exists first
          const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
          if (!variant || variant.stock < item.quantity) {
             throw new Error(`Yetersiz stok: ${item.name} (${item.size})`)
          }

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          })
        }
      }

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sipariş oluşturulamadı' }, { status: 500 })
  }
}
