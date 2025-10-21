import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Platform, ActivityIndicator } from 'react-native';
import { printToFileAsync } from 'expo-print';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { loadHtmlTemplate } from '../utils/loadHtmlTemplate';

const QuotationPdfViewer = ({ visible, onClose, quotationData }) => {
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      const html = await loadHtmlTemplate('quotation');
      if (html) setTemplate(html);
    };
    loadTemplate();
  }, []);

  const fmtINR = (v) => Number(v ?? 0).toLocaleString('en-IN');
  const money = (v, c) => `${c || 'INR'} ${fmtINR(v)}`;
  const clean = (s) => (s || '').replace(/<[^>]*>?/gm, '').trim();
  const dstr = (s) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');

  const buildHtml = (mode) => {
    if (!template) return '';
    
    const q = quotationData || {};
    const {
      TripId,
      DestinationName,
      Days, Nights,
      Currency = 'INR',
      Costs = {},
      GST = {}, TCS = {},
      Hotels = [],
      Itinearies = [],
      Inclusions = [],
      Exclusions = [],
    } = q;

    const clientName = q['Client-Name'] || 'N/A';
    const clientContact = q['Client-Contact'] || 'N/A';
    const clientEmail = q['Client-Email'] || 'N/A';
    const travelStart = dstr(q.TravelDate);
    const travelEnd = dstr(q.TravelEndDate || q.TravelDate);
    const pax = q.NoOfPax ?? 0;
    const child = q.Child ?? 0;
    const infant = q.Infant ?? 0;

    const HERO_SVG = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#f5f3f7"/>
          </linearGradient>
          <linearGradient id="mount" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7f7f8c" stop-opacity=".35"/>
            <stop offset="1" stop-color="#3d3d45" stop-opacity=".55"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="210" height="297" fill="url(#g1)"/>
        <g opacity=".95">
          <path d="M0,225 Q30,205 55,220 T110,218 T160,230 T210,220 V297 H0 Z" fill="url(#mount)"/>
          <path d="M0,235 Q40,220 80,232 T140,236 T210,230 V297 H0 Z" fill="#a6a6b3" opacity=".45"/>
          <path d="M0,245 Q50,235 95,245 T155,248 T210,243 V297 H0 Z" fill="#bdbdc7" opacity=".35"/>
        </g>
      </svg>
    `);

    const isPdf = mode === 'pdf';

    const styles = `
      @page { size: A4; margin: ${isPdf ? '0' : '14mm'}; }
      html, body { margin: 0; padding: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1f2937; }

      .cover {
        width: 210mm; height: 297mm; margin: 0; padding: 0; position: relative;
        background: url("data:image/svg+xml,${HERO_SVG}") no-repeat center/cover;
      }
      .cover-inner {
        position: absolute; inset: 0; display: grid; place-items: center;
        padding: 0 20mm 34mm 20mm; text-align: center;
      }
      .brand-logo {
        display:inline-block; padding: 6mm 10mm; background:#000; color:#fff; letter-spacing:1.5px;
        font-weight: 800; font-size: 18pt; border-radius: 2mm;
      }
      .tag1 { margin-top: 10mm; font-style: italic; font-size: 16pt; }
      .tag2 { margin-top: 2mm; font-style: italic; font-size: 14pt; color: #4A148C; }

      .page { width: 210mm; min-height: 297mm; padding: ${isPdf ? '12mm 14mm 16mm' : '20px'};
              ${isPdf ? '' : 'max-width: 800px; margin: 0 auto;'} }
      .title { text-align:center; color:#4A148C; font-size: 16pt; font-weight:800; letter-spacing:.5px; margin: 0 0 6mm; }
      .stripe { height:2px; background:#4A148C; opacity:.7; width:100%; margin: 0 0 8mm; }

      .card {
        border: 1px solid #e5e7eb; border-radius: 8px; background:#fff; overflow:hidden; margin-bottom: 8mm;
        box-shadow: 0 0 0 1px rgba(0,0,0,.02);
      }
      .card-hd { padding: 10px 12px; background:#f7f6fb; color:#4A148C; font-weight:700; border-bottom:1px solid #ece9f7; }
      .card-bd { padding: 12px; }

      .kgrid { display:grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; }
      .kv { display:flex; gap: 8px; font-size: 11.5pt; }
      .k { color:#6b7280; min-width:120px; }

      table { width:100%; border-collapse: collapse; }
      th, td { border: 1px solid #ece9f7; padding: 8px 10px; font-size: 11.5pt; }
      th { background:#f7f6fb; color:#374151; text-align:left; }
      td.r { text-align:right; }

      .chips { display:flex; flex-wrap: wrap; gap:6px; }
      .chip { background:#EEF2FF; color:#3730A3; border:1px solid #C7D2FE; border-radius:999px; padding:4px 10px; font-size: 10.5pt; }

      .itbox { background:#f9fafb; border:1px solid #e5e7eb; border-radius: 8px; padding: 10px; margin-bottom: 8px; }
      .itT { font-weight:700; margin-bottom: 4px; color:#111827; }
      .small { font-size: 10.5pt; color:#374151; }

      .footer { text-align:center; color:#6b7280; font-size:10pt; margin-top: 10mm; }
      .pb { page-break-before: always; }
    `;

    const hotelsRows = (Array.isArray(Hotels) ? Hotels : []).map(h => `
      <tr>
        <td>${clean(h.Name) || 'N/A'}</td>
        <td>${clean(h.City) || 'N/A'}</td>
        <td>${dstr(h.CheckInDate)}</td>
        <td>${dstr(h.CheckOutDate)}</td>
        <td>${clean(h.RoomType) || 'N/A'}</td>
      </tr>
    `).join('');

    const itinBlocks = (Array.isArray(Itinearies) ? Itinearies : [])
      .filter(i => i && i.day != null)
      .map(i => `
        <div class="itbox">
          <div class="itT">Day ${i.day}${i.Title ? ` – ${clean(i.Title)}` : ''}</div>
          <div class="small">${clean(i.Description) || '—'}</div>
        </div>
      `).join('');

    const incList = (Array.isArray(Inclusions) && Inclusions.length)
      ? Inclusions.map(x => `<li>${clean(x.item)}</li>`).join('')
      : '<li>No inclusions specified</li>';

    const excList = (Array.isArray(Exclusions) && Exclusions.length)
      ? Exclusions.map(x => `<li>${clean(x.item)}</li>`).join('')
      : '<li>No exclusions specified</li>';

    const gstNote = GST && GST.WaivedOffAmount ? 'Waived' : 'Included';
    const tcsNote = TCS && TCS.WaivedOffAmount ? 'Waived' : 'Included';

    const COVER = `
      <section class="cover">
        <div class="cover-inner">
          <div>
            <div class="brand-logo">WINTERFELL HOLIDAYS</div>
            <div class="tag1">Designed for Dreamers.</div>
            <div class="tag2">Built for Travelers....</div>
          </div>
        </div>
      </section>
    `;

    const PAGE1 = `
      <section class="page">
        <h1 class="title">TRAVEL QUOTATION</h1>
        <div class="stripe"></div>

        <div class="card">
          <div class="card-hd">Client Details</div>
          <div class="card-bd">
            <div class="kgrid">
              <div class="kv"><div class="k">Name</div><div>${clean(clientName)}</div></div>
              <div class="kv"><div class="k">Travel Dates</div><div>${travelStart} to ${travelEnd}</div></div>
              <div class="kv"><div class="k">Contact</div><div>${clean(clientContact)}</div></div>
              <div class="kv"><div class="k">Duration</div><div>${Days ?? ''} Days / ${Nights ?? ''} Nights</div></div>
              <div class="kv"><div class="k">Email</div><div>${clean(clientEmail)}</div></div>
              <div class="kv"><div class="k">Destination</div><div>${clean(DestinationName) || 'N/A'}</div></div>
              <div class="kv"><div class="k">Pax</div><div>${pax} Adult${pax == 1 ? '' : 's'}${child ? `, ${child} Child` : ''}${infant ? `, ${infant} Infant` : ''}</div></div>
              <div class="kv"><div class="k">Quotation #</div><div>${TripId || 'N/A'}</div></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-hd">Accommodation</div>
          <div class="card-bd">
            <table>
              <thead><tr><th>Hotel</th><th>City</th><th>Check-in</th><th>Check-out</th><th>Room Type</th></tr></thead>
              <tbody>${hotelsRows || '<tr><td colspan="5">No accommodation specified</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-hd">Cost Summary</div>
          <div class="card-bd">
            <table>
              <tr><td>Land Package Cost</td><td class="r">${money(Costs.LandPackageCost, Currency)}</td></tr>
              <tr><td>Flight Cost</td><td class="r">${money(Costs.FlightCost, Currency)}</td></tr>
              <tr><td>Visa Cost</td><td class="r">${money(Costs.VisaCost, Currency)}</td></tr>
              ${Costs.GSTAmount != null ? `<tr><td>GST (${gstNote})</td><td class="r">${money(Costs.GSTAmount, Currency)}</td></tr>` : ''}
              ${Costs.TCSAmount != null ? `<tr><td>TCS (${tcsNote})</td><td class="r">${money(Costs.TCSAmount, Currency)}</td></tr>` : ''}
              <tr><th>Total Cost</th><th class="r">${money(Costs.TotalCost, Currency)}</th></tr>
            </table>
            <div class="chips" style="margin-top:10px;">
              <div class="chip">${Days ?? ''} Days</div>
              <div class="chip">${Nights ?? ''} Nights</div>
              <div class="chip">Currency: ${Currency}</div>
            </div>
          </div>
        </div>

        <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
      </section>
    `;

    const PAGE2 = `
      <section class="page pb">
        <div class="card">
          <div class="card-hd">Itinerary</div>
          <div class="card-bd">
            ${itinBlocks || '<div class="small">No detailed itinerary available.</div>'}
          </div>
        </div>

        <div class="card">
          <div class="card-hd">Inclusions & Exclusions</div>
          <div class="card-bd" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <div class="small" style="font-weight:700;margin-bottom:6px;">Inclusions</div>
              <ul class="small" style="margin:0;padding-left:18px;">${incList}</ul>
            </div>
            <div>
              <div class="small" style="font-weight:700;margin-bottom:6px;">Exclusions</div>
              <ul class="small" style="margin:0;padding-left:18px;">${excList}</ul>
            </div>
          </div>
        </div>
      </section>
    `;

    return `
      <!DOCTYPE html>
      <html><head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Travel Quotation</title>
        <style>${styles}</style>
      </head>
      <body>
        ${COVER}
        ${PAGE1}
        ${PAGE2}
      </body></html>
    `;
  };

  const htmlPreview = useMemo(() => buildHtml('preview'), [quotationData, template]);
  const htmlPdf = useMemo(() => buildHtml('pdf'), [quotationData, template]);

  if (!template) {
    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A148C" />
        </View>
      </Modal>
    );
  }

  const generatePdf = async () => {
    try {
      setLoading(true);
      const { uri } = await printToFileAsync({
        html: htmlPdf,
        base64: false,
        ...(Platform.OS === 'ios' ? { margins: { top: 0, right: 0, bottom: 0, left: 0 } } : {}),
      });
      await shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({
        html: htmlPdf,
        ...(Platform.OS === 'ios' && selectedPrinter?.url ? { printerUrl: selectedPrinter.url } : {}),
      });
    } catch (e) {
      console.error('Print error:', e);
      alert('Failed to print.');
    }
  };

  const pickPrinter = async () => {
    if (Platform.OS !== 'ios') return;
    try {
      const printer = await Print.selectPrinterAsync();
      setSelectedPrinter(printer);
    } catch (e) {
      console.error('Select printer error:', e);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quotation Preview</Text>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <MaterialIcons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.preview}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlPreview }}
            style={styles.webview}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            bounces={false}
            scrollEnabled
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.light]} onPress={onClose} disabled={loading}>
            <Text style={[styles.buttonText, { color: '#111' }]}>Close</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={[styles.button, styles.light]} onPress={pickPrinter} disabled={loading}>
              <Text style={[styles.buttonText, { color: '#111' }]}>
                {selectedPrinter?.name ? `Printer: ${selectedPrinter.name}` : 'Select Printer'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={handlePrint} disabled={loading}>
            <Text style={styles.buttonText}>Print</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={generatePdf} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Generating…' : 'Download PDF'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  headerText: { fontSize: 18, fontWeight: '700' },
  iconBtn: { padding: 6, borderRadius: 6, backgroundColor: '#f3f4f6' },
  preview: { flex: 1, padding: 10 },
  webview: { flex: 1, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 14, borderTopWidth: 1, borderTopColor: '#eee'
  },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  light: { backgroundColor: '#f3f4f6' },
  primary: { backgroundColor: '#4A148C' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default QuotationPdfViewer;
