// import * as Print from "expo-print";
// import { shareAsync } from "expo-sharing";
// import { getTemplateWithCacheBust } from "./pdfWatcher";

// // 🚀 INSTANT HTML PREVIEW - No PDF generation delay
// export function getInstantHtmlPreview(data) {
//   console.log("⚡ Generating instant HTML preview...");
//   const TemplateWinterfell = getTemplateWithCacheBust();
//   const html = TemplateWinterfell(data);
//   console.log("✅ HTML ready instantly");
//   return { html, data };
// }

// // 🐌 LAZY PDF GENERATION - Only when user clicks download
// export async function generatePdfFromHtml(html) {
//   try {
//     console.log("📄 Converting HTML to PDF (lazy)...");
//     const { uri } = await Print.printToFileAsync({ html });
//     console.log("✅ PDF generated at:", uri);
//     return uri;
//   } catch (error) {
//     console.error("❌ PDF generation error:", error);
//     throw error;
//   }
// }

// // 🔄 LEGACY: Keep for backward compatibility
// export async function generateWinterfellPdf(data) {
//   const TemplateWinterfell = getTemplateWithCacheBust();
//   const html = TemplateWinterfell(data);
//   const { uri } = await Print.printToFileAsync({ html });
//   return uri;
// }

// // 🔄 LEGACY: Keep for backward compatibility  
// export async function previewPdf(data) {
//   try {
//     console.log("📄 Starting PDF generation...");
//     console.log("📄 Generating HTML template...");
//     const TemplateWinterfell = getTemplateWithCacheBust();
//     const html = TemplateWinterfell(data);
//     console.log("📄 HTML length:", html.length);
    
//     console.log("📄 Converting HTML to PDF...");
//     const { uri } = await Print.printToFileAsync({ html });
//     console.log("📄 PDF created at:", uri);
    
//     return { uri, html };
//   } catch (error) {
//     console.error("❌ PDF generation error:", error);
//     console.error("❌ Error message:", error.message);
//     throw error;
//   }
// }

// export async function sharePdf(data) {
//   const uri = await generateWinterfellPdf(data);
//   await shareAsync(uri);
// }
