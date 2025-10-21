// app/QuotationScreen.tsx
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IntegratedQuotationForm from '@/components/form/IntegratedQuotationForm';
import { clearQuotationDraft } from '@/storage/quotationDrafts';
import QuotationPdfViewer from '@/components/QuotationPdfViewer';

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [quotationData, setQuotationData] = useState(null);

  const handleFormSubmit = async (data) => {
    console.log('Quotation Form Submitted:', data);
    setQuotationData(data);
    setShowPdfPreview(true);
    
    try {
      // Uncomment when API is ready
      // await api.createQuotation(data.TripId, data);
      await clearQuotationDraft(data.TripId);
    } catch (error) {
      console.error('Error saving quotation:', error);
      Alert.alert('Error', 'Failed to save quotation. Please try again.');
    }
  };

  const handlePdfClose = () => {
    setShowPdfPreview(false);
    // Optionally navigate back or show success message
    // router.back();
    // Alert.alert('Success', 'Quotation created successfully!');
  };

  return (
    <View style={{ flex: 1 }}>
      <IntegratedQuotationForm
        onSubmit={handleFormSubmit}
        lead={leadData}
      />
      
      <QuotationPdfViewer
        visible={showPdfPreview}
        onClose={handlePdfClose}
        quotationData={quotationData}
      />
    </View>
  );
};

export default QuotationScreen;
