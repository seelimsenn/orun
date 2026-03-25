import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { name, description, price, imageUrl, category, subcategory } = payload
    
    if (!name || !price || !imageUrl || !category || !subcategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl,
        category,
        subcategory
      }
    })

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'Standart']
    const variantData = sizes.map(size => ({
      size,
      stock: parseInt(payload[`stock_${size}`] || '0'),
      productId: product.id
    })).filter(v => v.stock > 0 || v.size === 'Standart')
    
    if (variantData.length) await prisma.productVariant.createMany({ data: variantData })

    const images = [imageUrl, payload.image1, payload.image2, payload.image3].filter(Boolean)
    const imgData = images.map((url, i) => ({ url, order: i, productId: product.id }))
    if (imgData.length) await prisma.productImage.createMany({ data: imgData })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
