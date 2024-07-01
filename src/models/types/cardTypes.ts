import cachIcon from '@/assets/images/icons/cash.png'
import bankIcon from '@/assets/images/icons/bank-card.png'
import type Card from '@/models/Card'

export type TCardMoney = 'cash' | 'bank'
export type TCardIcon = typeof cachIcon | typeof bankIcon

export type TWallet = Record<string, Card>
