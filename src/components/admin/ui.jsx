import { motion } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Users, Truck, TicketPercent,
  BarChart3, FileText, Settings2, UserRound, History, Wallet, ShoppingBasket, Clock, CheckCircle2,
  Users2, AlertTriangle, Receipt, Target, Plus, Package, Box, ChartPie, Leaf, LogOut,
} from 'lucide-react'

/* Maps string icon names (from adminData) to lucide-react icons */
export const ADMIN_ICONS = {
  layout: LayoutDashboard,
  shoppingBag: ShoppingBag,
  clipboard: ClipboardList,
  users: Users,
  box: Box,
  truck: Truck,
  ticket: TicketPercent,
  chart: BarChart3,
  fileText: FileText,
  settings: Settings2,
  user: UserRound,
  history: History,
  wallet: Wallet,
  basket: ShoppingBasket,
  clock: Clock,
  check: CheckCircle2,
  users2: Users2,
  alert: AlertTriangle,
  receipt: Receipt,
  target: Target,
  plus: Plus,
  package: Package,
  chartPie: ChartPie,
  leaf: Leaf,
  logout: LogOut,
}

export function AdminIcon({ name, ...props }) {
  const Icon = ADMIN_ICONS[name] || Leaf
  return <Icon {...props} />
}

/* Section wrapper with consistent heading styles */
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="font-serif-display text-lg sm:text-xl font-bold text-dark tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-dark/40 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* Scroll-reveal used across dashboard sections */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
