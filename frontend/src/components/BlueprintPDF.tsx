import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

// ── Font Registration ─────────────────────────────────────────────────────────
// Using built-in Helvetica family (Helvetica, Helvetica-Bold, Helvetica-Oblique)
// and Courier for mono code blocks — no external CDN needed.

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:           '#0D0D1A',
  bgCard:       '#12121F',
  bgCardAlt:    '#16162A',
  bgTable:      '#0A0A14',
  border:       '#1E1E3A',
  borderLight:  '#252545',
  accent:       '#7C3AED',
  accentLight:  '#A78BFA',
  accentMid:    '#6D28D9',
  blue:         '#3B82F6',
  teal:         '#06B6D4',
  green:        '#10B981',
  amber:        '#F59E0B',
  red:          '#EF4444',
  pink:         '#EC4899',
  white:        '#FFFFFF',
  slate50:      '#F8FAFC',
  slate200:     '#E2E8F0',
  slate400:     '#94A3B8',
  slate500:     '#64748B',
  slate600:     '#475569',
  slate700:     '#334155',
  slate800:     '#1E293B',
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Page layouts ──
  page: {
    backgroundColor: C.bg,
    color: C.slate200,
    fontFamily: 'Helvetica',
    padding: 0,
    fontSize: 9,
  },

  // ── Cover page ──
  coverPage: {
    backgroundColor: C.bg,
    flex: 1,
    padding: 0,
  },
  coverTopBar: {
    backgroundColor: C.accentMid,
    height: 6,
  },
  coverBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 40,
  },
  coverEyebrow: {
    backgroundColor: '#7C3AED33',
    borderWidth: 1,
    borderColor: '#7C3AED66',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 28,
  },
  coverEyebrowText: {
    color: C.accentLight,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 1.25,
  },
  coverIndustry: {
    fontSize: 12,
    color: C.accentLight,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  coverSubtitle: {
    fontSize: 11,
    color: C.slate400,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 1.6,
  },
  coverAccentLine: {
    width: 80,
    height: 3,
    backgroundColor: C.accent,
    borderRadius: 2,
    marginBottom: 48,
  },
  coverMeta: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 16,
  },
  coverMetaItem: {
    alignItems: 'center',
  },
  coverMetaLabel: {
    fontSize: 7,
    color: C.slate500,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 10,
    color: C.slate200,
    fontFamily: 'Helvetica-Bold',
  },
  coverMetaDivider: {
    width: 1,
    backgroundColor: C.border,
    marginHorizontal: 4,
  },
  coverIdeaBox: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 18,
    maxWidth: 380,
    marginTop: 32,
  },
  coverIdeaLabel: {
    fontSize: 7,
    color: C.slate500,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  coverIdeaText: {
    fontSize: 10,
    color: C.slate200,
    lineHeight: 1.7,
    textAlign: 'center',
  },
  coverBottomBar: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  coverBottomLeft: {
    fontSize: 8,
    color: C.slate600,
  },
  coverBottomRight: {
    fontSize: 9,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },

  // ── Table of Contents page ──
  tocPage: {
    backgroundColor: C.bg,
    flex: 1,
    padding: 48,
  },
  tocTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 6,
  },
  tocSubtitle: {
    fontSize: 9,
    color: C.slate500,
    marginBottom: 28,
    letterSpacing: 0.3,
  },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A30',
  },
  tocRowLast: {
    borderBottomWidth: 0,
  },
  tocNum: {
    width: 26,
    fontSize: 8,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },
  tocIcon: {
    width: 22,
    height: 22,
    backgroundColor: '#7C3AED18',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tocIconText: {
    fontSize: 8,
    color: C.accentLight,
    fontFamily: 'Helvetica-Bold',
  },
  tocLabel: {
    flex: 1,
    fontSize: 11,
    color: C.slate200,
    fontFamily: 'Helvetica-Bold',
  },
  tocDesc: {
    fontSize: 8,
    color: C.slate500,
    marginTop: 1,
  },
  tocDots: {
    flex: 1,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E3A',
    borderBottomStyle: 'dashed',
  },
  tocPage2: {
    fontSize: 9,
    color: C.slate500,
    fontFamily: 'Helvetica-Bold',
    width: 20,
    textAlign: 'right',
  },

  // ── Content page ──
  contentPage: {
    backgroundColor: C.bg,
    flex: 1,
    paddingHorizontal: 42,
    paddingTop: 36,
    paddingBottom: 52,
  },

  // ── Section header ──
  sectionHeader: {
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sectionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionBadge: {
    backgroundColor: '#7C3AED25',
    borderRadius: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 10,
  },
  sectionBadgeText: {
    color: C.accentLight,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.8,
  },
  sectionChapter: {
    fontSize: 8,
    color: C.slate500,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    lineHeight: 1.2,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 42,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#12122A',
  },
  footerLeft: {
    fontSize: 7,
    color: C.slate600,
  },
  footerCenter: {
    fontSize: 7,
    color: C.slate700,
  },
  footerRight: {
    fontSize: 7,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Cards ──
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardAccent: {
    backgroundColor: C.bgCard,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.accentLight,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 8,
    color: C.accent,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
  },
  cardText: {
    fontSize: 9,
    color: C.slate400,
    lineHeight: 1.7,
  },

  // ── Key-value row ──
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#14142A',
  },
  kvKey: {
    fontSize: 8,
    color: C.slate500,
  },
  kvVal: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.slate200,
    maxWidth: '60%',
    textAlign: 'right',
  },

  // ── Labels ──
  label: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.slate500,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
  },

  // ── Body text ──
  bodyText: {
    fontSize: 9.5,
    color: C.slate400,
    lineHeight: 1.75,
    marginBottom: 14,
  },
  bodyTextSmall: {
    fontSize: 8.5,
    color: C.slate400,
    lineHeight: 1.7,
  },

  // ── Tables ──
  tableWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#14142A',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#12122A',
  },
  tableRowAlt: {
    backgroundColor: '#0E0E1E',
  },
  tableHeaderText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.slate400,
    letterSpacing: 1,
  },
  tableCell: {
    fontSize: 8.5,
    color: C.slate400,
    lineHeight: 1.5,
  },
  tableCellBold: {
    fontSize: 8.5,
    color: C.slate200,
    fontFamily: 'Helvetica-Bold',
  },
  tableCellMono: {
    fontSize: 8,
    color: C.accentLight,
    fontFamily: 'Courier',
  },
  tableCellMonoBlue: {
    fontSize: 8,
    color: C.blue,
    fontFamily: 'Courier',
  },

  // ── Grid ──
  grid2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  grid3: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
  },

  // ── Priority buckets ──
  priorityBucket: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  priorityBucketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityBucketLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 0.5,
  },
  priorityBucketSub: {
    fontSize: 7,
    color: C.slate500,
    marginLeft: 'auto',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: '#7C3AED20',
    borderWidth: 1,
    borderColor: '#7C3AED44',
  },
  chipText: {
    fontSize: 7.5,
    color: C.accentLight,
    fontFamily: 'Courier',
  },

  // ── Sprint roadmap ──
  sprintGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  sprintCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  sprintHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sprintLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  sprintSubLabel: {
    fontSize: 7,
    color: C.slate500,
    marginTop: 1,
  },
  sprintBody: {
    padding: 8,
  },
  sprintItem: {
    backgroundColor: '#0A0A18',
    borderRadius: 4,
    padding: 6,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#14142A',
  },
  sprintItemId: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accentLight,
    marginBottom: 2,
  },
  sprintItemDesc: {
    fontSize: 7,
    color: C.slate500,
    lineHeight: 1.4,
  },

  // ── Cost cards ──
  costCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  costCardHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    alignItems: 'center',
  },
  costTierLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  costTierSub: {
    fontSize: 7,
    color: C.slate500,
    marginTop: 2,
  },
  costCardBody: {
    padding: 10,
  },
  costTotal: {
    padding: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  costTotalLabel: {
    fontSize: 7,
    color: C.slate500,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  costTotalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Code block ──
  codeBlock: {
    backgroundColor: '#060610',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#12122A',
  },
  codeText: {
    fontSize: 7.5,
    fontFamily: 'Courier',
    color: '#7C9BC0',
    lineHeight: 1.8,
  },

  // ── Insight box ──
  insightBox: {
    backgroundColor: '#7C3AED14',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#7C3AED33',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 9,
    color: C.accentLight,
    lineHeight: 1.7,
  },

  // ── Summary stat ──
  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 7,
    color: C.slate500,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
})

// ── Helper Components ─────────────────────────────────────────────────────────

const Footer = ({ title, pageLabel }: { title: string; pageLabel?: string }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerLeft}>{title}</Text>
    <Text style={styles.footerCenter}>CONFIDENTIAL · FOUNDRY AI GENERATED</Text>
    <Text style={styles.footerRight}>{pageLabel || 'Foundry AI'}</Text>
  </View>
)

const SectionHeader = ({ badge, chapter, title }: { badge: string; chapter: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTopRow}>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{badge}</Text>
      </View>
      <Text style={styles.sectionChapter}>{chapter}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
)

const Label = ({ children }: { children: string }) => (
  <Text style={styles.label}>{children}</Text>
)

// ── Table of Contents Data ────────────────────────────────────────────────────
const TOC_ITEMS = [
  { num: '01', badge: 'RESEARCH', label: 'Competitor & Market Analysis', desc: 'Market overview, identified competitors, and opportunity gaps', page: '3' },
  { num: '02', badge: 'PRD', label: 'Product Requirements Document', desc: 'Core product vision, features, and functional specifications', page: '4' },
  { num: '03', badge: 'UX', label: 'User Persona Profiles', desc: 'Target audience archetypes, goals, and pain points', page: '5' },
  { num: '04', badge: 'AGILE', label: 'User Story Backlog', desc: 'Full feature backlog written in standard agile user story format', page: '6' },
  { num: '05', badge: 'MOSCOW', label: 'Priority Classification', desc: 'MoSCoW-weighted prioritization of all user stories', page: '7' },
  { num: '06', badge: 'ARCH', label: 'Technical Architecture', desc: 'Database schema, REST API routes, and system design', page: '8' },
  { num: '07', badge: 'ROADMAP', label: 'Sprint Roadmap', desc: '4-sprint delivery plan with story assignments and milestones', page: '9' },
  { num: '08', badge: 'FINOPS', label: 'Infrastructure Cost Model', desc: 'Monthly cost projections across 3 user-scale tiers', page: '10' },
  { num: '09', badge: 'CODE', label: 'Repository Scaffolding', desc: 'Project folder structure and development setup instructions', page: '11' },
  { num: '10', badge: 'UI', label: 'UI/UX Blueprint', desc: 'Design system, brand rationale, and wireframe specifications', page: '12' },
]

// ── Main PDF Document ─────────────────────────────────────────────────────────

interface BlueprintPDFProps {
  projectTitle: string
  industry?: string
  idea: string
  outputs: any
}

export const BlueprintPDF: React.FC<BlueprintPDFProps> = ({
  projectTitle,
  industry,
  idea,
  outputs,
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sectionCount = [
    outputs?.research, outputs?.prd, outputs?.personas,
    outputs?.userStories, outputs?.prioritization, outputs?.architecture,
    outputs?.roadmap, outputs?.costEstimate, outputs?.scaffolding, outputs?.ui,
  ].filter(Boolean).length

  return (
    <Document title={`${projectTitle} — Foundry Blueprint`} author="Foundry AI">

      {/* ══════════════════════════════════════════════════════════
          COVER PAGE
      ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverTopBar} />

          <View style={styles.coverBody}>
            <View style={styles.coverEyebrow}>
              <Text style={styles.coverEyebrowText}>FOUNDRY AI · STARTUP BLUEPRINT</Text>
            </View>

            <Text style={styles.coverTitle}>{projectTitle}</Text>

            {industry && (
              <Text style={styles.coverIndustry}>{industry.toUpperCase()}</Text>
            )}

            <Text style={styles.coverSubtitle}>
              AI-Generated Product Specification Document{'\n'}
              Comprehensive Blueprint · {sectionCount} Modules
            </Text>

            <View style={styles.coverAccentLine} />

            <View style={styles.coverMeta}>
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>GENERATED</Text>
                <Text style={styles.coverMetaValue}>{today}</Text>
              </View>
              <View style={styles.coverMetaDivider} />
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>SECTIONS</Text>
                <Text style={styles.coverMetaValue}>{sectionCount} of 10</Text>
              </View>
              <View style={styles.coverMetaDivider} />
              <View style={styles.coverMetaItem}>
                <Text style={styles.coverMetaLabel}>PLATFORM</Text>
                <Text style={styles.coverMetaValue}>Foundry AI</Text>
              </View>
            </View>

            <View style={styles.coverIdeaBox}>
              <Text style={styles.coverIdeaLabel}>PRODUCT IDEA</Text>
              <Text style={styles.coverIdeaText}>{idea}</Text>
            </View>
          </View>

          <View style={styles.coverBottomBar}>
            <Text style={styles.coverBottomLeft}>
              This document is AI-generated and intended for internal planning use.
            </Text>
            <Text style={styles.coverBottomRight}>FOUNDRY AI</Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════════
          TABLE OF CONTENTS
      ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.tocPage}>
          <Text style={styles.tocTitle}>Table of Contents</Text>
          <Text style={styles.tocSubtitle}>This blueprint contains {sectionCount} AI-generated sections covering your full product lifecycle.</Text>

          {TOC_ITEMS.map((item, i) => (
            <View key={i} style={[styles.tocRow, i === TOC_ITEMS.length - 1 ? styles.tocRowLast : {}]}>
              <View style={styles.tocIcon}>
                <Text style={styles.tocIconText}>{item.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tocLabel}>{item.label}</Text>
                <Text style={styles.tocDesc}>{item.desc}</Text>
              </View>
              <View style={styles.tocDots} />
              <Text style={styles.tocPage2}>{item.page}</Text>
            </View>
          ))}
        </View>
        <Footer title={projectTitle} pageLabel="Contents" />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          01 · COMPETITOR RESEARCH
      ══════════════════════════════════════════════════════════ */}
      {outputs?.research && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="01 · RESEARCH" chapter="Chapter One" title="Competitor & Market Analysis" />

            <Text style={styles.bodyText}>{outputs.research.market_overview}</Text>

            <Label>IDENTIFIED COMPETITORS</Label>
            {outputs.research.competitors?.map((comp: any, i: number) => (
              <View key={i} style={styles.cardAccent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={styles.cardTitle}>{comp.name}</Text>
                  <Text style={[styles.cardText, { color: C.accent, fontSize: 8 }]}>{comp.url}</Text>
                </View>
                <Text style={styles.cardText}>{comp.summary}</Text>
              </View>
            ))}

            <Label>MARKET OPPORTUNITIES & GAPS</Label>
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>{outputs.research.opportunities}</Text>
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Research · 01" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          02 · PRD
      ══════════════════════════════════════════════════════════ */}
      {outputs?.prd && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="02 · PRD" chapter="Chapter Two" title={outputs.prd.title || 'Product Requirements Document'} />

            <Label>PRODUCT SUMMARY</Label>
            <Text style={styles.bodyText}>{outputs.prd.summary}</Text>

            <Label>CORE FEATURES</Label>
            <View style={styles.grid2}>
              {outputs.prd.features?.map((feat: any, i: number) => (
                <View key={i} style={[styles.card, styles.gridItem]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ width: 20, height: 20, backgroundColor: '#7C3AED22', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                      <Text style={{ fontSize: 8, color: C.accentLight, fontFamily: 'Helvetica-Bold' }}>{i + 1}</Text>
                    </View>
                    <Text style={styles.cardTitle}>{feat.name}</Text>
                  </View>
                  <Text style={styles.cardText}>{feat.description}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="PRD · 02" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          03 · USER PERSONAS
      ══════════════════════════════════════════════════════════ */}
      {outputs?.personas && outputs.personas.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="03 · UX RESEARCH" chapter="Chapter Three" title="User Persona Profiles" />

            <View style={styles.grid2}>
              {outputs.personas.map((pers: any, i: number) => (
                <View key={i} style={[styles.card, styles.gridItem]}>
                  {/* Persona header */}
                  <View style={{ backgroundColor: '#7C3AED18', borderRadius: 6, padding: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 2 }}>
                      {pers.name}
                    </Text>
                    <Text style={{ fontSize: 8, color: C.accentLight, fontFamily: 'Helvetica-Bold' }}>{pers.role}</Text>
                    {pers.age && (
                      <Text style={{ fontSize: 7, color: C.slate500, marginTop: 2 }}>Age: {pers.age}</Text>
                    )}
                  </View>

                  <Label>GOAL</Label>
                  <Text style={[styles.cardText, { marginBottom: 8 }]}>{pers.goal}</Text>

                  <Label>PAIN POINT</Label>
                  <Text style={styles.cardText}>{pers.frustration}</Text>

                  {pers.quote && (
                    <View style={{ marginTop: 10, borderLeftWidth: 2, borderLeftColor: C.accent, paddingLeft: 8 }}>
                      <Text style={{ fontSize: 8, color: C.slate400, fontFamily: 'Helvetica-Oblique', lineHeight: 1.5 }}>
                        "{pers.quote}"
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Personas · 03" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          04 · USER STORIES
      ══════════════════════════════════════════════════════════ */}
      {outputs?.userStories && outputs.userStories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="04 · AGILE SCOPE" chapter="Chapter Four" title="User Story Backlog" />

            {/* Stat row */}
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{outputs.userStories.length}</Text>
                <Text style={styles.statLabel}>TOTAL STORIES</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: C.green }]}>
                  {outputs.prioritization?.mustHave?.length ?? '—'}
                </Text>
                <Text style={styles.statLabel}>MUST HAVE</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: C.amber }]}>
                  {outputs.prioritization?.shouldHave?.length ?? '—'}
                </Text>
                <Text style={styles.statLabel}>SHOULD HAVE</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: C.blue }]}>
                  {outputs.prioritization?.couldHave?.length ?? '—'}
                </Text>
                <Text style={styles.statLabel}>COULD HAVE</Text>
              </View>
            </View>

            <Label>FULL STORY BACKLOG</Label>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: 52 }]}>ID</Text>
                <Text style={[styles.tableHeaderText, { width: 130 }]}>STORY TITLE</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>DESCRIPTION</Text>
              </View>
              {outputs.userStories.map((story: any, idx: number) => (
                <View key={story.id} style={[styles.tableRow, idx % 2 !== 0 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCellMono, { width: 52 }]}>{story.id}</Text>
                  <Text style={[styles.tableCellBold, { width: 130, paddingRight: 8 }]}>{story.title}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{story.description}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Stories · 04" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          05 · PRIORITIZATION
      ══════════════════════════════════════════════════════════ */}
      {outputs?.prioritization && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="05 · MOSCOW" chapter="Chapter Five" title="Priority Classification" />

            <Text style={styles.bodyText}>
              Features have been classified using the MoSCoW method to guide MVP scoping and iterative delivery.
            </Text>

            {[
              {
                label: 'MUST HAVE',
                sub: 'Critical for launch — product fails without these',
                color: C.red,
                bg: '#7F1D1D15',
                border: '#EF444440',
                ids: outputs.prioritization.mustHave,
              },
              {
                label: 'SHOULD HAVE',
                sub: 'Important but not launch-blocking',
                color: C.amber,
                bg: '#78350F15',
                border: '#F59E0B40',
                ids: outputs.prioritization.shouldHave,
              },
              {
                label: 'COULD HAVE',
                sub: 'Nice-to-have for future iterations',
                color: C.green,
                bg: '#06451515',
                border: '#10B98140',
                ids: outputs.prioritization.couldHave,
              },
            ].map((bucket) => (
              <View key={bucket.label} style={[styles.priorityBucket, { backgroundColor: bucket.bg, borderColor: bucket.border }]}>
                <View style={styles.priorityBucketHeader}>
                  <View style={[styles.priorityDot, { backgroundColor: bucket.color }]} />
                  <Text style={styles.priorityBucketLabel}>{bucket.label}</Text>
                  <Text style={styles.priorityBucketSub}>{bucket.sub}</Text>
                </View>
                <View style={styles.chipRow}>
                  {bucket.ids?.map((id: string) => {
                    const story = outputs.userStories?.find((s: any) => s.id === id)
                    return (
                      <View key={id} style={[styles.chip, { borderColor: bucket.color + '44', backgroundColor: bucket.color + '15' }]}>
                        <Text style={[styles.chipText, { color: bucket.color }]}>{id}{story ? ` · ${story.title}` : ''}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            ))}
          </View>
          <Footer title={projectTitle} pageLabel="Priority · 05" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          06 · ARCHITECTURE
      ══════════════════════════════════════════════════════════ */}
      {outputs?.architecture && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="06 · ARCHITECTURE" chapter="Chapter Six" title="Technical Architecture Blueprint" />

            <Label>DATABASE SCHEMA</Label>
            <View style={styles.grid2}>
              {outputs.architecture.tables?.map((table: any, i: number) => (
                <View key={i} style={[styles.card, styles.gridItem, { borderTopWidth: 2, borderTopColor: C.teal }]}>
                  <Text style={[styles.cardTitle, { color: C.teal, marginBottom: 8 }]}>
                    📦 {table.name}
                  </Text>
                  {table.columns?.map((col: string, ci: number) => (
                    <View key={ci} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={{ fontSize: 7, color: C.slate600, width: 10 }}>▸</Text>
                      <Text style={[styles.tableCellMono, { fontSize: 7.5, color: C.slate400 }]}>{col}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <Label>REST API ROUTES</Label>
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: 50 }]}>METHOD</Text>
                <Text style={[styles.tableHeaderText, { width: 160 }]}>ENDPOINT PATH</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>DESCRIPTION</Text>
              </View>
              {outputs.architecture.api_endpoints?.map((api: any, i: number) => (
                <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCellMono, {
                    width: 50,
                    color: api.method === 'GET' ? C.green : api.method === 'POST' ? C.blue : api.method === 'DELETE' ? C.red : C.amber,
                  }]}>{api.method}</Text>
                  <Text style={[styles.tableCellMonoBlue, { width: 160, paddingRight: 6 }]}>{api.path}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{api.description}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Architecture · 06" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          07 · SPRINT ROADMAP
      ══════════════════════════════════════════════════════════ */}
      {outputs?.roadmap && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="07 · ROADMAP" chapter="Chapter Seven" title="Sprint Delivery Roadmap" />

            <View style={styles.sprintGrid}>
              {[
                { key: 'sprint_1', label: 'Sprint 1', sub: 'Foundation', color: C.blue, bg: '#3B82F618' },
                { key: 'sprint_2', label: 'Sprint 2', sub: 'Core MVP', color: C.accent, bg: '#7C3AED18' },
                { key: 'sprint_3', label: 'Sprint 3', sub: 'Advanced', color: C.pink, bg: '#EC489918' },
                { key: 'sprint_4', label: 'Sprint 4', sub: 'Launch', color: C.green, bg: '#10B98118' },
              ].map((sprint) => (
                <View key={sprint.key} style={styles.sprintCard}>
                  <View style={[styles.sprintHeader, { backgroundColor: sprint.bg, borderBottomColor: sprint.color + '40' }]}>
                    <Text style={[styles.sprintLabel, { color: sprint.color }]}>{sprint.label}</Text>
                    <Text style={styles.sprintSubLabel}>{sprint.sub}</Text>
                  </View>
                  <View style={styles.sprintBody}>
                    {outputs.roadmap[sprint.key]?.map((id: string) => {
                      const story = outputs.userStories?.find((s: any) => s.id === id)
                      return (
                        <View key={id} style={[styles.sprintItem, { borderColor: sprint.color + '25' }]}>
                          <Text style={[styles.sprintItemId, { color: sprint.color }]}>{id}</Text>
                          {story?.title && (
                            <Text style={styles.sprintItemDesc}>{story.title}</Text>
                          )}
                        </View>
                      )
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Roadmap · 07" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          08 · COST ESTIMATION
      ══════════════════════════════════════════════════════════ */}
      {outputs?.costEstimate && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="08 · FINOPS" chapter="Chapter Eight" title="Infrastructure Cost Model" />

            <Text style={styles.bodyText}>
              Monthly cloud infrastructure projections across three scale tiers. Costs are estimates
              and should be validated with actual vendor pricing at time of procurement.
            </Text>

            <View style={styles.grid3}>
              {[
                { label: '100 Users', sub: 'Early Traction', key: 'scale_100', color: C.blue },
                { label: '1,000 Users', sub: 'Product-Market Fit', key: 'scale_1k', color: C.accent },
                { label: '10,000 Users', sub: 'Growth Stage', key: 'scale_10k', color: C.pink },
              ].map((tier) => (
                <View key={tier.key} style={styles.costCard}>
                  <View style={[styles.costCardHeader, { backgroundColor: tier.color + '18' }]}>
                    <Text style={[styles.costTierLabel, { color: tier.color }]}>{tier.label}</Text>
                    <Text style={styles.costTierSub}>{tier.sub}</Text>
                  </View>
                  <View style={styles.costCardBody}>
                    {[
                      { label: 'Compute', key: 'compute_cost' },
                      { label: 'Database', key: 'database_cost' },
                      { label: 'CDN / Storage', key: 'cdn_cost' },
                    ].map((row) => (
                      <View key={row.key} style={styles.kvRow}>
                        <Text style={styles.kvKey}>{row.label}</Text>
                        <Text style={styles.kvVal}>{outputs.costEstimate[row.key]?.[tier.key] || '—'}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.costTotal, { backgroundColor: tier.color + '12' }]}>
                    <Text style={styles.costTotalLabel}>MONTHLY TOTAL</Text>
                    <Text style={[styles.costTotalValue, { color: tier.color }]}>
                      {outputs.costEstimate.total_monthly?.[tier.key] || '—'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="FinOps · 08" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          09 · SCAFFOLDING
      ══════════════════════════════════════════════════════════ */}
      {outputs?.scaffolding && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="09 · SCAFFOLDING" chapter="Chapter Nine" title="Repository Structure & Setup" />

            <Label>FOLDER STRUCTURE</Label>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>{outputs.scaffolding.file_tree}</Text>
            </View>

            <Label>SETUP & INSTALLATION GUIDE</Label>
            <View style={styles.card}>
              <Text style={styles.cardText}>{outputs.scaffolding.instructions}</Text>
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="Scaffolding · 09" />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          10 · UI BLUEPRINT
      ══════════════════════════════════════════════════════════ */}
      {outputs?.ui && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="10 · UI BLUEPRINT" chapter="Chapter Ten" title="UI/UX Design Specification" />

            <Label>DESIGN SYSTEM & BRAND IDENTITY</Label>
            <View style={styles.cardAccent}>
              <Text style={styles.cardText}>{outputs.ui.style_description}</Text>
            </View>

            <Label>WIREFRAME ARCHITECTURE</Label>
            <View style={styles.grid2}>
              {[
                {
                  title: 'Hero & Value Proposition',
                  desc: 'High-impact headline, a compelling subtext, and a primary CTA designed to maximize conversion from first visit.',
                  color: C.accent,
                },
                {
                  title: 'Feature Showcase',
                  desc: 'Interactive 3-column grid displaying core product capabilities with icons and concise benefit-driven copy.',
                  color: C.blue,
                },
                {
                  title: 'Social Proof',
                  desc: 'Testimonials, logos, and usage statistics to establish trust with first-time visitors.',
                  color: C.teal,
                },
                {
                  title: 'Pricing & CTA Section',
                  desc: 'Tiered pricing cards with feature comparisons, designed to drive free trial sign-ups and paid conversions.',
                  color: C.green,
                },
              ].map((block, i) => (
                <View key={i} style={[styles.card, styles.gridItem, { borderTopWidth: 2, borderTopColor: block.color }]}>
                  <Text style={[styles.cardTitle, { color: block.color }]}>{block.title}</Text>
                  <Text style={styles.cardText}>{block.desc}</Text>
                </View>
              ))}
            </View>

            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                🚀  Live Web App Preview Available — Launch the interactive prototype directly from your Foundry dashboard under the "UI Preview" tab, or export the full self-contained HTML/CSS package for instant deployment.
              </Text>
            </View>
          </View>
          <Footer title={projectTitle} pageLabel="UI Blueprint · 10" />
        </Page>
      )}

    </Document>
  )
}
