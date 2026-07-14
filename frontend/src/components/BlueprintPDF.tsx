import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0f0f1a',
    color: '#e2e8f0',
    fontFamily: 'Helvetica',
    padding: 0,
  },

  // Cover Page
  coverPage: {
    backgroundColor: '#0f0f1a',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverBadge: {
    backgroundColor: '#7c3aed',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 20,
  },
  coverBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#7c3aed',
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 1.6,
  },

  // Content pages
  contentPage: {
    backgroundColor: '#0f0f1a',
    flex: 1,
    padding: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
  },
  sectionBadge: {
    backgroundColor: '#7c3aed22',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  sectionBadgeText: {
    color: '#a78bfa',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Cards
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e1e3a',
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#c4b5fd',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.6,
  },

  // Table
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e1e3a',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#e2e8f0',
    letterSpacing: 0.8,
  },
  tableCell: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  tableCellMono: {
    fontSize: 9,
    color: '#a78bfa',
    fontFamily: 'Courier',
  },

  // Grid
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },

  // Priority buckets
  bucketMust: {
    backgroundColor: '#7f1d1d22',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  bucketShould: {
    backgroundColor: '#71350722',
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  bucketCould: {
    backgroundColor: '#06451522',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  bucketLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#e2e8f0',
    marginBottom: 5,
    letterSpacing: 0.8,
  },

  // Sprint
  sprintGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  sprintCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    padding: 10,
    borderTopWidth: 2,
  },
  sprintLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  sprintSubLabel: {
    fontSize: 7,
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sprintItem: {
    backgroundColor: '#0f0f1a',
    borderRadius: 3,
    padding: 5,
    marginBottom: 4,
  },
  sprintItemId: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a78bfa',
  },

  // Cost
  costGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  costCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    padding: 12,
  },
  costTier: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
  },
  costLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  costValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Code block
  codeBlock: {
    backgroundColor: '#000000',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: '#94a3b8',
    lineHeight: 1.7,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#334155',
  },
  footerBrand: {
    fontSize: 7,
    color: '#7c3aed',
    fontFamily: 'Helvetica-Bold',
  },

  // Body text
  bodyText: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.7,
    marginBottom: 12,
  },
  label: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#c4b5fd',
    marginBottom: 3,
  },
  chip: {
    backgroundColor: '#7c3aed22',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    fontSize: 8,
    color: '#a78bfa',
    fontFamily: 'Courier',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
})

// ── Helper Components ─────────────────────────────────────────────────────────

const Footer = ({ title }: { title: string }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>{title}</Text>
    <Text style={styles.footerBrand}>Foundry AI</Text>
  </View>
)

const SectionHeader = ({ badge, title }: { badge: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionBadge}>
      <Text style={styles.sectionBadgeText}>{badge}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
)

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

  return (
    <Document title={`${projectTitle} — Foundry Blueprint`} author="Foundry AI">
      {/* ── Cover Page ─────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>FOUNDRY AI BLUEPRINT</Text>
          </View>
          <Text style={styles.coverTitle}>{projectTitle}</Text>
          <Text style={styles.coverSubtitle}>
            {industry ? `${industry} · ` : ''}Startup Product Specifications
          </Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverMeta}>
            Generated on {today}{'\n'}
            {idea}
          </Text>
        </View>
        <Footer title={projectTitle} />
      </Page>

      {/* ── Page 2: Competitor Research ──────────────────── */}
      {outputs?.research && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="01 · RESEARCH" title="Competitor & Market Landscape" />
            <Text style={styles.bodyText}>{outputs.research.market_overview}</Text>

            <Text style={styles.label}>IDENTIFIED COMPETITORS</Text>
            {outputs.research.competitors?.map((comp: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{comp.name}</Text>
                <Text style={[styles.cardText, { color: '#7c3aed', marginBottom: 4 }]}>{comp.url}</Text>
                <Text style={styles.cardText}>{comp.summary}</Text>
              </View>
            ))}

            <Text style={[styles.label, { marginTop: 8 }]}>OPPORTUNITIES & GAPS</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{outputs.research.opportunities}</Text>
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 3: PRD ──────────────────────────────────── */}
      {outputs?.prd && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="02 · PRD" title={outputs.prd.title || 'Product Requirements Document'} />
            <Text style={styles.bodyText}>{outputs.prd.summary}</Text>

            <Text style={styles.label}>CORE FEATURES</Text>
            {outputs.prd.features?.map((feat: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{feat.name}</Text>
                <Text style={styles.cardText}>{feat.description}</Text>
              </View>
            ))}
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 4: User Personas ────────────────────────── */}
      {outputs?.personas && outputs.personas.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="03 · UX RESEARCH" title="User Personas" />
            <View style={styles.grid2}>
              {outputs.personas.map((pers: any, i: number) => (
                <View key={i} style={[styles.card, styles.gridItem]}>
                  <Text style={styles.cardTitle}>{pers.name}</Text>
                  <Text style={[styles.cardText, { color: '#a78bfa', marginBottom: 6 }]}>{pers.role}</Text>
                  <Text style={styles.label}>Goal</Text>
                  <Text style={[styles.cardText, { marginBottom: 6 }]}>{pers.goal}</Text>
                  <Text style={styles.label}>Frustration</Text>
                  <Text style={styles.cardText}>{pers.frustration}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 5: User Stories ─────────────────────────── */}
      {outputs?.userStories && outputs.userStories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="04 · AGILE SCOPE" title="User Stories" />
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: 55 }]}>ID</Text>
                <Text style={[styles.tableHeaderText, { width: 160 }]}>TITLE</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>DESCRIPTION</Text>
              </View>
              {outputs.userStories.map((story: any) => (
                <View key={story.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellMono, { width: 55 }]}>{story.id}</Text>
                  <Text style={[styles.tableCell, { width: 160, fontFamily: 'Helvetica-Bold', color: '#e2e8f0' }]}>{story.title}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{story.description}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 6: Prioritization ───────────────────────── */}
      {outputs?.prioritization && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="05 · MOSCOW" title="Priority Categorization" />

            <Text style={styles.label}>MUST HAVE</Text>
            <View style={styles.bucketMust}>
              <View style={styles.chipRow}>
                {outputs.prioritization.mustHave?.map((id: string) => (
                  <View key={id} style={styles.chip}><Text style={styles.chipText}>{id}</Text></View>
                ))}
              </View>
            </View>

            <Text style={styles.label}>SHOULD HAVE</Text>
            <View style={styles.bucketShould}>
              <View style={styles.chipRow}>
                {outputs.prioritization.shouldHave?.map((id: string) => (
                  <View key={id} style={styles.chip}><Text style={styles.chipText}>{id}</Text></View>
                ))}
              </View>
            </View>

            <Text style={styles.label}>COULD HAVE</Text>
            <View style={styles.bucketCould}>
              <View style={styles.chipRow}>
                {outputs.prioritization.couldHave?.map((id: string) => (
                  <View key={id} style={styles.chip}><Text style={styles.chipText}>{id}</Text></View>
                ))}
              </View>
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 7: Architecture ─────────────────────────── */}
      {outputs?.architecture && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="06 · ARCHITECTURE" title="Technical Blueprint" />

            <Text style={styles.label}>DATABASE SCHEMA</Text>
            <View style={styles.grid2}>
              {outputs.architecture.tables?.map((table: any, i: number) => (
                <View key={i} style={[styles.card, styles.gridItem]}>
                  <Text style={styles.cardTitle}>📋 {table.name}</Text>
                  {table.columns?.map((col: string, ci: number) => (
                    <Text key={ci} style={[styles.cardText, { fontFamily: 'Courier', fontSize: 8 }]}>▪ {col}</Text>
                  ))}
                </View>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>REST API ROUTES</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: 50 }]}>METHOD</Text>
                <Text style={[styles.tableHeaderText, { width: 160 }]}>PATH</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>DESCRIPTION</Text>
              </View>
              {outputs.architecture.api_endpoints?.map((api: any, i: number) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCellMono, { width: 50 }]}>{api.method}</Text>
                  <Text style={[styles.tableCellMono, { width: 160 }]}>{api.path}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{api.description}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 8: Roadmap ──────────────────────────────── */}
      {outputs?.roadmap && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="07 · ROADMAP" title="Sprint Milestones" />
            <View style={styles.sprintGrid}>
              {[
                { key: 'sprint_1', label: 'Sprint 1', sub: 'Foundation', color: '#3b82f6' },
                { key: 'sprint_2', label: 'Sprint 2', sub: 'Core MVP', color: '#7c3aed' },
                { key: 'sprint_3', label: 'Sprint 3', sub: 'Advanced', color: '#ec4899' },
                { key: 'sprint_4', label: 'Sprint 4', sub: 'Launch', color: '#10b981' },
              ].map((sprint) => (
                <View key={sprint.key} style={[styles.sprintCard, { borderTopColor: sprint.color }]}>
                  <Text style={styles.sprintLabel}>{sprint.label}</Text>
                  <Text style={styles.sprintSubLabel}>{sprint.sub}</Text>
                  {outputs.roadmap[sprint.key]?.map((id: string) => (
                    <View key={id} style={styles.sprintItem}>
                      <Text style={styles.sprintItemId}>{id}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 9: Cost Estimation ──────────────────────── */}
      {outputs?.costEstimate && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="08 · FINOPS" title="Infrastructure Cost Projections" />
            <View style={styles.costGrid}>
              {[
                { label: '100 Users', key: 'scale_100', color: '#3b82f6' },
                { label: '1,000 Users', key: 'scale_1k', color: '#7c3aed' },
                { label: '10,000 Users', key: 'scale_10k', color: '#ec4899' },
              ].map((tier) => (
                <View key={tier.key} style={styles.costCard}>
                  <Text style={[styles.costTier, { color: tier.color }]}>{tier.label}</Text>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Compute</Text>
                    <Text style={styles.costValue}>{outputs.costEstimate.compute_cost?.[tier.key]}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Database</Text>
                    <Text style={styles.costValue}>{outputs.costEstimate.database_cost?.[tier.key]}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>CDN</Text>
                    <Text style={styles.costValue}>{outputs.costEstimate.cdn_cost?.[tier.key]}</Text>
                  </View>
                  <View style={[styles.costRow, { borderBottomWidth: 0, marginTop: 4 }]}>
                    <Text style={[styles.costLabel, { color: '#c4b5fd' }]}>Total</Text>
                    <Text style={[styles.costValue, { color: '#c4b5fd' }]}>{outputs.costEstimate.total_monthly?.[tier.key]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}

      {/* ── Page 10: Scaffolding ─────────────────────────── */}
      {outputs?.scaffolding && (
        <Page size="A4" style={styles.page}>
          <View style={styles.contentPage}>
            <SectionHeader badge="09 · SCAFFOLDING" title="Project Repository Layout" />

            <Text style={styles.label}>FOLDER STRUCTURE</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>{outputs.scaffolding.file_tree}</Text>
            </View>

            <Text style={styles.label}>SETUP INSTRUCTIONS</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{outputs.scaffolding.instructions}</Text>
            </View>
          </View>
          <Footer title={projectTitle} />
        </Page>
      )}
    </Document>
  )
}
