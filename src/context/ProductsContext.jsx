import { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react'
import { productApi } from '../api'
import { useAuth } from './AuthContext'

/* ====================================================================
   PRODUCTS CONTEXT — MongoDB-backed catalog.
   The API returns the canonical product document (admin shape); this
   context maps it to BOTH the shop shape (price/originalPrice/category
   name/reviews) and the admin shape (sellingPrice/mrp/sku/status).
   ==================================================================== */

const ProductsCtx = createContext(null)

export const toShopProduct = (p) => ({
  ...p,
  id: p._id || p.id,
  price: p.price ?? p.sellingPrice ?? 0,
  originalPrice: p.originalPrice ?? p.mrp ?? 0,
  sellingPrice: p.sellingPrice ?? p.price ?? 0,
  mrp: p.mrp ?? p.originalPrice ?? 0,
  category: p.categoryName || p.category || 'Uncategorized',
  reviews: p.reviewCount ?? p.reviews ?? 0,
})

export const toAdminProduct = (p) => ({
  ...p,
  _id: p._id || p.id,
  id: p.id || p._id,
  sellingPrice: p.sellingPrice ?? p.price ?? 0,
  mrp: p.mrp ?? p.originalPrice ?? 0,
  price: p.price ?? p.sellingPrice ?? 0,
  originalPrice: p.originalPrice ?? p.mrp ?? 0,
  reviewCount: p.reviewCount ?? p.reviews ?? 0,
})

export function ProductsProvider({ children }) {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      // /products/all is admin-only — don't fire it for non-admin sessions.
      const shop = await productApi.list({ limit: 100 })
      const cats = await productApi.allCategories().catch(() => [])
      const shopItems = (shop.items || []).map(toShopProduct)
      if (shopItems.length) setProducts(shopItems)
      if (isAdmin) {
        const admin = await productApi.all({ limit: 100 }).catch(() => ({ items: [] }))
        setAllProducts((admin.items || []).map(toAdminProduct))
      }
      setCategories(cats || [])
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load products')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => { refresh() }, [refresh])

  const productById = useCallback((id) => {
    if (!id) return null
  
    return (
      allProducts.find((p) => p._id === id || p.id === id) ||
      products.find((p) => p.id === id || p._id === id) ||
      null
    )
  }, [allProducts, products])

  const saveProduct = useCallback(async (data) => {
    const isNew = !data._id || data._id.startsWith('new_') || !data.slug
    const payload = {
      ...data,
      _id: data._id && !data._id.startsWith('new_') ? data._id : undefined,
      id: undefined,
      price: data.price ?? data.sellingPrice,
      originalPrice: data.originalPrice ?? data.mrp,
      category: data.categoryId || data.category,
      categoryName: data.categoryName,
    }
    const saved = isNew ? await productApi.create(payload) : await productApi.update(data._id, payload)
    await refresh()
    return saved
  }, [refresh])

  const value = useMemo(() => ({
    products, allProducts, categories, loading, error,
    productById, saveProduct, refresh,
  }), [products, allProducts, categories, loading, error, productById, saveProduct, refresh])

  return <ProductsCtx.Provider value={value}>{children}</ProductsCtx.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsCtx)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
