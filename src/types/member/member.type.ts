export interface EarliestPointExpired {
  expiration_date: string
  point: number
}

export interface PointExpirations {
  points: string | number
  expirationDate: string
}

export interface MemberProfile {
  member_code: string
  first_name: string
  last_name: string
  phone_no: string
  email: string
  gender: string
  date_of_birth: string
  citizen_id?: string
  nationality?: string
  passport_id?: string
  point_balance: number
  register_date: string
  member_date: string
  language: string | null
  ref_member_code: string | null
  earliest_point_expired?: EarliestPointExpired | null
  point_expirations?: PointExpirations[] | null
  check_pop_up?: boolean
  line_uid: string
  line_image_url: string
  line_display_name: string
  total_lucky_draws: number
}

export interface MemberCard {
  card_code: string
  card_expire_date: string
}

export interface MemberTier {
  tier_code: string
  tier_type: string
  tier_start_date: string
  tier_end_date: string
  total_spending: number
  maintain_spending: number | string
  limit_tier: number
  tier_image_url: string | null
  next_tier_name: string
}

export interface MemberLine {
  line_uid: string
  line_image_url: string
  line_display_name: string
  app_domain: string
}

export interface Member {
  member_profile: MemberProfile
  member_line: MemberLine
  member_card: MemberCard
  member_tier: MemberTier
  member_service_tier: string | null
  member_position: string | null
  member_subscription: string | null
  subscription_expire_date: string | null
  is_subscription: boolean
  notification: string | null
}
