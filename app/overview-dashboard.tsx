'use client';

import {useState, useMemo} from 'react';
import {
  Building2,
  CheckCircle2,
  Clock3,
  Star,
  Award,
  TrendingUp,
  Search,
  ChevronRight,
  ArrowRight,
  Plus,
  ClipboardCheck,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Logo, Status, formatDate} from './workspace';
import {criteria, average, type Vendor, type Review} from './data';

type OverviewDashboardProps = {
  vendors: Vendor[];
  reviews: Review[];
  language: 'en' | 'th';
  admin: boolean;
  isDemo: boolean;
  onSelectVendor: (vendor: Vendor) => void;
  onEvaluate: (vendorId?: string) => void;
  onAddVendor: () => void;
  onNavigate: (view: string) => void;
};

const categoryColors: Record<string, {bg: string; bar: string; text: string}> = {
  'Technology': {bg: '#eff6ff', bar: '#3b82f6', text: '#1d4ed8'},
  'Logistics': {bg: '#f0fdf4', bar: '#22c55e', text: '#15803d'},
  'Manufacturing': {bg: '#fef3c7', bar: '#f59e0b', text: '#b45309'},
  'Professional services': {bg: '#faf5ff', bar: '#a855f7', text: '#7e22ce'},
  'Office supplies': {bg: '#f0fdfa', bar: '#14b8a6', text: '#0f766e'},
  'Facilities': {bg: '#fff7ed', bar: '#f97316', text: '#c2410c'},
  'Other': {bg: '#f3f4f6', bar: '#6b7280', text: '#374151'},
};

export default function OverviewDashboard({
  vendors,
  reviews,
  language,
  admin,
  isDemo,
  onSelectVendor,
  onEvaluate,
  onAddVendor,
  onNavigate,
}: OverviewDashboardProps) {
  const thai = language === 'th';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');

  // Computed metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'Active');
  const pendingVendors = vendors.filter(v => v.status === 'Pending');
  const inactiveVendors = vendors.filter(v => v.status === 'Inactive');

  const ratedVendors = vendors.filter(v => v.score !== null);
  const avgScore = ratedVendors.length
    ? ratedVendors.reduce((acc, v) => acc + (v.score || 0), 0) / ratedVendors.length
    : 0;

  const awaitingEvaluation = vendors.filter(v => !v.reviews);
  const activeRate = totalVendors ? Math.round((activeVendors.length / totalVendors) * 100) : 0;

  // Category breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    vendors.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalVendors ? Math.round((count / totalVendors) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [vendors, totalVendors]);

  // 5 Criteria Performance
  const criteriaScores = useMemo(() => {
    return criteria.map(([key, label, desc]) => {
      const avg = reviews.length
        ? reviews.reduce((sum, r) => sum + r[key], 0) / reviews.length
        : 0;
      return {
        key,
        label,
        desc,
        score: avg,
        percentage: Math.min(100, Math.round((avg / 5) * 100)),
      };
    });
  }, [reviews]);

  // Overall Health Score (percentage of total potential 5.0)
  const healthScore = avgScore ? Math.round((avgScore / 5) * 100) : 0;

  // Top ranked vendors (by score descending, only those with scores)
  const topVendors = useMemo(() => {
    return [...vendors]
      .filter(v => v.score !== null)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 4);
  }, [vendors]);

  // Filtered vendors for quick directory
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchQuery = (v.name + ' ' + v.contact + ' ' + v.category)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [vendors, searchQuery, statusFilter]);

  return (
    <div className="dashboard-container">
      {/* 1. Executive Dashboard Hero Banner */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-badge">
            <span className="live-dot" />
            <Sparkles size={13} />
            <span>{thai ? 'ภาพรวมระบบบริหารจัดการคู่ค้า' : 'PARTNER OPERATIONS DASHBOARD'}</span>
          </div>
          <h2 className="dashboard-hero-title">
            {thai ? 'สรุปภาพรวมและผลการดำเนินงานคู่ค้า' : 'Partner Network & Performance Insights'}
          </h2>
          <p className="dashboard-hero-subtitle">
            {thai
              ? 'ติดตามสถานะคู่ค้าธุรกิจ วิเคราะห์ผลการประเมิน 5 ด้าน และบริหารความสัมพันธ์อย่างมีประสิทธิภาพ'
              : 'Monitor partner network health, analyze 5-criteria performance benchmarks, and drive collaborative growth.'}
          </p>
        </div>

        <div className="dashboard-hero-actions">
          {admin && !isDemo && (
            <Button
              className="dash-action-btn secondary"
              variant="outline"
              onClick={() => onEvaluate()}
            >
              <ClipboardCheck size={16} />
              {thai ? 'ประเมินคู่ค้า' : 'New evaluation'}
            </Button>
          )}
          {admin && (
            <Button className="dash-action-btn primary" onClick={onAddVendor}>
              <Plus size={16} />
              {thai ? 'เพิ่มคู่ค้าใหม่' : 'Add vendor'}
            </Button>
          )}
        </div>
      </section>

      {/* 2. Top KPI Metric Cards */}
      <section className="dashboard-kpis">
        {/* KPI 1: Total Vendors */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-header">
            <span className="dash-kpi-title">{thai ? 'คู่ค้าในระบบทั้งหมด' : 'Total Vendors'}</span>
            <div className="dash-kpi-icon-wrap emerald">
              <Building2 size={20} />
            </div>
          </div>
          <div className="dash-kpi-value-row">
            <span className="dash-kpi-value">{totalVendors}</span>
            <span className="dash-kpi-unit">{thai ? 'บริษัท' : 'companies'}</span>
          </div>
          <div className="dash-kpi-footer">
            <span className="dash-chip active">{activeVendors.length} {thai ? 'ใช้งาน' : 'active'}</span>
            <span className="dash-chip pending">{pendingVendors.length} {thai ? 'รอตรวจสอบ' : 'pending'}</span>
            {inactiveVendors.length > 0 && (
              <span className="dash-chip inactive">{inactiveVendors.length} {thai ? 'ระงับ' : 'inactive'}</span>
            )}
          </div>
        </div>

        {/* KPI 2: Active Partner Rate */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-header">
            <span className="dash-kpi-title">{thai ? 'อัตราความพร้อมปฏิบัติงาน' : 'Active Partner Rate'}</span>
            <div className="dash-kpi-icon-wrap blue">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="dash-kpi-value-row">
            <span className="dash-kpi-value">{activeRate}%</span>
            <span className="dash-kpi-subtext">
              {activeVendors.length}/{totalVendors} {thai ? 'พร้อมร่วมงาน' : 'ready'}
            </span>
          </div>
          <div className="dash-kpi-progress-bar">
            <div
              className="dash-kpi-progress-fill blue"
              style={{width: `${activeRate}%`}}
            />
          </div>
        </div>

        {/* KPI 3: Average Rating */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-header">
            <span className="dash-kpi-title">{thai ? 'คะแนนประเมินเฉลี่ย' : 'Average Performance'}</span>
            <div className="dash-kpi-icon-wrap amber">
              <Award size={20} />
            </div>
          </div>
          <div className="dash-kpi-value-row">
            <span className="dash-kpi-value">{ratedVendors.length ? avgScore.toFixed(1) : '—'}</span>
            <span className="dash-kpi-unit">/ 5.0</span>
            <span className="dash-rating-badge">
              <Star size={13} fill="#eab308" color="#eab308" />
              {avgScore >= 4.5
                ? (thai ? 'เกรด A · ดีเยี่ยม' : 'Tier A · Excellent')
                : avgScore >= 4.0
                ? (thai ? 'เกรด B · ดี' : 'Tier B · Good')
                : (thai ? 'พอใช้' : 'Fair')}
            </span>
          </div>
          <div className="dash-kpi-subnote">
            <span>{thai ? `จากการประเมิน ${reviews.length} ครั้ง` : `Based on ${reviews.length} reviews`}</span>
          </div>
        </div>

        {/* KPI 4: Pending Evaluation */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-header">
            <span className="dash-kpi-title">{thai ? 'รอการประเมินผล' : 'Awaiting Review'}</span>
            <div className="dash-kpi-icon-wrap orange">
              <Clock3 size={20} />
            </div>
          </div>
          <div className="dash-kpi-value-row">
            <span className="dash-kpi-value">{awaitingEvaluation.length}</span>
            <span className="dash-kpi-unit">{thai ? 'บริษัท' : 'partners'}</span>
          </div>
          <div className="dash-kpi-footer">
            {awaitingEvaluation.length > 0 ? (
              <button
                type="button"
                className="dash-action-link"
                onClick={() => onEvaluate()}
              >
                {thai ? 'เริ่มการประเมินทันที' : 'Start evaluation'} <ArrowRight size={13} />
              </button>
            ) : (
              <span className="dash-chip-success">
                <CheckCircle2 size={13} /> {thai ? 'ประเมินครบทุกราย' : 'All evaluated'}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Analytics Charts Grid */}
      <section className="dashboard-charts-grid">
        {/* Chart 1: Category Distribution */}
        <div className="dash-chart-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">
                <Layers size={18} />
                {thai ? 'สัดส่วนคู่ค้าตามหมวดหมู่ธุรกิจ' : 'Category Distribution'}
              </h3>
              <p className="dash-card-subtitle">
                {thai
                  ? `ครอบคลุม ${categoryStats.length} หมวดหมู่อุตสาหกรรม`
                  : `Distributed across ${categoryStats.length} industry categories`}
              </p>
            </div>
            <button
              type="button"
              className="dash-view-all-link"
              onClick={() => onNavigate('Vendors')}
            >
              {thai ? 'ดูรายชื่อ' : 'View list'} <ChevronRight size={14} />
            </button>
          </div>

          <div className="dash-category-list">
            {categoryStats.map(cat => {
              const theme = categoryColors[cat.name] || categoryColors['Other'];
              return (
                <div key={cat.name} className="dash-category-item">
                  <div className="dash-category-label-row">
                    <span className="dash-category-name">
                      <span className="category-dot" style={{backgroundColor: theme.bar}} />
                      {thai ? cat.name : cat.name}
                    </span>
                    <span className="dash-category-count">
                      <strong>{cat.count}</strong> {thai ? 'ราย' : 'vendors'}{' '}
                      <small>({cat.percentage}%)</small>
                    </span>
                  </div>
                  <div className="dash-category-bar-track">
                    <div
                      className="dash-category-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: theme.bar,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: 5-Criteria Performance Scorecard */}
        <div className="dash-chart-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">
                <Award size={18} />
                {thai ? 'ดัชนีคะแนนประเมิน 5 มิติ' : '5-Dimension Performance Benchmark'}
              </h3>
              <p className="dash-card-subtitle">
                {thai
                  ? 'เกณฑ์มาตรฐานประเมินคุณภาพคู่ค้าอย่างเป็นธรรมและโปร่งใส'
                  : 'Balanced performance scorecard across essential evaluation criteria'}
              </p>
            </div>
            <div className="dash-score-badge">
              <span className="score-num">{healthScore}%</span>
              <span className="score-label">{thai ? 'ดัชนีรวม' : 'Health Score'}</span>
            </div>
          </div>

          <div className="dash-criteria-list">
            {criteriaScores.map(c => {
              const isHigh = c.score >= 4.5;
              const isMedium = c.score >= 3.8;
              return (
                <div key={c.key} className="dash-criteria-item">
                  <div className="dash-criteria-label-row">
                    <div>
                      <span className="dash-criteria-name">{thai ? c.label : c.label}</span>
                      <span className="dash-criteria-desc">{thai ? c.desc : c.desc}</span>
                    </div>
                    <div className="dash-criteria-score-wrap">
                      <strong className="dash-criteria-score">
                        {reviews.length ? c.score.toFixed(1) : '—'}
                      </strong>
                      <span className="dash-criteria-max">/ 5.0</span>
                      <span className={`dash-criteria-pill ${isHigh ? 'high' : isMedium ? 'med' : 'low'}`}>
                        {isHigh ? (thai ? 'ดีเยี่ยม' : 'High') : isMedium ? (thai ? 'มาตรฐาน' : 'Standard') : (thai ? 'ปรับปรุง' : 'Review')}
                      </span>
                    </div>
                  </div>
                  <div className="dash-criteria-bar-track">
                    <div
                      className={`dash-criteria-bar-fill ${isHigh ? 'high' : isMedium ? 'med' : 'low'}`}
                      style={{width: `${c.percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Leaderboard & Recent Evaluation Stream */}
      <section className="dashboard-grid-dual">
        {/* Left: Top Performing Partners */}
        <div className="dash-panel-card">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">
                <TrendingUp size={18} />
                {thai ? 'ทำเนียบคู่ค้ายอดเยี่ยม (Top Partners)' : 'Top Performing Partners'}
              </h3>
              <p className="dash-panel-subtitle">
                {thai ? 'คู่ค้าที่มีคะแนนประเมินสูงสุดในเครือข่าย' : 'Highest rated partners in your workspace'}
              </p>
            </div>
            <button
              type="button"
              className="dash-link-button"
              onClick={() => onNavigate('Vendors')}
            >
              {thai ? 'ดูคู่ค้าทั้งหมด' : 'All vendors'} <ChevronRight size={15} />
            </button>
          </div>

          <div className="dash-top-vendors-list">
            {topVendors.length === 0 ? (
              <div className="dash-empty-state">
                <Clock3 size={28} />
                <p>{thai ? 'ยังไม่มีข้อมูลคะแนนประเมิน' : 'No evaluated partners yet.'}</p>
              </div>
            ) : (
              topVendors.map((vendor, idx) => (
                <button
                  type="button"
                  key={vendor.id}
                  className="dash-top-vendor-item"
                  onClick={() => onSelectVendor(vendor)}
                >
                  <div className="vendor-rank-badge rank-{idx + 1}">
                    #{idx + 1}
                  </div>
                  <Logo vendor={vendor} />
                  <div className="vendor-info-col">
                    <strong className="vendor-name-text">{vendor.name}</strong>
                    <div className="vendor-meta-row">
                      <span className="vendor-cat-tag">{vendor.category}</span>
                      <span className="vendor-contact-text">{vendor.contact}</span>
                    </div>
                  </div>
                  <div className="vendor-score-col">
                    <div className="vendor-score-pill">
                      <Star size={13} fill="#eab308" color="#eab308" />
                      <span>{vendor.score?.toFixed(1)}</span>
                    </div>
                    <small className="vendor-reviews-count">
                      {vendor.reviews} {thai ? 'รีวิว' : 'reviews'}
                    </small>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Evaluation Activity */}
        <div className="dash-panel-card">
          <div className="dash-panel-header">
            <div>
              <h3 className="dash-panel-title">
                <ClipboardCheck size={18} />
                {thai ? 'บันทึกการประเมินล่าสุด' : 'Recent Evaluations'}
              </h3>
              <p className="dash-panel-subtitle">
                {thai ? 'ความคิดเห็นและผลการประเมินล่าสุด' : 'Latest evaluation scores and feedback'}
              </p>
            </div>
            <button
              type="button"
              className="dash-link-button"
              onClick={() => onNavigate('Reviews')}
            >
              {thai ? 'ดูการประเมินทั้งหมด' : 'All reviews'} <ChevronRight size={15} />
            </button>
          </div>

          <div className="dash-recent-reviews-list">
            {reviews.length === 0 ? (
              <div className="dash-empty-state">
                <ClipboardCheck size={28} />
                <p>{thai ? 'ยังไม่มีบันทึกการประเมิน' : 'No evaluations recorded yet.'}</p>
                {admin && (
                  <Button size="sm" onClick={() => onEvaluate()}>
                    {thai ? 'ประเมินรายแรก' : 'New evaluation'}
                  </Button>
                )}
              </div>
            ) : (
              reviews.slice(0, 3).map(rev => {
                const targetVendor = vendors.find(v => v.id === rev.vendorId);
                const score = average(rev);
                return (
                  <div
                    key={rev.id}
                    className="dash-review-card"
                    onClick={() => targetVendor && onSelectVendor(targetVendor)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="dash-review-card-top">
                      {targetVendor ? <Logo vendor={targetVendor} /> : <div className="vendor-logo">CM</div>}
                      <div className="dash-review-header-text">
                        <strong>{targetVendor ? targetVendor.name : 'Vendor'}</strong>
                        <small>
                          {rev.reviewer} · {formatDate(rev.createdAt, language)}
                        </small>
                      </div>
                      <div className="dash-review-score">
                        <Star size={13} fill="#eab308" color="#eab308" />
                        <strong>{score.toFixed(1)}</strong>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="dash-review-comment">"{rev.comment}"</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 5. Quick Directory Table Section */}
      <section className="dashboard-directory-section">
        <div className="dash-directory-header">
          <div>
            <h3 className="dash-directory-title">
              {thai ? 'รายชื่อคู่ค้าและการดำเนินงานด่วน' : 'Partner Network Directory'}
            </h3>
            <p className="dash-directory-subtitle">
              {thai
                ? 'ค้นหาและเปิดดูข้อมูลโปรไฟล์คู่ค้าได้ทันที'
                : 'Quick search and profile inspection for partner network'}
            </p>
          </div>
          <div className="dash-directory-filters">
            <div className="dash-search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder={thai ? 'ค้นหาชื่อ, ผู้ติดต่อ, หมวดหมู่...' : 'Search partners...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="dash-status-filter-pills">
              {(['All', 'Active', 'Pending', 'Inactive'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  className={`dash-filter-pill ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === 'All'
                    ? (thai ? 'ทั้งหมด' : 'All')
                    : st === 'Active'
                    ? (thai ? 'ใช้งาน' : 'Active')
                    : st === 'Pending'
                    ? (thai ? 'รอตรวจสอบ' : 'Pending')
                    : (thai ? 'ระงับ' : 'Inactive')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{thai ? 'บริษัทคู่ค้า' : 'Partner Name'}</TableHead>
                <TableHead>{thai ? 'หมวดหมู่' : 'Category'}</TableHead>
                <TableHead>{thai ? 'สถานะ' : 'Status'}</TableHead>
                <TableHead>{thai ? 'คะแนนประเมิน' : 'Rating'}</TableHead>
                <TableHead className="text-right">{thai ? 'จัดการ' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {thai ? 'ไม่พบข้อมูลคู่ค้าที่ตรงกับการค้นหา' : 'No matching partners found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map(vendor => (
                  <TableRow
                    key={vendor.id}
                    className="dash-table-row"
                    onClick={() => onSelectVendor(vendor)}
                  >
                    <TableCell>
                      <div className="dash-vendor-cell">
                        <Logo vendor={vendor} />
                        <div>
                          <strong>{vendor.name}</strong>
                          <small>{vendor.contact}</small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="dash-category-cell-pill">
                        {vendor.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Status status={vendor.status} language={language} />
                    </TableCell>
                    <TableCell>
                      {vendor.score !== null ? (
                        <div className="dash-score-pill-table">
                          <Star size={13} fill="#eab308" color="#eab308" />
                          <strong>{vendor.score.toFixed(1)}</strong>
                          <small>({vendor.reviews})</small>
                        </div>
                      ) : (
                        <span className="dash-unrated-tag">
                          {thai ? 'ยังไม่ประเมิน' : 'Not evaluated'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="dash-row-btn"
                        onClick={e => {
                          e.stopPropagation();
                          onSelectVendor(vendor);
                        }}
                      >
                        {thai ? 'ดูข้อมูล' : 'View'}
                        <ChevronRight size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="dash-table-footer">
          <span>
            {thai ? `แสดง ${filteredVendors.length} จากทั้งหมด ${vendors.length} บริษัท` : `Showing ${filteredVendors.length} of ${vendors.length} partners`}
          </span>
          <button
            type="button"
            className="dash-footer-link"
            onClick={() => onNavigate('Vendors')}
          >
            {thai ? 'เปิดหน้ารายการคู่ค้าแบบเต็ม' : 'Open full directory'} <ExternalLink size={13} />
          </button>
        </div>
      </section>
    </div>
  );
}
