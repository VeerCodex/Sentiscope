import { jsPDF } from 'jspdf';

interface SummaryData {
  total_feedback?: number;
  positive_count?: number;
  neutral_count?: number;
  negative_count?: number;
  positive_pct?: number;
  neutral_pct?: number;
  negative_pct?: number;
  net_sentiment_score?: number;
  average_rating?: number | null;
  top_complaint_topic?: string | null;
  topic_breakdowns?: Array<{
    topic_name: string;
    count: number;
    percentage: number;
    sample_reviews?: string[];
  }>;
  sentiment_trends?: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  }>;
}

export function exportExecutiveSummaryPdf(summary: SummaryData, businessName: string = 'All Businesses') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Google 4-color Accent Bar at the top
  const colW = pageWidth / 4;
  doc.setFillColor(66, 133, 244); // Blue
  doc.rect(0, 0, colW, 3, 'F');
  doc.setFillColor(234, 67, 53); // Red
  doc.rect(colW, 0, colW, 3, 'F');
  doc.setFillColor(251, 188, 5); // Yellow
  doc.rect(colW * 2, 0, colW, 3, 'F');
  doc.setFillColor(52, 168, 83); // Green
  doc.rect(colW * 3, 0, colW, 3, 'F');

  let currentY = 16;

  // 2. Header: Logo & Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(32, 33, 36); // #202124
  doc.text('SentiScope', margin, currentY);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(95, 99, 104); // #5F6368
  doc.text('Customer Sentiment & Complaint Intelligence', margin + 38, currentY - 0.5);

  doc.setFontSize(9);
  doc.setTextColor(128, 134, 139);
  doc.text(`Generated: ${dateStr} at ${timeStr}`, pageWidth - margin, currentY, { align: 'right' });

  currentY += 8;

  // Business Context Banner
  doc.setFillColor(248, 249, 250); // #F8F9FA
  doc.setDrawColor(224, 226, 230); // #E0E2E6
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(32, 33, 36);
  doc.text(`Executive Summary Report: ${businessName}`, margin + 5, currentY + 9);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(66, 133, 244);
  doc.text(`Scope: All Ingested Channels (CSV, Google, Surveys)`, pageWidth - margin - 5, currentY + 9, { align: 'right' });

  currentY += 20;

  // 3. Section Title: Key Metrics
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 33, 36);
  doc.text('1. Key Performance Indicators (KPIs)', margin, currentY);
  currentY += 6;

  // 5 Metric Boxes
  const cardWidth = (contentWidth - 8) / 5;
  const cardHeight = 22;

  const kpis = [
    {
      title: 'TOTAL REVIEWS',
      value: (summary.total_feedback || 0).toLocaleString(),
      subtext: 'Ingested',
      color: [66, 133, 244] // Blue
    },
    {
      title: 'POSITIVE',
      value: `${summary.positive_pct || 0}%`,
      subtext: `${summary.positive_count || 0} reviews`,
      color: [52, 168, 83] // Green
    },
    {
      title: 'NEUTRAL',
      value: `${summary.neutral_pct || 0}%`,
      subtext: `${summary.neutral_count || 0} reviews`,
      color: [251, 188, 5] // Yellow
    },
    {
      title: 'NEGATIVE',
      value: `${summary.negative_pct || 0}%`,
      subtext: `${summary.negative_count || 0} reviews`,
      color: [234, 67, 53] // Red
    },
    {
      title: 'NET SCORE (NSS)',
      value: (summary.net_sentiment_score || 0) >= 0 ? `+${summary.net_sentiment_score || 0}` : `${summary.net_sentiment_score || 0}`,
      subtext: (summary.net_sentiment_score || 0) >= 0 ? 'Net Positive' : 'Net Negative',
      color: (summary.net_sentiment_score || 0) >= 0 ? [52, 168, 83] : [234, 67, 53]
    }
  ];

  kpis.forEach((k, idx) => {
    const cardX = margin + idx * (cardWidth + 2);
    
    // Background card
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(224, 226, 230);
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

    // Colored top pill accent
    doc.setFillColor(k.color[0], k.color[1], k.color[2]);
    doc.rect(cardX, currentY, cardWidth, 1.5, 'F');

    // Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(95, 99, 104);
    doc.text(k.title, cardX + 3, currentY + 6);

    // Value
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(k.color[0], k.color[1], k.color[2]);
    doc.text(k.value, cardX + 3, currentY + 14);

    // Subtext
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(128, 134, 139);
    doc.text(k.subtext, cardX + 3, currentY + 19);
  });

  currentY += cardHeight + 10;

  // 4. Section Title: Sentiment Breakdown & Trend Trajectory
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 33, 36);
  doc.text('2. Sentiment Trajectory & Category Share', margin, currentY);
  currentY += 6;

  // Overview box with detailed numbers
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(224, 226, 230);
  doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  const total = summary.total_feedback || 1;
  const posW = ((summary.positive_count || 0) / total) * (contentWidth - 16);
  const neuW = ((summary.neutral_count || 0) / total) * (contentWidth - 16);
  const negW = ((summary.negative_count || 0) / total) * (contentWidth - 16);

  // Stacked progress bar
  let barX = margin + 8;
  const barY = currentY + 8;
  const barH = 5;

  if (posW > 0) {
    doc.setFillColor(52, 168, 83);
    doc.rect(barX, barY, posW, barH, 'F');
    barX += posW;
  }
  if (neuW > 0) {
    doc.setFillColor(251, 188, 5);
    doc.rect(barX, barY, neuW, barH, 'F');
    barX += neuW;
  }
  if (negW > 0) {
    doc.setFillColor(234, 67, 53);
    doc.rect(barX, barY, negW, barH, 'F');
  }

  // Legend and explanations
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(52, 168, 83);
  doc.text(`Positive Sentiment: ${summary.positive_pct || 0}% (${summary.positive_count || 0} reviews)`, margin + 8, currentY + 20);

  doc.setTextColor(217, 158, 0);
  doc.text(`Neutral Sentiment: ${summary.neutral_pct || 0}% (${summary.neutral_count || 0} reviews)`, margin + 8, currentY + 26);

  doc.setTextColor(234, 67, 53);
  doc.text(`Negative Sentiment: ${summary.negative_pct || 0}% (${summary.negative_count || 0} reviews)`, margin + 8, currentY + 31);

  // Right column: Trend summary
  const trendsCount = summary.sentiment_trends?.length || 0;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(95, 99, 104);
  doc.text(`Timeline points tracked: ${trendsCount} days`, pageWidth - margin - 8, currentY + 20, { align: 'right' });
  doc.text(`Average Star Rating: ${summary.average_rating ? `${summary.average_rating} / 5.0` : 'N/A'}`, pageWidth - margin - 8, currentY + 26, { align: 'right' });
  doc.text(`Top Complaint Area: ${summary.top_complaint_topic ? summary.top_complaint_topic.toUpperCase() : 'None'}`, pageWidth - margin - 8, currentY + 31, { align: 'right' });

  currentY += 42;

  // 5. Section Title: Top 3 Complaint Themes & Customer Quotes
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 33, 36);
  doc.text('3. Top Complaint Root Causes & Verbatim Quotes', margin, currentY);
  currentY += 6;

  const topics = (summary.topic_breakdowns || []).slice(0, 3);

  if (topics.length === 0) {
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(128, 134, 139);
    doc.text('No significant complaint themes detected in current dataset.', margin + 8, currentY + 11);
    currentY += 26;
  } else {
    topics.forEach((t, i) => {
      const topicCardY = currentY;
      const topicCardH = 26;

      doc.setFillColor(248, 249, 250);
      doc.setDrawColor(224, 226, 230);
      doc.roundedRect(margin, topicCardY, contentWidth, topicCardH, 2, 2, 'FD');

      // Left Red Pill tag
      doc.setFillColor(234, 67, 53);
      doc.rect(margin, topicCardY, 2.5, topicCardH, 'F');

      // Topic Name & Frequency
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(32, 33, 36);
      doc.text(`#${i + 1} ${t.topic_name.toUpperCase()}`, margin + 6, topicCardY + 6.5);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(234, 67, 53);
      doc.text(`${t.count} mentions (${t.percentage}% of complaints)`, pageWidth - margin - 6, topicCardY + 6.5, { align: 'right' });

      // Verbatim Quote
      const quote = t.sample_reviews && t.sample_reviews.length > 0
        ? `"${t.sample_reviews[0]}"`
        : '"Customer reported recurring issues regarding this operational domain."';

      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(95, 99, 104);

      // Split quote into max 2 lines
      const splitQuote = doc.splitTextToSize(quote, contentWidth - 14);
      doc.text(splitQuote.slice(0, 2), margin + 6, topicCardY + 13.5);

      currentY += topicCardH + 4;
    });
  }

  currentY += 4;

  // 6. Section 4: Recommended Action Items
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 33, 36);
  doc.text('4. Recommended Operational Action Items', margin, currentY);
  currentY += 6;

  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(224, 226, 230);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  const recommendations = [
    `• Target operational bottlenecks in [${summary.top_complaint_topic || 'customer fulfillment'}] to raise Net Sentiment Score.`,
    '• Automate instant outreach to negative feedback authors within 24 hours to prevent churn.',
    '• Ingest next batch of survey and Google Places reviews to measure 30-day resolution progress.'
  ];

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(32, 33, 36);
  recommendations.forEach((rec, rIdx) => {
    doc.text(rec, margin + 6, currentY + 6 + rIdx * 6);
  });

  // Footer on bottom of page
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(128, 134, 139);
  doc.text('SentiScope AI Business Intelligence Platform • Confidential Executive Document', margin, 290);
  doc.text(`Page 1 of 1`, pageWidth - margin, 290, { align: 'right' });

  // Save PDF file
  const sanitized = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filename = `sentiscope-summary-${sanitized || 'all-businesses'}-${dateStr}.pdf`;
  doc.save(filename);
}
