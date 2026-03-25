// Google Analytics 4 — E-Commerce Event Tracking Library
// Docs: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Core pageview
export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return
  ;(window as any).gtag('config', GA_TRACKING_ID, { page_path: url })
}

// Generic event
export function event(action: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return
  ;(window as any).gtag('event', action, params)
}

// ─── E-Commerce Specific Events ────────────────────────────

export function viewItem(product: { id: string; name: string; price: number; category: string }) {
  event('view_item', {
    currency: 'TRY',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, item_category: product.category, price: product.price }]
  })
}

export function addToCart(product: { id: string; name: string; price: number; quantity: number; size?: string }) {
  event('add_to_cart', {
    currency: 'TRY',
    value: product.price * product.quantity,
    items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: product.quantity, item_variant: product.size }]
  })
}

export function beginCheckout(items: any[], totalValue: number) {
  event('begin_checkout', {
    currency: 'TRY',
    value: totalValue,
    items: items.map(i => ({ item_id: i.productId || i.id, item_name: i.name, price: i.price, quantity: i.quantity }))
  })
}

export function purchase(orderId: string, totalValue: number, items: any[]) {
  event('purchase', {
    transaction_id: orderId,
    currency: 'TRY',
    value: totalValue,
    items: items.map(i => ({ item_id: i.productId || i.id, item_name: i.name, price: i.price, quantity: i.quantity }))
  })
}

export function signUp(method: string = 'email') {
  event('sign_up', { method })
}

export function login(method: string = 'email') {
  event('login', { method })
}

export function search(searchTerm: string) {
  event('search', { search_term: searchTerm })
}

export function addToWishlist(product: { id: string; name: string; price: number }) {
  event('add_to_wishlist', {
    currency: 'TRY',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }]
  })
}
